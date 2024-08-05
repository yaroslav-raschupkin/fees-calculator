import { Transaction } from "./transaction.js";
import { calculatePercentage, roundDecimal } from "../utils.js";
import { TRANSACTION_TYPE, USER_TYPE } from "../constants.js";

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

  validate(transaction) {
    const { type, user_type } = transaction;

    if (type !== TRANSACTION_TYPE.CASH_OUT) {
      throw new Error(
        `${this.constructor.name}: provided type '${type}' is not valid.`,
      );
    }

    if (user_type !== USER_TYPE.JURIDICAL) {
      throw new Error(
        `${this.constructor.name}: provided user type '${user_type}' is not valid.`,
      );
    }
  }
}
