import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

interface DateDifferenceProps {
  colors: any;
  isDark: boolean;
}

export const DateDifference: React.FC<DateDifferenceProps> = ({ colors, isDark }) => {
  const [from, setFrom] = useState({ d: '', m: '', y: '' });
  const [to, setTo]     = useState({ d: '', m: '', y: '' });
  const [result, setResult] = useState<{ days: number; weeks: number; months: number; years: number } | null>(null);

  const calculate = () => {
    const fd = new Date(parseInt(from.y), parseInt(from.m) - 1, parseInt(from.d));
    const td = new Date(parseInt(to.y),   parseInt(to.m)   - 1, parseInt(to.d));
    if (isNaN(fd.getTime()) || isNaN(td.getTime())) return;
    const diff  = Math.abs(td.getTime() - fd.getTime());
    const days  = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years  = Math.floor(days / 365.25);
    setResult({ days, weeks, months, years });
  };

  const reset = () => {
    setFrom({ d: '', m: '', y: '' });
    setTo({ d: '', m: '', y: '' });
    setResult(null);
  };

  const DateFieldsInput = ({ label, val, onChange }: { label: string; val: typeof from; onChange: (v: typeof from) => void }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[
          { key: 'd' as const, ph: 'DD', max: 2 },
          { key: 'm' as const, ph: 'MM', max: 2 },
          { key: 'y' as const, ph: 'YYYY', max: 4 },
        ].map((f) => (
          <TextInput
            key={f.key}
            style={[styles.inputStyle, { flex: f.key === 'y' ? 2 : 1, marginBottom: 0, backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder={f.ph}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            maxLength={f.max}
            value={val[f.key]}
            onChangeText={(v) => onChange({ ...val, [f.key]: v })}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.toolCardLayout}>
      <DateFieldsInput label="From Date" val={from} onChange={setFrom} />
      <DateFieldsInput label="To Date" val={to} onChange={setTo} />

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.calcBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1, flex: 2 }]} onPress={calculate}>
          <Text style={[styles.calcBtnText, { color: colors.uniformPastelText }]}>Calculate Difference</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border, flex: 1 }]} onPress={reset}>
          <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.ddGrid, { backgroundColor: colors.card, borderColor: colors.uniformPastelBorder }]}>
          {[
            { label: 'Days',   value: result.days.toLocaleString(),   color: '#60a5fa' },
            { label: 'Weeks',  value: result.weeks.toLocaleString(),  color: '#4ade80' },
            { label: 'Months', value: result.months.toLocaleString(), color: '#fbbf24' },
            { label: 'Years',  value: result.years.toLocaleString(),  color: '#c084fc' },
          ].map((item) => (
            <View key={item.label} style={styles.ddItem}>
              <Text style={[styles.ddNum, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.ddLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
            </View>
          ))}
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
  ddGrid: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ddItem: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
  },
  ddNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  ddLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
});
