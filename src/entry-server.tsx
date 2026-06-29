import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { App } from './App';
import { LanguageProvider, DEFAULT_LANGUAGE } from './lib/i18n';

/**
 * Server render used by the pre-render step (scripts/prerender.ts) so the
 * four columns and their cards are present in the served HTML and the board
 * is readable with no JavaScript (specs/04, specs/05 resolution).
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <LanguageProvider initialLanguage={DEFAULT_LANGUAGE}>
        <App />
      </LanguageProvider>
    </StrictMode>,
  );
}
