import { hydrateRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { LanguageProvider, DEFAULT_LANGUAGE } from './lib/i18n';
import './index.css';

const root = document.getElementById('root');
if (root) {
  hydrateRoot(
    root,
    <StrictMode>
      <LanguageProvider initialLanguage={DEFAULT_LANGUAGE}>
        <App />
      </LanguageProvider>
    </StrictMode>,
  );
}
