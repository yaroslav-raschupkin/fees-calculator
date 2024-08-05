import { Transaction } from "./transaction.js";
import { calculatePercentage, roundDecimal } from "../utils.js";
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

  validate(transaction) {
    const { type } = transaction;

    if (type !== TRANSACTION_TYPE.CASH_IN) {
      throw new Error(
        `${this.constructor.name}: provided type '${type}' is not valid.`,
      );
    }
  }
}
