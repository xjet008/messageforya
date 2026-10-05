export type Script =
  | 'latin'
  | 'greek'
  | 'cyrillic'
  | 'devanagari'
  | 'gurmukhi'
  | 'bengali'
  | 'gujarati'
  | 'tamil'
  | 'telugu'
  | 'kannada'
  | 'malayalam'
  | 'arabic'
  | 'hebrew'
  | 'georgian'
  | 'armenian'
  | 'japanese'
  | 'korean'
  | 'chinese'

export type Sorry = {
  id: number
  language: string
  phrase: string
  lang: string
  script: Script
  dir: 'ltr' | 'rtl'
}

const raw: Array<[string, string, string, Script, ('ltr' | 'rtl')?]> = [
  ['Hindi', 'माफ़ करना', 'hi', 'devanagari'],
  ['Punjabi', 'ਮਾਫ਼ ਕਰਨਾ', 'pa', 'gurmukhi'],
  ['Pashto', 'بخښنه غواړم', 'ps', 'arabic', 'rtl'],
  ['Bengali', 'দুঃখিত', 'bn', 'bengali'],
  ['Gujarati', 'માફ કરશો', 'gu', 'gujarati'],
  ['Marathi', 'माफ करा', 'mr', 'devanagari'],
  ['Tamil', 'மன்னிக்கவும்', 'ta', 'tamil'],
  ['Telugu', 'క్షమించండి', 'te', 'telugu'],
  ['Kannada', 'ಕ್ಷಮಿಸಿ', 'kn', 'kannada'],
  ['Malayalam', 'ക്ഷമിക്കണം', 'ml', 'malayalam'],
  ['Nepali', 'माफ गर्नुहोस्', 'ne', 'devanagari'],
  ['Arabic', 'آسف', 'ar', 'arabic', 'rtl'],
  ['Persian', 'ببخشید', 'fa', 'arabic', 'rtl'],
  ['Turkish', 'Özür dilerim', 'tr', 'latin'],
  ['Azerbaijani', 'Bağışlayın', 'az', 'latin'],
  ['French', 'Désolé', 'fr', 'latin'],
  ['Spanish', 'Lo siento', 'es', 'latin'],
  ['Portuguese', 'Desculpa', 'pt', 'latin'],
  ['Italian', 'Mi dispiace', 'it', 'latin'],
  ['German', 'Entschuldigung', 'de', 'latin'],
  ['English', 'Sorry', 'en', 'latin'],
  ['Swedish', 'Förlåt', 'sv', 'latin'],
  ['Norwegian', 'Unnskyld', 'nb', 'latin'],
  ['Danish', 'Undskyld', 'da', 'latin'],
  ['Finnish', 'Anteeksi', 'fi', 'latin'],
  ['Icelandic', 'Fyrirgefðu', 'is', 'latin'],
  ['Irish', 'Tá brón orm', 'ga', 'latin'],
  ['Welsh', "Mae'n ddrwg gen i", 'cy', 'latin'],
  ['Polish', 'Przepraszam', 'pl', 'latin'],
  ['Czech', 'Promiň', 'cs', 'latin'],
  ['Slovak', 'Prepáč', 'sk', 'latin'],
  ['Hungarian', 'Sajnálom', 'hu', 'latin'],
  ['Romanian', 'Îmi pare rău', 'ro', 'latin'],
  ['Greek', 'Συγγνώμη', 'el', 'greek'],
  ['Russian', 'Извини', 'ru', 'cyrillic'],
  ['Ukrainian', 'Вибач', 'uk', 'cyrillic'],
  ['Bulgarian', 'Съжалявам', 'bg', 'cyrillic'],
  ['Serbian', 'Извини', 'sr', 'cyrillic'],
  ['Croatian', 'Oprosti', 'hr', 'latin'],
  ['Bosnian', 'Oprosti', 'bs', 'latin'],
  ['Albanian', 'Më fal', 'sq', 'latin'],
  ['Georgian', 'ბოდიში', 'ka', 'georgian'],
  ['Armenian', 'Ներողություն', 'hy', 'armenian'],
  ['Hebrew', 'סליחה', 'he', 'hebrew', 'rtl'],
  ['Japanese', 'ごめんなさい', 'ja', 'japanese'],
  ['Korean', '미안해', 'ko', 'korean'],
  ['Chinese', '对不起', 'zh-Hans', 'chinese'],
  ['Urdu', 'معاف کیجیے', 'ur', 'arabic', 'rtl'],
  ['Indonesian', 'Maaf', 'id', 'latin'],
  ['Swahili', 'Samahani', 'sw', 'latin'],
]

export const sorries: Sorry[] = raw.map(([language, phrase, lang, script, dir], i) => ({
  id: i + 1,
  language,
  phrase,
  lang,
  script,
  dir: dir ?? 'ltr',
}))

export const littleNotes = [
  'open me, please',
  'this one is extra sincere',
  'I practiced this one',
  'pronounced with a pout',
  'said very softly',
  'with a tiny bow',
  'no take-backs',
  'sealed with a kiss',
  'I looked this one up twice',
  'say it back? (optional)',
  'hand-delivered',
  'with puppy eyes',
]

export const scriptClass: Record<Script, string> = {
  latin: 'font-serif',
  greek: 'font-script-greek',
  cyrillic: 'font-serif',
  devanagari: 'font-script-devanagari',
  gurmukhi: 'font-script-gurmukhi',
  bengali: 'font-script-bengali',
  gujarati: 'font-script-gujarati',
  tamil: 'font-script-tamil',
  telugu: 'font-script-telugu',
  kannada: 'font-script-kannada',
  malayalam: 'font-script-malayalam',
  arabic: 'font-script-arabic',
  hebrew: 'font-script-hebrew',
  georgian: 'font-script-georgian',
  armenian: 'font-script-armenian',
  japanese: 'font-script-japanese',
  korean: 'font-script-korean',
  chinese: 'font-script-chinese',
}
