import type { Env } from "./types";
import { DummyProvider } from "./providers/dummy";

export interface QuotaPackage {
  name: string;
  remaining: string;
  total: string;
  expires: string;
}
export interface Quota {
  msisdn: string;
  packages: QuotaPackage[];
}
export interface NumberStatus {
  msisdn: string;
  status: string;
  type: string;
  activeUntil: string;
  graceUntil: string;
}
export interface Voucher {
  name: string;
  code: string;
  validUntil: string;
}
export interface Promo {
  name: string;
  price: string;
  detail: string;
}
export interface SimSeal {
  serial: string;
  status: string;
}
export interface Debt {
  msisdn: string;
  amount: number;
  note: string;
}
export interface ExtendResult {
  ok: boolean;
  message: string;
}
export interface RedeemResult {
  ok: boolean;
  message: string;
}

/**
 * Semua fitur bot memanggil antarmuka ini.
 * Untuk memakai API sungguhan, buat class baru yang meng-implement TelcoProvider
 * (mis. src/providers/api.ts) lalu kembalikan di getProvider().
 */
export interface TelcoProvider {
  readonly isDummy: boolean;
  getQuota(msisdn: string): Promise<Quota>;
  getStatus(msisdn: string): Promise<NumberStatus>;
  getVouchers(msisdn: string): Promise<Voucher[]>;
  getPromos(): Promise<Promo[]>;
  checkSimSeal(serial: string): Promise<SimSeal>;
  getDebt(msisdn: string): Promise<Debt>;
  extendActive(msisdn: string): Promise<ExtendResult>;
  redeem(msisdn: string, code: string): Promise<RedeemResult>;
}

export function getProvider(_env: Env): TelcoProvider {
  return new DummyProvider();
}
