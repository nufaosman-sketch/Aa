import registryExample from "./for_bel_registry.example";
declare global { var __FOR_BEL_REG__: unknown; }
(globalThis as any).__FOR_BEL_REG__ = registryExample;
