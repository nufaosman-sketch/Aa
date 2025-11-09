export type Input = {
  aDiri: number;
  aIbu: number;
  aIsteri?: number;
  aAnakJumlah?: number;
  aKeluarga: number;
  hariLahir?: number;
  bulanHijri?: number;
  baki30: (n:number)=>number;
};

export type Theme = {
  // optional – we won't rely on them being present
  title?: any; sub?: any; cardText?: any; cardBg?: any; box?: any; accent?: any;
};

// Base adapter shapes
export type ExplainAdapter = {
  id: string;
  label: string;
  render: (input: Input, theme: Theme)=> JSX.Element;
};

export type BoardAdapter = {
  id: string;
  label: string;
  render: (input: Input, theme: Theme)=> JSX.Element;
};
