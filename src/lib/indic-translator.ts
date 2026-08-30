/**
 * LexNova Indic AI Engine — Multilingual Legal Access for 800M+ Citizens
 * Translates complex legal analysis and statutory notices into vernacular Indian languages.
 */

import { dispatchAIGateway } from '@/lib/ai-gateway';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export interface TranslateOptions {
  text: string;
  targetLang: SupportedLanguageCode;
  preserveLegalTerms?: boolean;
}

export async function translateLegalText({
  text,
  targetLang,
  preserveLegalTerms = true,
}: TranslateOptions): Promise<string> {
  if (targetLang === 'en' || !text) {
    return text;
  }

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
  const targetLangName = langObj ? langObj.name : 'Hindi';

  const systemPrompt = `
You are an expert Indian Legal Translator fluent in English and ${targetLangName}.
Translate the following legal brief into simple, clear, and dignified ${targetLangName} so that a common citizen can fully understand their legal rights.
${
  preserveLegalTerms
    ? 'Keep official statutory citations, Act names, Section numbers, and court names in English alongside the vernacular explanation (e.g. "भारतीय दंड संहिता (IPC Section 420)").'
    : ''
}
`;

  const response = await dispatchAIGateway({
    messages: [{ role: 'user', content: text }],
    systemPrompt,
    temperature: 0.1,
    enableCache: true,
  });

  return response.content;
}

export default translateLegalText;
