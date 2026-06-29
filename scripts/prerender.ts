/**
 * Pre-render step (specs/05 no-JavaScript resolution, ADR-004). Runs after the
 * client and server bundles are built. Renders the board to HTML and injects
 * it into the built index.html so the four columns and their cards are present
 * in the served markup. The client then hydrates on top.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

async function main() {
  const templatePath = resolve(root, 'dist/index.html');
  const template = readFileSync(templatePath, 'utf8');

  const serverEntry = pathToFileURL(
    resolve(root, 'dist-ssr/entry-server.js'),
  ).href;
  const { render } = (await import(serverEntry)) as { render: () => string };

  const appHtml = render();
  const output = template.replace('<!--app-html-->', appHtml);
  writeFileSync(templatePath, output, 'utf8');

  // eslint-disable-next-line no-console
  console.log('Pre-rendered board into dist/index.html');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Pre-render failed:', err);
  process.exit(1);
});
