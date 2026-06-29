import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Language } from './types';
import config from './config';
import { localise as localiseValue, t as translate, type StringKey } from './strings';
import type { Localised } from './types';

export const DEFAULT_LANGUAGE: Language = config.language.default;
const AVAILABLE: Language[] = config.language.available;

export function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'cy';
}

/** Read the requested language from a URL search string (?lang=cy). */
export function languageFromSearch(search: string): Language {
  const params = new URLSearchParams(search);
  const lang = params.get('lang');
  if (isLanguage(lang) && AVAILABLE.includes(lang)) return lang;
  return DEFAULT_LANGUAGE;
}

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: StringKey) => string;
  localise: (value: Localised) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [lang, setLangState] = useState<Language>(
    initialLanguage ?? DEFAULT_LANGUAGE,
  );

  // Reflect the choice in the URL so a link can be shared in a chosen
  // language, without using client storage (specs/08).
  const setLang = useCallback((next: Language) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (next === DEFAULT_LANGUAGE) {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', next);
      }
      window.history.replaceState({}, '', url);
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // After hydration, adopt the language from the URL (?lang=) when one is
  // explicitly present. Done in an effect so the first client render matches
  // the server render. Absent a param, the initial language is kept.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('lang');
    if (isLanguage(fromUrl) && AVAILABLE.includes(fromUrl)) {
      setLangState(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: StringKey) => translate(key, lang),
      localise: (v: Localised) => localiseValue(v, lang),
    }),
    [lang, setLang],
  );

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
