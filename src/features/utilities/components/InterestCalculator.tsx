import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

interface InterestCalculatorProps {
  colors: any;
  isDark: boolean;
}

export const InterestCalculator: React.FC<InterestCalculatorProps> = ({ colors, isDark }) => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [calcType, setCalcType] = useState<'simple' | 'compound'>('simple');
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) return;
    if (calcType === 'simple') {
      const interest = (p * r * t) / 100;
      setResult({ interest, total: p + interest });
    } else {
      const total = p * Math.pow(1 + r / 100, t);
      setResult({ interest: total - p, total });
    }
  };

  const reset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setResult(null);
  };

  return (
    <View style={styles.toolCardLayout}>
      <View style={[styles.toggleRow, { backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)', borderColor: colors.border }]}>
        {(['simple', 'compound'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.toggleBtn, calcType === type && { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]}
            onPress={() => { setCalcType(type); setResult(null); }}
          >
            <Text style={[styles.toggleBtnText, { color: calcType === type ? colors.uniformPastelText : colors.mutedForeground }]}>
              {type === 'simple' ? '📊 Simple Interest' : 'Compound Interest 📈'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Principal Amount (₹)</Text>
      <TextInput
        style={[styles.inputStyle, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        placeholder="e.g. 10000"
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numeric"
        value={principal}
        onChangeText={setPrincipal}
      />

      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Annual Rate (%)</Text>
      <TextInput
        style={[styles.inputStyle, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        placeholder="e.g. 8.5"
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />

      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Time (Years)</Text>
      <TextInput
        style={[styles.inputStyle, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        placeholder="e.g. 3"
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.calcBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1, flex: 2 }]} onPress={calculate}>
          <Text style={[styles.calcBtnText, { color: colors.uniformPastelText }]}>Calculate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border, flex: 1 }]} onPress={reset}>
          <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: '#4ade80' }]}>
          <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Interest Earned</Text>
          <Text style={[styles.resultBig, { color: '#4ade80' }]}>₹ {result.interest.toFixed(2)}</Text>
          <View style={[styles.resultDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]} />
          <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Total Amount</Text>
          <Text style={[styles.resultBig, { color: colors.uniformPastelText }]}>₹ {result.total.toFixed(2)}</Text>
        </View>
      )}
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
  resultCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultBig: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  resultDivider: {
    width: '80%',
    height: 1,
    marginVertical: 10,
  },
});
