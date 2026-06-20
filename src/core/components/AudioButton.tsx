import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Volume2, Square } from 'lucide-react-native';
import { useTheme } from '../state/ThemeContext';
import { useLanguage } from '../state/LanguageContext';
import { DI } from '../di';

interface AudioButtonProps {
  text: string;
  size?: number;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ text, size = 16 }) => {
  const { colors } = useTheme();
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const speechService = DI.getSpeechService();

  useEffect(() => {
    // Poller to sync playing state if speech finishes automatically
    const timer = setInterval(async () => {
      const speaking = await speechService.isSpeaking();
      if (!speaking && isPlaying) {
        setIsPlaying(false);
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying]);

  const handlePress = async () => {
    try {
      setLoading(true);
      if (isPlaying) {
        await speechService.stop();
        setIsPlaying(false);
      } else {
        await speechService.speak(text, lang);
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />;
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {
          borderColor: isPlaying ? colors.secondary : colors.border,
          backgroundColor: isPlaying ? `${colors.secondary}15` : colors.card,
        },
      ]}
      accessibilityLabel={isPlaying ? "Stop speech" : "Read text aloud"}
    >
      {isPlaying ? (
        <Square size={size} color={colors.secondary} fill={colors.secondary} />
      ) : (
        <Volume2 size={size} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    padding: 8,
  },
});
