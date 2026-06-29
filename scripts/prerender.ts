/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import { LanguageProvider } from '../src/components/LanguageProvider';
import type { Snapshot } from '../src/lib/types';

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const snapshot: Snapshot = JSON.parse(fs.readFileSync(path.join(root, 'public/data/backlog.json'), 'utf8'));

const html = renderToString(
  React.createElement(LanguageProvider, { initial: 'en', children: React.createElement(App, { snapshot }) }),
);

const indexPath = path.join(dist, 'index.html');
let page = fs.readFileSync(indexPath, 'utf8');
page = page.replace(
  '<div id="root"><!--app-html--></div>',
  `<div id="root" data-prerendered="true">${html}</div>\n<script>window.__SNAPSHOT__=${JSON.stringify(snapshot)}</script>`,
);
fs.writeFileSync(indexPath, page);
console.log('Pre-rendered board into dist/index.html');
