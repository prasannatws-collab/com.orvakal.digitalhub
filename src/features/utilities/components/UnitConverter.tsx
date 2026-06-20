import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';

interface UnitConverterProps {
  colors: any;
  isDark: boolean;
}

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area';

const UNIT_DEFS: Record<UnitCategory, { label: string; units: string[]; toBase: (v: number, u: string) => number; fromBase: (v: number, u: string) => number }> = {
  length: {
    label: '📏 Length',
    units: ['mm', 'cm', 'm', 'km', 'inch', 'feet', 'yard', 'mile'],
    toBase:   (v, u) => (({ mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, feet: 0.3048, yard: 0.9144, mile: 1609.34 } as Record<string, number>)[u] ?? 1) * v,
    fromBase: (v, u) => v / ((({ mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, feet: 0.3048, yard: 0.9144, mile: 1609.34 } as Record<string, number>)[u] ?? 1)),
  },
  weight: {
    label: '⚖️ Weight',
    units: ['mg', 'g', 'kg', 'ton', 'oz', 'lb'],
    toBase:   (v, u) => (({ mg: 0.000001, g: 0.001, kg: 1, ton: 1000, oz: 0.0283495, lb: 0.453592 } as Record<string, number>)[u] ?? 1) * v,
    fromBase: (v, u) => v / ((({ mg: 0.000001, g: 0.001, kg: 1, ton: 1000, oz: 0.0283495, lb: 0.453592 } as Record<string, number>)[u] ?? 1)),
  },
  temperature: {
    label: '🌡️ Temperature',
    units: ['°C', '°F', 'K'],
    toBase:   (v, u) => u === '°C' ? v : u === '°F' ? (v - 32) * 5 / 9 : v - 273.15,
    fromBase: (v, u) => u === '°C' ? v : u === '°F' ? v * 9 / 5 + 32 : v + 273.15,
  },
  area: {
    label: '🔲 Area',
    units: ['cm²', 'm²', 'km²', 'acre', 'hectare', 'sqft'],
    toBase:   (v, u) => (({ 'cm²': 0.0001, 'm²': 1, 'km²': 1e6, 'acre': 4046.86, 'hectare': 10000, 'sqft': 0.092903 } as Record<string, number>)[u] ?? 1) * v,
    fromBase: (v, u) => v / ((({ 'cm²': 0.0001, 'm²': 1, 'km²': 1e6, 'acre': 4046.86, 'hectare': 10000, 'sqft': 0.092903 } as Record<string, number>)[u] ?? 1)),
  },
};

export const UnitConverter: React.FC<UnitConverterProps> = ({ colors, isDark }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit]     = useState('km');
  const [inputVal, setInputVal] = useState('');
  const [result, setResult]     = useState('');

  const def = UNIT_DEFS[category];

  const convert = (val: string) => {
    setInputVal(val);
    const num = parseFloat(val);
    if (isNaN(num)) { setResult(''); return; }
    const base = def.toBase(num, fromUnit);
    const out  = def.fromBase(base, toUnit);
    setResult(isFinite(out) ? (Math.round(out * 1e8) / 1e8).toString() : '—');
  };

  const switchCat = (c: UnitCategory) => {
    setCategory(c);
    const units = UNIT_DEFS[c].units;
    setFromUnit(units[0]);
    setToUnit(units[1] ?? units[0]);
    setInputVal('');
    setResult('');
  };

  return (
    <View style={styles.toolCardLayout}>
      {/* Category selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catTabRow}>
        {(Object.keys(UNIT_DEFS) as UnitCategory[]).map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catTab, { backgroundColor: category === c ? colors.uniformPastelBg : (isDark ? 'rgba(0,163,184,0.06)' : 'rgba(0,107,120,0.04)'), borderColor: category === c ? colors.uniformPastelBorder : colors.border }]}
            onPress={() => switchCat(c)}
          >
            <Text style={[styles.catTabText, { color: category === c ? colors.uniformPastelText : colors.mutedForeground }]}>{UNIT_DEFS[c].label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* From Selector */}
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Convert From</Text>
      <View style={styles.unitChipContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {def.units.map((u) => (
            <TouchableOpacity key={u} style={[styles.unitChip, { backgroundColor: fromUnit === u ? colors.uniformPastelBg : colors.card, borderColor: fromUnit === u ? colors.uniformPastelBorder : colors.border }]} onPress={() => { setFromUnit(u); convert(inputVal); }}>
              <Text style={[styles.unitChipText, { color: fromUnit === u ? colors.uniformPastelText : colors.foreground }]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* To Selector */}
      <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 10 }]}>Convert To</Text>
      <View style={styles.unitChipContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {def.units.map((u) => (
            <TouchableOpacity key={u} style={[styles.unitChip, { backgroundColor: toUnit === u ? colors.uniformPastelBg : colors.card, borderColor: toUnit === u ? colors.uniformPastelBorder : colors.border }]} onPress={() => { setToUnit(u); convert(inputVal); }}>
              <Text style={[styles.unitChipText, { color: toUnit === u ? colors.uniformPastelText : colors.foreground }]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 14 }]}>Enter Value</Text>
      <TextInput
        style={[styles.inputStyle, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        placeholder={`Value in ${fromUnit}`}
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numeric"
        value={inputVal}
        onChangeText={convert}
      />

      {result !== '' && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.uniformPastelBorder }]}>
          <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>{inputVal} {fromUnit} =</Text>
          <Text style={[styles.resultBig, { color: colors.uniformPastelText }]}>{result} {toUnit}</Text>
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
  catTabRow: {
    gap: 8,
    marginBottom: 10,
    paddingVertical: 2,
  },
  catTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  catTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  unitChipContainer: {
    paddingVertical: 4,
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
