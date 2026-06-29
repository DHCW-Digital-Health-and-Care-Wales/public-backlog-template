import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '../lib/types';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, langFromQuery } from '../lib/i18n';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
}
const LanguageContext = createContext<Ctx>({ lang: DEFAULT_LANGUAGE, setLang: () => {} });

export function LanguageProvider({ children, initial }: { children: React.ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initial ?? DEFAULT_LANGUAGE);

  useEffect(() => {
    const fromUrl = langFromQuery(window.location.search, AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE);
    setLangState(fromUrl);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState({}, '', url.toString());
    document.documentElement.lang = l;
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): Ctx {
  return useContext(LanguageContext);
}
