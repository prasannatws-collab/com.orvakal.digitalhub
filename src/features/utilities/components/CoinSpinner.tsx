import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Platform } from 'react-native';

interface CoinSpinnerProps {
  colors: any;
  isDark: boolean;
}

export const CoinSpinner: React.FC<CoinSpinnerProps> = ({ colors, isDark }) => {
  const [result, setResult]     = useState<'heads' | 'tails' | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [suspenseText, setSuspenseText] = useState('Tap to flip the golden coin!');
  const [heads, setHeads]       = useState(0);
  const [tails, setTails]       = useState(0);
  
  // Animation refs
  const spinAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    spinAnim.setValue(0);

    // Setup sequence of suspense texts over the 5 seconds duration
    setSuspenseText('🪙 Tossing the coin high...');
    
    setTimeout(() => {
      setSuspenseText('🌀 Spinning in mid-air...');
    }, 1200);

    setTimeout(() => {
      setSuspenseText('✨ Defying gravity...');
    }, 2400);

    setTimeout(() => {
      setSuspenseText('👀 Descending quickly...');
    }, 3600);

    setTimeout(() => {
      setSuspenseText('🔍 Revealing outcome...');
    }, 4600);

    // Animate over 5200ms (5.2 seconds for great suspense)
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 5200,
      easing: Easing.bezier(0.15, 0.85, 0.35, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      if (outcome === 'heads') {
        setHeads((h) => h + 1);
        setSuspenseText('👑 ✨ HEADS!');
      } else {
        setTails((t) => t + 1);
        setSuspenseText('🦅 TAILS!');
      }
      setSpinning(false);
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Interpolate rotation for 3D flip (rotate on the Y axis 15 full times)
  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5400deg'],
  });

  // Interpolate scale for altitude (coin rises up and comes back down)
  const spinScale = spinAnim.interpolate({
    inputRange: [0, 0.15, 0.5, 0.85, 1],
    outputRange: [1, 1.4, 1.6, 1.1, 1],
  });

  // Dynamic colors for the golden aesthetic coin
  const goldColor = isDark ? '#d97706' : '#f59e0b';
  const coinBorderColor = isDark ? '#fbbf24' : '#b45309';

  return (
    <View style={styles.toolCardLayout}>
      <Text style={[styles.pomTitleSub, { color: colors.mutedForeground, textAlign: 'center', marginBottom: 16 }]}>
        5-Second High-Suspense Flip
      </Text>

      {/* Golden Coin Area */}
      <View style={styles.coinWrapper}>
        <Animated.View
          style={[
            styles.coinCircle,
            {
              transform: [{ rotateY: spinRotate }, { scale: spinScale }],
              backgroundColor: goldColor,
              borderColor: coinBorderColor,
              shadowColor: goldColor,
            },
          ]}
        >
          {/* Inner ring for aesthetic look */}
          <View style={[styles.coinInnerRing, { borderColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.3)' }]}>
            <Text style={styles.coinEmojiLarge}>
              {result === null ? '🪙' : result === 'heads' ? '👑' : '🦅'}
            </Text>
          </View>
        </Animated.View>

        {/* Suspense / Result Label */}
        <Text style={[styles.suspenseText, { color: colors.foreground }]}>
          {suspenseText}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.calcBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1, marginBottom: 14 }]}
        onPress={spin}
        disabled={spinning}
      >
        <Text style={[styles.calcBtnText, { color: colors.uniformPastelText }]}>
          {spinning ? '🌀 Spinning...' : '🪙 Flip Coin'}
        </Text>
      </TouchableOpacity>

      {/* Scoreboard */}
      {(heads + tails > 0) && (
        <View style={[styles.scoreRow, { backgroundColor: colors.card, borderColor: colors.uniformPastelBorder }]}>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreNum, { color: '#4ade80' }]}>{heads}</Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>👑 Heads</Text>
          </View>
          <View style={[styles.scoreDivider, { backgroundColor: colors.uniformPastelBorder }]} />
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreNum, { color: '#60a5fa' }]}>{tails}</Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>🦅 Tails</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toolCardLayout: {
    gap: 12,
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
  pomTitleSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  coinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 18,
  },
  coinCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  coinInnerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinEmojiLarge: {
    fontSize: 52,
  },
  suspenseText: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    minHeight: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
  },
  scoreNum: {
    fontSize: 30,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreDivider: {
    width: 1.5,
  },
});
