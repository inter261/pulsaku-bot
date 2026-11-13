import type { Feature } from "../types";
import { kuota } from "./kuota";
import { status } from "./status";
import { voucher } from "./voucher";
import { promo } from "./promo";
import { spsegel } from "./spsegel";
import { masal } from "./masal";
import { utang } from "./utang";
import { masaaktif } from "./masaaktif";
import { redeem } from "./redeem";
import { premium } from "./premium";

/** Urutan di sini = urutan tombol di keyboard (2 kolom). */
export const features: Feature[] = [
  kuota, status, voucher, promo, spsegel, masal, utang, masaaktif, redeem, premium,
];
