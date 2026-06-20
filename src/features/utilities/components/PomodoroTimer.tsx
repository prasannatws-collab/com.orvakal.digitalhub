import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface PomodoroTimerProps {
  colors: any;
  isDark: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ colors, isDark }) => {
  type Phase = 'work' | 'short' | 'long';
  const DURATIONS: Record<Phase, number> = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const LABELS:    Record<Phase, string> = { work: '🍅 Focus Session', short: '☕ Short Break', long: '🌿 Long Break' };

  const [phase, setPhase]       = useState<Phase>('work');
  const [remaining, setRemain]  = useState(DURATIONS.work);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef                = useRef(0);
  const pausedRef               = useRef(DURATIONS.work * 1000);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const startStop = () => {
    if (!running) {
      startRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
        const left    = DURATIONS[phase] - elapsed - (DURATIONS[phase] - Math.floor(pausedRef.current / 1000));
        if (left <= 0) {
          clearInterval(intervalRef.current!);
          setRemain(0);
          setRunning(false);
          if (phase === 'work') setSessions((s) => s + 1);
        } else {
          setRemain(left);
        }
      }, 500);
      setRunning(true);
    } else {
      clearInterval(intervalRef.current!);
      pausedRef.current = remaining * 1000;
      setRunning(false);
    }
  };

  const switchPhase = (p: Phase) => {
    clearInterval(intervalRef.current!);
    setPhase(p);
    setRemain(DURATIONS[p]);
    pausedRef.current = DURATIONS[p] * 1000;
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setRemain(DURATIONS[phase]);
    pausedRef.current = DURATIONS[phase] * 1000;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, []);

  const progress = remaining / DURATIONS[phase];
  const borderClr = colors.uniformPastelBorder;

  return (
    <View style={styles.toolCardLayout}>
      <Text style={[styles.pomTitleSub, { color: colors.mutedForeground, textAlign: 'center', marginBottom: 12 }]}>
        Completed focus loops: {sessions} 🎯
      </Text>

      {/* Phase selection */}
      <View style={[styles.toggleRow, { backgroundColor: isDark ? 'rgba(0,163,184,0.06)' : 'rgba(0,107,120,0.04)', borderColor: borderClr }]}>
        {(['work', 'short', 'long'] as Phase[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.toggleBtn, phase === p && { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]}
            onPress={() => switchPhase(p)}
          >
            <Text style={[styles.toggleBtnText, { color: phase === p ? colors.uniformPastelText : colors.mutedForeground, fontSize: 10 }]}>
              {p === 'work' ? '🍅 Work' : p === 'short' ? '☕ Break' : '🌿 Long'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clock Face */}
      <View style={[styles.clockFace, { backgroundColor: colors.card, borderColor: borderClr, padding: 32 }]}>
        <Text style={[styles.phaseLabel, { color: phase === 'work' ? '#ef4444' : phase === 'short' ? '#f59e0b' : '#10b981' }]}>
          {LABELS[phase]}
        </Text>
        <Text style={[styles.timeText, { color: colors.foreground, fontSize: 58 }]}>{fmt(remaining)}</Text>
        <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', height: 8 }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: phase === 'work' ? '#ef4444' : phase === 'short' ? '#f59e0b' : '#10b981' }]} />
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.calcBtn, { backgroundColor: running ? '#6b7280' : colors.uniformPastelBg, borderColor: running ? '#6b7280' : colors.uniformPastelBorder, borderWidth: running ? 0 : 1, flex: 2 }]} onPress={startStop}>
          <Text style={[styles.calcBtnText, { color: running ? '#fff' : colors.uniformPastelText }]}>{running ? 'Pause ⏸' : 'Start Focus ▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: borderClr, flex: 1 }]} onPress={reset}>
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
  pomTitleSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
});
