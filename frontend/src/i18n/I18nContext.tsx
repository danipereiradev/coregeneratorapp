import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import es from './es';
import en from './en';
import type { Locale, Translations } from './types';

const STORAGE_KEY = 'coregenerator-locale';

const catalogs: Record<Locale, Translations> = { es, en };

function getNested(obj: unknown, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : undefined;
}

export type TFunction = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFunction;
  messages: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;
  return 'es';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const messages = catalogs[locale];

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const t: TFunction = (key, vars) => {
    let str = getNested(messages, key) ?? getNested(catalogs.es, key) ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.split(`{{${k}}}`).join(String(v));
      });
    }
    return str;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, messages }),
    [locale, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
