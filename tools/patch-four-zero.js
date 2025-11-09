// tools/patch-four-zero.js — overwrite minimal
// Sentuh HANYA: nilai huruf "و ي ء ة" => 0 & buang .replace(/ة/g,...)

const fs = require('fs'), path = require('path');
const ROOTS = ['app','lib','src'];                              // folder yang discan
const EXTOK = new Set(['.ts','.tsx','.js','.jsx','.mjs','.cjs']);
const SKIP  = new Set(['node_modules','.git','.expo','build','dist','.next','.gradle','.idea']);

const reKeyVal   = /(["'])([ويءة])\1\s*:\s*-?\d+/g;              // "ة":5 -> :0
const reArrayKV  = /\[\s*(["'])([ويءة])\1\s*,\s*-?\d+\s*\]/g;    // ["ة",5] -> ["ة",0]
const reCppKV    = /\{L["']([ويءة])["']\s*,\s*-?\d+\}/g;         // {L"ة",5} -> {L"ة",0}
const reTaRep    = /\.replace\(\s*\/ة\/g\s*,\s*[^)]+\)/g;        // .replace(/ة/g,...) -> disabled
const reTaTern   = /\.replace\(\s*\/ة\/g\s*,\s*ta\s*===\s*5\s*\?\s*["'][^"']+["']\s*:\s*["'][^"']+["']\s*\)/g;

function walk(dir, out=[]) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = path.join(dir, name), st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTOK.has(path.extname(p))) out.push(p);
  }
  return out;
}

const files = ROOTS.flatMap(r => fs.existsSync(r) ? walk(r) : []);
let touched=0, backups=0, totalEdits=0;

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  let edits = 0;

  s = s.replace(reKeyVal,  m => { edits++; return m.replace(/:\s*-?\d+/, ': 0'); });
  s = s.replace(reArrayKV, m => { edits++; return m.replace(/,\s*-?\d+\s*\]/, ', 0]'); });
  s = s.replace(reCppKV,   m => { edits++; return m.replace(/,\s*-?\d+\}/, ',0}'); });

  s = s.replace(reTaTern,  () => { edits++; return '/* ta-marbuta disabled */'; });
  s = s.replace(reTaRep,   () => { edits++; return '/* ta-marbuta disabled */'; });

  if (edits > 0) {
    const bak = `${f}.bak.${Date.now()}`;
    fs.writeFileSync(bak, orig, 'utf8'); backups++;
    fs.writeFileSync(f, s, 'utf8');      touched++; totalEdits += edits;
    console.log(`✓ Patched ${f} (+${edits})  ← backup: ${path.basename(bak)}`);
  }
}

console.log(`\n=== SUMMARY ===
Files scanned: ${files.length}
Patched: ${touched}
Backups: ${backups}
Total edits: ${totalEdits}`);
