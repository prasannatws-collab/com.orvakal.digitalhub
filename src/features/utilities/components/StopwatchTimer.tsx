import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

interface StopwatchTimerProps {
  colors: any;
  isDark: boolean;
}

export const StopwatchTimer: React.FC<StopwatchTimerProps> = ({ colors, isDark }) => {
  const [mode, setMode]         = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);       // ms
  const [cdInput, setCdInput]   = useState('');       // seconds input
  const [cdTotal, setCdTotal]   = useState(0);        // countdown total ms
  const [cdRemain, setCdRemain] = useState(0);        // countdown remaining ms
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef                = useRef<number>(0);
  const pausedRef               = useRef<number>(0);

  const fmt = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return h > 0
      ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  };

  const startStop = () => {
    if (mode === 'stopwatch') {
      if (!running) {
        startRef.current = Date.now() - pausedRef.current;
        intervalRef.current = setInterval(() => {
          setElapsed(Date.now() - startRef.current);
        }, 30);
        setRunning(true);
      } else {
        clearInterval(intervalRef.current!);
        pausedRef.current = elapsed;
        setRunning(false);
      }
    } else {
      if (!running) {
        const total = cdTotal > 0 ? cdTotal : parseInt(cdInput) * 1000;
        if (!total || isNaN(total)) return;
        setCdTotal(total);
        setCdRemain(total);
        startRef.current = Date.now();
        intervalRef.current = setInterval(() => {
          const remaining = total - (Date.now() - startRef.current);
          if (remaining <= 0) {
            clearInterval(intervalRef.current!);
            setCdRemain(0);
            setRunning(false);
          } else {
            setCdRemain(remaining);
          }
        }, 100);
        setRunning(true);
      } else {
        clearInterval(intervalRef.current!);
        setRunning(false);
      }
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setElapsed(0);
    pausedRef.current = 0;
    setCdRemain(0);
    setCdTotal(0);
    setCdInput('');
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, []);

  const displayTime = mode === 'stopwatch' ? fmt(elapsed) : fmt(cdRemain);
  const isDone      = mode === 'countdown' && cdTotal > 0 && cdRemain === 0;
  const progress    = mode === 'countdown' && cdTotal > 0 ? (cdRemain / cdTotal) : 1;

  return (
    <View style={styles.toolCardLayout}>
      <View style={[styles.toggleRow, { backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)', borderColor: colors.border }]}>
        {(['stopwatch', 'countdown'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.toggleBtn, mode === m && { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]}
            onPress={() => { setMode(m); reset(); }}
          >
            <Text style={[styles.toggleBtnText, { color: mode === m ? colors.uniformPastelText : colors.mutedForeground }]}>
              {m === 'stopwatch' ? '⏱ Stopwatch' : '⏳ Countdown Timer'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.clockFace, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {isDone ? (
          <Text style={styles.doneText}>🎉 Time's Up!</Text>
        ) : (
          <Text style={[styles.timeText, { color: colors.foreground }]}>{displayTime}</Text>
        )}
        {mode === 'countdown' && cdTotal > 0 && (
          <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: isDone ? '#ef4444' : '#4ade80' }]} />
          </View>
        )}
      </View>

      {mode === 'countdown' && !running && cdTotal === 0 && (
        <>
          <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Set Time (seconds)</Text>
          <TextInput
            style={[styles.inputStyle, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. 180 for 3 minutes"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            value={cdInput}
            onChangeText={setCdInput}
          />
        </>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.calcBtn, { backgroundColor: running ? '#dc2626' : colors.uniformPastelBg, borderColor: running ? '#dc2626' : colors.uniformPastelBorder, borderWidth: 1, flex: 2 }]}
          onPress={startStop}
        >
          <Text style={[styles.calcBtnText, { color: running ? '#fff' : colors.uniformPastelText }]}>{running ? 'Pause ⏸' : (elapsed > 0 || cdRemain > 0) ? 'Resume ▶' : 'Start ▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border, flex: 1 }]} onPress={reset}>
          <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolCardLayout: {
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: -4,
  },
  inputStyle: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  calcBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  calcBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  resetBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  clockFace: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  doneText: {
    fontSize: 28,
    fontWeight: '900',
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
