export interface ISpeechService {
  speak(text: string, lang: 'en' | 'te' | 'hi'): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): Promise<boolean>;
}
