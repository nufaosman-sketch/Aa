
import "../registry/register.runtime";
import NoopCard from "../plugins/_stubs/noop.card";
import type { ExplainAdapter, BoardAdapter } from "./types";
import CardPedomanAlbuni from "../plugins/pedoman.albuni.card";
import CardPedomanHarian from "../plugins/pedoman.harian.card";
import CardHamilKitabStandalone from "../plugins/card.hamil.kitab.standalone";
import CardLauhKitabStandalone from "../plugins/card.lauh.kitab.standalone";
import CardSafarKitabStandalone from "../plugins/card.safar.kitab.standalone";
import CardZamanPeralihanStandalone from "../plugins/card.zaman.peralihan.standalone";
import CardGhalebKitabStandalone from "../plugins/card.ghaleb.kitab.standalone";
import CardShareekStandalone from "../plugins/card.shareek.standalone";
import ForensikBab7Standalone from "../plugins/forensik.belerang.ui.standalone.card";
import ForensikBab7DarjatCard from "../plugins/forensik.bab7.darjat.card";

// Order matters (rendering order)
export const ExplainAdapters: ExplainAdapter[] = [
  CardLauhKitabStandalone,
  CardSafarKitabStandalone,
  CardPedomanAlbuni,
  CardPedomanHarian,
  CardGhalebKitabStandalone,
  CardShareekStandalone,
  ForensikBab7Standalone,
  ForensikBab7DarjatCard,
  CardHamilKitabStandalone,
  CardZamanPeralihanStandalone,
];
