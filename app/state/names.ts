export type Names = { diri?: string; ibu?: string; isteri?: string; anak?: string[] };
type TaMode = "5" | "400" | "neutral";

let _names: Names = (globalThis as any).__PKH_NAMES || {};
let _ta: TaMode = (globalThis as any).__PKH_TA || "neutral";

export function setNames(n: Names){
  _names = { ..._names, ...n };
  (globalThis as any).__PKH_NAMES = _names;
}
export function getNames(): Names {
  return (globalThis as any).__PKH_NAMES || _names || {};
}
export function setTaMarbutaMode(m: TaMode){
  _ta = m; (globalThis as any).__PKH_TA = _ta;
}
export function getTaMarbutaMode(): TaMode {
  return (globalThis as any).__PKH_TA || _ta || "neutral";
}
