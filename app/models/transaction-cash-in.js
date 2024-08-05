import { Transaction } from "./transaction.js";
import { calculatePercentage, fetchRequest, roundDecimal } from "../utils.js";
import { TRANSACTION_TYPE } from "../constants.js";

/**
 * Class representing a cash-in transaction.
 * @extends Transaction
 */
export class TransactionCashIn extends Transaction {
  calculateFee() {
    const {
      max: { amount: maxFee },
      percents,
    } = this.config;

    const {
      operation: { amount },
    } = this.transaction;

    const fee = calculatePercentage(amount, percents);

    return roundDecimal(Math.min(fee, maxFee));
  }

  static async getConfig() {
    if (!this.config) {
      this.config = await fetchRequest(
        "https://developers.paysera.com/tasks/api/cash-in",
      );
    }

    return this.config;
  }

  static async create(transaction) {
    this.validate(transaction);
    const config = await this.getConfig();

    return new TransactionCashIn(transaction, config);
  }

  static validate(transaction) {
    const { type } = transaction;

    if (type !== TRANSACTION_TYPE.CASH_IN) {
      throw new Error(`${this.name}: provided type '${type}' is not valid.`);
    }
  }
}
