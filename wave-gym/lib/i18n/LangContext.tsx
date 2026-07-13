'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang, Dict } from './dictionaries';
import { getDict, LANGS } from './index';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  d: Dict;
  langs: typeof LANGS;
}

const LangContext = createContext<LangCtx>({
  lang: 'ES',
  setLang: () => {},
  d: getDict('ES'),
  langs: LANGS,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ES');

  useEffect(() => {
    const saved = localStorage.getItem('wave-lang') as Lang | null;
    if (saved && ['ES', 'EN', 'PT'].includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('wave-lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, d: getDict(lang), langs: LANGS }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
