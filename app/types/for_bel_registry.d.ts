import type {
  Registry,
  HurufRow,
  Planet,
  Buruj,
  Season,
  AnalyzerPayload,
  AnalyzerResult,
} from "../plugins/forensik.belerang.ui.standalone.card";

declare global {
  var __FOR_BEL_REG__: Registry | undefined;
}
export {};
