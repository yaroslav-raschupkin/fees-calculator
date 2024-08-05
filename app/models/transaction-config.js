import { getCashInConfig } from "../api/cash-in.js";
import {
  getJuridicalCashOutConfig,
  getNaturalCashOutConfig,
} from "../api/cash-out.js";

export class TransactionConfig {
  async getCashInConfig() {
    if (!this.cashInConfig) {
      this.cashInConfig = await getCashInConfig();
    }
    return this.cashInConfig;
  }

  async getNaturalCashOutConfig() {
    if (!this.naturalCashOutConfig) {
      this.naturalCashOutConfig = await getNaturalCashOutConfig();
    }

    return this.naturalCashOutConfig;
  }

  async getJuridicalCashOutConfig() {
    if (!this.juridicalCashOutConfig) {
      this.juridicalCashOutConfig = await getJuridicalCashOutConfig();
    }

    return this.juridicalCashOutConfig;
  }
}
