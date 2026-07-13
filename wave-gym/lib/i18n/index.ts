export { type Dict, type Lang, LANGS } from './dictionaries';
export { es } from './es';
export { en } from './en';
export { pt } from './pt';

import type { Lang, Dict } from './dictionaries';
import { es } from './es';
import { en } from './en';
import { pt } from './pt';

const DICTS: Record<Lang, Dict> = { ES: es, EN: en, PT: pt };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? es;
}
