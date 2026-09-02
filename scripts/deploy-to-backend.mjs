import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const uiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backendStatic = resolve(uiRoot, '..', 'ai-knowledge-assistant', 'src', 'main', 'resources', 'static');
const dist = join(uiRoot, 'dist');

mkdirSync(backendStatic, { recursive: true });
rmSync(backendStatic, { recursive: true, force: true });
mkdirSync(backendStatic, { recursive: true });
cpSync(dist, backendStatic, { recursive: true });

console.log(`Deployed UI build to ${backendStatic}`);
