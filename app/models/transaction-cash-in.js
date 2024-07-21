import { Transaction } from "./transaction.js";
import { fetchRequest } from "../utils.js";

/**
 * Class representing a cash-in transaction.
 * @extends Transaction
 */
export class TransactionCashIn extends Transaction {
  calculateFee() {
    // Implementation of fee calculation goes here
  }

  /**
   * Returns the transaction config, if it's not exist - makes an HTTP request for it
   * @returns {Promise<Object>}
   */
  static async getConfig() {
    if (!this.config) {
      this.config = await fetchRequest(
        "https://developers.paysera.com/tasks/api/cash-in",
      );
    }

    return this.config;
  }

  static async create(transaction) {
    const config = await this.getConfig();
    return new TransactionCashIn(transaction, config);
  }
}
