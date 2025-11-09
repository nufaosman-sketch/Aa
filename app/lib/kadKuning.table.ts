/**
 * Kad Kuning — glb/mglb 9×9 dengan 5 keputusan:
 * 1=Penuntut menang, 2=Dituntut menang, 3=Seri,
 * 4=Seri khas: الطالب يغلب المطلوب, 5=Seri khas: المطلوب يغلب الطالب
 *
 * Guna: import { decideKadKuning } dan panggil decideKadKuning(a1to9, b1to9)
 */
export type Verdict = 1|2|3|4|5;

// Placeholder util (akan ditindih oleh overrides jika ada)
const _ = 0 as unknown as Verdict;
export const P: Verdict = 1; // Penuntut
export const D: Verdict = 2; // Dituntut
export const S: Verdict = 3; // Seri
export const PS: Verdict = 4; // Seri khas: الطالب يغلب المطلوب
export const DS: Verdict = 5; // Seri khas: المطلوب يغلب الطالب

// Jadual asas (lengkapkan kemudian 1:1 ikut kad asal; sementara: diagonal = PS)
export const TABLE_9x9: Verdict[][] = [
/*pen\dit*/ /*1*/ /*2*/ /*3*/ /*4*/ /*5*/ /*6*/ /*7*/ /*8*/ /*9*/
  /*1*/      [PS, _,   _,   _,   _,   _,   _,   _,   _],
  /*2*/      [_,  PS,  _,   _,   _,   _,   _,   _,   _],
  /*3*/      [_,  _,   PS,  _,   _,   _,   D,   _,   _], // (3,7)=D (contoh sah)
  /*4*/      [_,  _,   _,   PS,  _,   _,   _,   _,   _],
  /*5*/      [_,  _,   _,   _,   PS,  _,   _,   _,   _],
  /*6*/      [_,  _,   _,   _,   _,   PS,  _,   _,   _],
  /*7*/      [_,  _,   _,   _,   _,   _,   PS,  _,   _],
  /*8*/      [_,  _,   _,   _,   _,   _,   _,   PS,  _],
  /*9*/      [_,  _,   _,   _,   _,   _,   _,   _,   PS],
];

// Overrides format: {"a-b": Verdict} contoh {"3-7":2}
export type OverrideMap = Record<string, Verdict>;

// Heuristik fallback hanya sementara jika sel belum diisi (bukan rujukan kitab)
function fallback(a:number,b:number): Verdict {
  if (a===b) return PS;
  const da=a%3, db=b%3;
  if (da===db) return (a>b?PS:DS);
  return (a>b?P:D);
}

export function decideKadKuning(a:number,b:number, overrides?: OverrideMap): Verdict {
  if (a<1||a>9||b<1||b>9) throw new Error("Nilai mesti 1..9");
  const key=`${a}-${b}`;
  if (overrides && overrides[key]) return overrides[key];
  const row = TABLE_9x9[a-1];
  const cell = row?.[b-1];
  return (cell && (cell as any)!==0) ? cell : fallback(a,b);
}
