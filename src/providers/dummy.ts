import type {
  Debt, ExtendResult, NumberStatus, Promo, Quota, RedeemResult,
  SimSeal, TelcoProvider, Voucher,
} from "../provider";

/** Data contoh supaya semua menu bisa dicoba sebelum API sungguhan dipasang. */
export class DummyProvider implements TelcoProvider {
  readonly isDummy = true;

  async getQuota(msisdn: string): Promise<Quota> {
    return {
      msisdn,
      packages: [
        { name: "Internet Utama", remaining: "12,4 GB", total: "20 GB", expires: "2026-12-01" },
        { name: "Bonus Malam", remaining: "3 GB", total: "3 GB", expires: "2026-11-30" },
      ],
    };
  }

  async getStatus(msisdn: string): Promise<NumberStatus> {
    return {
      msisdn,
      status: "AKTIF",
      type: "Prabayar",
      activeUntil: "2026-12-01",
      graceUntil: "2026-12-31",
    };
  }

  async getVouchers(_msisdn: string): Promise<Voucher[]> {
    return [{ name: "Voucher Data 5 GB", code: "DEMO-1234", validUntil: "2026-12-15" }];
  }

  async getPromos(): Promise<Promo[]> {
    return [
      { name: "Paket Hemat 7 Hari", price: "Rp 15.000", detail: "5 GB, 7 hari" },
      { name: "Paket Malam 30 Hari", price: "Rp 25.000", detail: "20 GB (00.00-06.00), 30 hari" },
    ];
  }

  async checkSimSeal(serial: string): Promise<SimSeal> {
    return { serial, status: "SEGEL (belum diaktivasi)" };
  }

  async getDebt(msisdn: string): Promise<Debt> {
    return { msisdn, amount: 0, note: "Tidak ada utang pulsa." };
  }

  async extendActive(_msisdn: string): Promise<ExtendResult> {
    return { ok: true, message: "Masa aktif diperpanjang 30 hari." };
  }

  async redeem(_msisdn: string, code: string): Promise<RedeemResult> {
    return { ok: true, message: `Voucher ${code} berhasil diredeem.` };
  }
}
