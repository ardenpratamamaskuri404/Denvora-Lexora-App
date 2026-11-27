/**
 * @module scripts/generate-code-docs
 * @description Generator dokumentasi kode offline (Markdown & HTML) dari komentar JSDoc modul dan fungsi/prosedur.
 * Memenuhi kriteria UKK RPL Paket 4 (SPK-4/4 poin 3c & PPsp 1.13-1.15: Men-generate dokumentasi).
 */

import fs from 'node:fs/promises';
import path from 'node:path';

interface SymbolDoc {
  kind: string;
  name: string;
  signature: string;
  doc: string;
  line: number;
}

interface ModuleDoc {
  scope: 'Backend (Express + TypeScript)' | 'Frontend (Next.js + React)';
  relPath: string;
  moduleName: string;
  description: string;
  lineCount: number;
  symbols: SymbolDoc[];
}

const ROOT_DIR = path.resolve(__dirname, '../..');
const OUT_MD = path.join(ROOT_DIR, 'docs/ukk-submission/02-DOKUMENTASI-FUNGSI-PROSEDUR.md');
const OUT_HTML = path.join(ROOT_DIR, 'docs/ukk-submission/generated-code-docs/index.html');

async function walkSourceFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkSourceFiles(full)));
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function cleanJsDoc(raw: string): string {
  return raw
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ');
}

function parseModuleMeta(source: string, fallbackName: string): { moduleName: string; description: string } {
  const match = source.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  if (!match) {
    return { moduleName: fallbackName, description: 'Modul internal sistem Denvora Lexora.' };
  }
  const block = match[1];
  const modMatch = block.match(/@module\s+([^\r\n]+)/);
  const descMatch = block.match(/@description\s+([\s\S]*?)(?=@\w+|$)/);
  const cleanDesc = descMatch
    ? cleanJsDoc(`/**${descMatch[1]}*/`)
    : cleanJsDoc(`/**${block}*/`).replace(/@\w+\s+\S+/g, '').trim();

  return {
    moduleName: modMatch ? modMatch[1].trim() : fallbackName,
    description: cleanDesc || 'Modul sistem Denvora Lexora.',
  };
}

function extractSymbols(source: string): SymbolDoc[] {
  const lines = source.split(/\r?\n/);
  const symbols: SymbolDoc[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(
      /^export\s+(?:default\s+)?(?:async\s+)?(function|class|interface|type|const)\s+([A-Za-z0-9_]+)/
    );
    if (!match) continue;

    const [, kind, name] = match;
    let doc = '';
    if (i > 0 && lines[i - 1].trim().endsWith('*/')) {
      const buf: string[] = [];
      for (let j = i - 1; j >= Math.max(0, i - 15); j -= 1) {
        buf.unshift(lines[j]);
        if (lines[j].trim().startsWith('/**')) {
          doc = cleanJsDoc(buf.join('\n'));
          break;
        }
        if (lines[j].trim().startsWith('/*')) break;
      }
    }

    const sigParts: string[] = [line.trim()];
    if ((kind === 'function' || kind === 'const') && !line.includes('{') && !line.includes(';')) {
      for (let k = i + 1; k < Math.min(lines.length, i + 6); k += 1) {
        sigParts.push(lines[k].trim());
        if (lines[k].includes('{') || lines[k].includes('=>') || lines[k].includes(';')) break;
      }
    }

    const compactSig = sigParts
      .join(' ')
      .replace(/\s*\{\s*$/, '')
      .replace(/\s+/g, ' ')
      .slice(0, 140);

    symbols.push({
      kind,
      name,
      signature: compactSig,
      doc: doc || `Ekspor ${kind} ${name}.`,
      line: i + 1,
    });
  }

  return symbols;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdown(modules: ModuleDoc[]): string {
  const generatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const totalSymbols = modules.reduce((sum, m) => sum + m.symbols.length, 0);
  const out: string[] = [
    '# Dokumentasi Modul, Fungsi & Prosedur (Hasil Generate)',
    '',
    '> **Sumber:** Dihasilkan otomatis secara offline oleh [`backend/scripts/generate-code-docs.ts`](../../backend/scripts/generate-code-docs.ts) (`npm run docs:generate`)',
    `> **Waktu Generate:** ${generatedAt} | **Total Modul:** ${modules.length} | **Total Simbol Terekspor:** ${totalSymbols}`,
    '> **Versi HTML Interaktif Offline:** [`generated-code-docs/index.html`](./generated-code-docs/index.html)',
    '',
    '---',
    '',
  ];

  for (const scope of ['Backend (Express + TypeScript)', 'Frontend (Next.js + React)'] as const) {
    const group = modules.filter((m) => m.scope === scope);
    out.push(`## ${scope} (${group.length} Modul)`, '');
    for (const mod of group) {
      out.push(`### \`${mod.moduleName}\` — [\`${mod.relPath}\`](../../${mod.relPath}) (${mod.lineCount} baris)`);
      out.push('', `${mod.description}`, '');
      if (mod.symbols.length === 0) {
        out.push('_Tidak ada simbol terekspor langsung (konfigurasi/entry-point)._', '');
      } else {
        out.push('| Baris | Jenis | Simbol | Deskripsi |', '| :---: | :---: | :--- | :--- |');
        for (const sym of mod.symbols) {
          const safeDoc = sym.doc.replace(/\|/g, '\\|');
          out.push(`| ${sym.line} | \`${sym.kind}\` | \`${sym.name}\` | ${safeDoc} |`);
        }
        out.push('');
      }
    }
  }
  return out.join('\n');
}

function renderHtml(modules: ModuleDoc[]): string {
  const totalSymbols = modules.reduce((sum, m) => sum + m.symbols.length, 0);
  const cards = modules
    .map((mod) => {
      const rows = mod.symbols.length
        ? mod.symbols
            .map(
              (s) =>
                `<tr><td>${s.line}</td><td><code>${escapeHtml(s.kind)}</code></td><td><code>${escapeHtml(s.name)}</code><br><small>${escapeHtml(s.signature)}</small></td><td>${escapeHtml(s.doc)}</td></tr>`
            )
            .join('')
        : '<tr><td colspan="4"><em>Modul konfigurasi / entry-point tanpa simbol ekspor bernama.</em></td></tr>';

      return `<article class="card" data-search="${escapeHtml(`${mod.scope} ${mod.moduleName} ${mod.relPath} ${mod.description} ${mod.symbols.map((s) => s.name).join(' ')}`.toLowerCase())}">
  <div class="card-head">
    <span class="badge">${escapeHtml(mod.scope.split(' ')[0])}</span>
    <h2>${escapeHtml(mod.moduleName)}</h2>
    <span class="meta">${escapeHtml(mod.relPath)} · ${mod.lineCount} baris</span>
  </div>
  <p class="desc">${escapeHtml(mod.description)}</p>
  <table><thead><tr><th>Baris</th><th>Jenis</th><th>Deklarasi</th><th>Deskripsi</th></tr></thead><tbody>${rows}</tbody></table>
</article>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Denvora Lexora — Generated Code Documentation</title>
<style>
  :root{--bg:#FBF7F1;--card:#FFFFFF;--ink:#2B1D13;--muted:#6D5A4C;--border:#E2D5C3;--accent:#C87E4F}
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}
  header{padding:28px 24px;border-bottom:1px solid var(--border);background:#2B1D13;color:#F6EFE6}
  .wrap{max-width:1160px;margin:0 auto} h1{margin:0 0 6px;font-size:1.55rem} .sub{margin:0;color:#D8C6B3;font-size:.9rem}
  .toolbar{margin:20px auto;padding:0 24px;display:flex;gap:12px;align-items:center}
  input{flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--card);font-size:.95rem}
  main{padding:0 24px 48px} .card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:16px}
  .card-head{display:flex;flex-wrap:wrap;gap:10px;align-items:center} h2{margin:0;font-size:1.05rem}
  .badge{font-size:.72rem;font-weight:700;padding:2px 8px;border-radius:999px;background:#F3E5D5;color:#8D4F2B}
  .meta{margin-left:auto;font-size:.8rem;color:var(--muted)} .desc{margin:8px 0 12px;color:var(--muted);font-size:.9rem}
  table{width:100%;border-collapse:collapse;font-size:.86rem} th,td{text-align:left;padding:7px 9px;border-top:1px solid var(--border);vertical-align:top}
  th{font-size:.76rem;text-transform:uppercase;color:var(--muted)} code{background:#F5EDE3;padding:1px 5px;border-radius:5px} small{color:var(--muted)}
</style>
</head>
<body>
<header><div class="wrap"><h1>Denvora Lexora — Dokumentasi Kode Otomatis (Offline)</h1>
<p class="sub">${modules.length} Modul · ${totalSymbols} Fungsi/Komponen/Tipe Terekspor · Generate Lokal Tanpa Internet</p></div></header>
<div class="wrap toolbar"><input id="q" type="search" placeholder="Cari nama modul, file, fungsi, atau komponen..."></div>
<main class="wrap">${cards}</main>
<script>
  const q=document.getElementById('q');const cards=[...document.querySelectorAll('.card')];
  q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();cards.forEach(c=>{c.style.display=!v||c.dataset.search.includes(v)?'block':'none'})});
</script>
</body>
</html>`;
}

async function main(): Promise<void> {
  const targets: Array<{ dir: string; scope: ModuleDoc['scope'] }> = [
    { dir: path.join(ROOT_DIR, 'backend/src'), scope: 'Backend (Express + TypeScript)' },
    { dir: path.join(ROOT_DIR, 'frontend/src'), scope: 'Frontend (Next.js + React)' },
  ];

  const modules: ModuleDoc[] = [];
  for (const target of targets) {
    const files = await walkSourceFiles(target.dir);
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
      const meta = parseModuleMeta(content, relPath);
      modules.push({
        scope: target.scope,
        relPath,
        moduleName: meta.moduleName,
        description: meta.description,
        lineCount: content.split(/\r?\n/).length,
        symbols: extractSymbols(content),
      });
    }
  }

  await fs.mkdir(path.dirname(OUT_HTML), { recursive: true });
  await fs.writeFile(OUT_MD, renderMarkdown(modules), 'utf8');
  await fs.writeFile(OUT_HTML, renderHtml(modules), 'utf8');

  const totalSymbols = modules.reduce((sum, m) => sum + m.symbols.length, 0);
  console.log(`GENERATED_DOCS_OK modules=${modules.length} symbols=${totalSymbols}`);
}

main().catch((err) => {
  console.error('GENERATE_DOCS_FAILED:', err);
  process.exit(1);
});
