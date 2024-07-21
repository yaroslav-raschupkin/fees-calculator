import { Transaction } from "./transaction.js";
import { calculatePercentage, fetchRequest, roundDecimal } from "../utils.js";

/**
 * Class representing a juridical cash-out transaction.
 * @extends Transaction
 */
export class TransactionCashOutJuridical extends Transaction {
  calculateFee() {
    const {
      min: { amount: minFee },
      percents,
    } = this.config;

    const {
      operation: { amount },
    } = this.transaction;

    const fee = calculatePercentage(amount, percents);

    return roundDecimal(Math.max(fee, minFee));
  }

  static async getConfig() {
    if (!this.config) {
      this.config = await fetchRequest(
        "https://developers.paysera.com/tasks/api/cash-out-juridical",
      );
    }

    return this.config;
  }

  static async create(transaction) {
    this.validate(transaction);
    const config = await this.getConfig();

    return new TransactionCashOutJuridical(transaction, config);
  }

  static validate(transaction) {
    const { type, user_type } = transaction;

    if (type !== "cash_out") {
      throw new Error(`${this.name}: provided type '${type}' is not valid.`);
    }

    if (user_type !== "juridical") {
      throw new Error(
        `${this.name}: provided user type '${user_type}' is not valid.`,
      );
    }
  }
}
