export const safeBaki30 = (fn: ((n:number)=>number)|undefined, n:number) => {
  try {
    const v = fn ? fn(n) : (n % 30 || 30);
    const t = Math.trunc(v);
    return t === 0 ? 30 : t;
  } catch { return (n % 30 || 30); }
};
