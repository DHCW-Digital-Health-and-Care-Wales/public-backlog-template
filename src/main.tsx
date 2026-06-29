import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './components/LanguageProvider';
import type { Snapshot } from './lib/types';
import './index.css';

declare global {
  interface Window { __SNAPSHOT__?: Snapshot }
}

async function load(): Promise<Snapshot> {
  if (window.__SNAPSHOT__) return window.__SNAPSHOT__;
  const res = await fetch(`${import.meta.env.BASE_URL}data/backlog.json`);
  return res.json();
}

load().then((snapshot) => {
  const tree = (
    <StrictMode>
      <LanguageProvider>
        <App snapshot={snapshot} />
      </LanguageProvider>
    </StrictMode>
  );
  const el = document.getElementById('root')!;
  if (el.dataset.prerendered === 'true') hydrateRoot(el, tree);
  else createRoot(el).render(tree);
});
