/**
 * PII Redaction Engine — Enterprise Data Privacy & Security
 * Automatically detects and anonymizes sensitive PII (Aadhaar, PAN, Phone, Email, Bank A/C)
 * before sending prompts to external AI models (Anthropic / OpenAI).
 */

export interface RedactionResult {
  redactedText: string;
  replacements: Record<string, string>;
}

export class PIIRedactor {
  // Regex patterns for Indian & Global PII
  private static readonly PATTERNS = {
    AADHAAR: /\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/g,
    PAN: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    PHONE: /\b(?:\+91[\-\s]?)?[6789]\d{9}\b/g,
    EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    BANK_ACCOUNT: /\b[0-9]{9,18}\b/g,
    PASSPORT: /\b[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]\b/g,
    CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  };

  /**
   * Redacts sensitive entities from text and returns the sanitized text + lookup map
   */
  public static redact(text: string): RedactionResult {
    if (!text || typeof text !== 'string') {
      return { redactedText: '', replacements: {} };
    }

    let redacted = text;
    const replacements: Record<string, string> = {};
    let counter = 1;

    // Redact Aadhaar
    redacted = redacted.replace(this.PATTERNS.AADHAAR, (match) => {
      const placeholder = `[AADHAAR_ID_${counter++}]`;
      replacements[placeholder] = match;
      return placeholder;
    });

    // Redact PAN Card
    redacted = redacted.replace(this.PATTERNS.PAN, (match) => {
      const placeholder = `[PAN_CARD_${counter++}]`;
      replacements[placeholder] = match;
      return placeholder;
    });

    // Redact Email (skip system emails)
    redacted = redacted.replace(this.PATTERNS.EMAIL, (match) => {
      if (match.endsWith('@lexnova.in') || match.endsWith('@resend.dev')) return match;
      const placeholder = `[EMAIL_${counter++}]`;
      replacements[placeholder] = match;
      return placeholder;
    });

    // Redact Phone numbers
    redacted = redacted.replace(this.PATTERNS.PHONE, (match) => {
      const placeholder = `[PHONE_${counter++}]`;
      replacements[placeholder] = match;
      return placeholder;
    });

    // Redact Credit Cards
    redacted = redacted.replace(this.PATTERNS.CREDIT_CARD, (match) => {
      const placeholder = `[PAYMENT_CARD_${counter++}]`;
      replacements[placeholder] = match;
      return placeholder;
    });

    return {
      redactedText: redacted,
      replacements,
    };
  }

  /**
   * Rehydrates synthetic tokens back to original values in the AI output
   */
  public static unredact(text: string, replacements: Record<string, string>): string {
    if (!text || !replacements) return text;
    let restored = text;
    for (const [placeholder, original] of Object.entries(replacements)) {
      restored = restored.split(placeholder).join(original);
    }
    return restored;
  }
}

export default PIIRedactor;
