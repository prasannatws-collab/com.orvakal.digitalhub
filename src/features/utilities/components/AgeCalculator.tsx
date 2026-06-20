import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

interface AgeCalculatorProps {
  colors: any;
  isDark: boolean;
}

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({ colors, isDark }) => {
  const [day, setDay]     = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear]   = useState('');
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const calculate = () => {
    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900) return;
    const dob  = new Date(y, m - 1, d);
    const now  = new Date();
    if (dob > now) return;
    let years  = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth()    - dob.getMonth();
    let days   = now.getDate()     - dob.getDate();
    if (days < 0)   { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--;  months += 12; }
    const totalDays = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
    setResult({ years, months, days, totalDays });
  };

  const reset = () => {
    setDay('');
    setMonth('');
    setYear('');
    setResult(null);
  };

  return (
    <View style={styles.toolCardLayout}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Enter Date of Birth</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {[
          { val: day, set: setDay, ph: 'DD', max: 2 },
          { val: month, set: setMonth, ph: 'MM', max: 2 },
          { val: year, set: setYear, ph: 'YYYY', max: 4 }
        ].map((f, i) => (
          <TextInput
            key={i}
            style={[styles.inputStyle, { flex: i === 2 ? 2 : 1, marginBottom: 0, backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder={f.ph}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            maxLength={f.max}
            value={f.val}
            onChangeText={f.set}
          />
        ))}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.calcBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1, flex: 2 }]} onPress={calculate}>
          <Text style={[styles.calcBtnText, { color: colors.uniformPastelText }]}>Calculate Age</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border, flex: 1 }]} onPress={reset}>
          <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.uniformPastelBorder }]}>
          <Text style={[styles.ageBigText, { color: colors.uniformPastelText }]}>
            {result.years} years, {result.months} months, {result.days} days
          </Text>
          <Text style={[styles.ageSubText, { color: colors.mutedForeground }]}>
            ✨ Total days lived: {result.totalDays.toLocaleString()} days
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toolCardLayout: {
    gap: 12,
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
  ageBigText: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  ageSubText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});
