// tools/fix-index-abjad.js
// Patch selamat untuk app/index.tsx — neutralize و ي ء ة = 0

const fs = require('fs');
const path = require('path');

const FILE = 'app/index.tsx';
if (!fs.existsSync(FILE)) {
  console.error('❌ Fail tak jumpa:', FILE);
  process.exit(1);
}

let s = fs.readFileSync(FILE, 'utf8');
const orig = s;

// 1) ganti blok ABJAD
const reABJAD = /const\s+ABJAD[^=]*=\s*{[\s\S]*?};/m;
const ABJAD_NEW = `const STRIP = /[\\u064B-\\u065F\\u06D6-\\u06ED]/g;

const ABJAD: Record<string, number> = {
  "ا":1,"ب":2,"ج":3,"د":4,"ه":5,"و":0,"ز":7,"ح":8,"ط":9,
  "ي":0,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,"ق":100,
  "ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000,
  "ء":0,"ة":0
};`;

// 2) ganti normalizeArabic()
const reNorm = /function\s+normalizeArabic\s*\([^)]*\)\s*{[\s\S]*?}/m;
const NORM_NEW = `function normalizeArabic(str: string): string {
  return (str || "")
    .replace(STRIP, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ى]/g, "ي")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي"); // ⚠️ "ة" tidak disentuh — nilainya 0 dalam ABJAD
}`;

// 3) ganti abjadSum()
const reSum = /function\s+abjadSum\s*\([^)]*\)\s*{[\s\S]*?}/m;
const SUM_NEW = `function abjadSum(str: string): number {
  return [...normalizeArabic(str)].reduce((a, c) => a + (ABJAD[c] || 0), 0);
}`;

// Helper untuk insert jika tak jumpa
function insertAfterImports(src, block) {
  const m = src.match(/(^|\n)(import[\s\S]*?)(\n(?!import))/);
  if (m) {
    const insertPos = m.index + m[0].length;
    return src.slice(0, insertPos) + '\n\n' + block + '\n\n' + src.slice(insertPos);
  }
  return block + '\n\n' + src;
}

// ABJAD
if (reABJAD.test(s)) s = s.replace(reABJAD, ABJAD_NEW);
else s = insertAfterImports(s, ABJAD_NEW);

// normalizeArabic
if (reNorm.test(s)) s = s.replace(reNorm, NORM_NEW);
else s = insertAfterImports(s, NORM_NEW);

// abjadSum
if (reSum.test(s)) s = s.replace(reSum, SUM_NEW);
else s = insertAfterImports(s, SUM_NEW);

// 4) Matikan mana-mana fallback ة→ه/ت
s = s.replace(/\.replace\(\s*\/ة\/g\s*,\s*[^)]+\)/g, '/* disabled: ta-marbuta fallback */');

if (s !== orig) {
  const bak = `${FILE}.bak.${Date.now()}`;
  fs.writeFileSync(bak, orig, 'utf8');
  fs.writeFileSync(FILE, s, 'utf8');
  console.log('✅ Patched', FILE);
  console.log('🗂️  Backup:', bak);
} else {
  console.log('ℹ️ Tiada perubahan diperlukan.');
}
