import * as Speech from 'expo-speech';
import type { ISpeechService } from '../../domain/services/ISpeechService';

export class ExpoSpeechService implements ISpeechService {
  async speak(text: string, lang: 'en' | 'te' | 'hi'): Promise<void> {
    try {
      // First, cancel any ongoing speech to avoid overlapping audio
      await Speech.stop();

      let voiceLocale = 'en-IN';
      if (lang === 'te') {
        voiceLocale = 'te-IN';
      } else if (lang === 'hi') {
        voiceLocale = 'hi-IN';
      }

      // Read text using expo-speech
      Speech.speak(text, {
        language: voiceLocale,
        rate: 0.95, // slightly slower for better clarity in rural contexts
        pitch: 1.0,
      });
    } catch (error) {
      console.warn('Speech synthesis error:', error);
    }
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.warn('Speech stop error:', error);
    }
  }

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  }
}
