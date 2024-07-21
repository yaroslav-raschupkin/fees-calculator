import { Transaction } from "./transaction.js";
import {
  calculatePercentage,
  fetchRequest,
  getISOWeekNumber,
  roundDecimal,
} from "../utils.js";

/**
 * Class representing a natural cash-out transaction.
 * @extends Transaction
 */
export class TransactionCashOutNatural extends Transaction {
  constructor(transaction, config, transactions) {
    super(transaction, config);
    this.transactions = transactions;
  }

  calculateFee() {
    const {
      week_limit: { amount: weekLimit },
      percents,
    } = this.config;
    const transactions = this.transactions;
    const currentIndex = transactions.findIndex(
      (transaction) => transaction === this.transaction,
    );

    if (currentIndex < 0) {
      throw new Error(`${this.name}: provided transactions is not in the list`);
    }

    const weekAmount = {};

    for (let i = 0; i <= currentIndex; i++) {
      const transaction = transactions[i];
      const {
        date,
        type,
        user_type,
        user_id,
        operation: { amount },
      } = transaction;

      if (type === "cash_in" || user_type === "juridical") {
        continue;
      }

      const year = new Date(date).getFullYear();
      const week = getISOWeekNumber(date);
      const key = `${user_id}_${week}_${year}`;

      weekAmount[key] = (weekAmount[key] || 0) + amount;
      const userWeekAmount = weekAmount[key];

      let fee = 0;

      const exceeds = userWeekAmount - amount > weekLimit;
      if (userWeekAmount > weekLimit && !exceeds) {
        const exceed = userWeekAmount - weekLimit;
        fee = calculatePercentage(exceed, percents);
      } else if (exceeds) {
        fee = calculatePercentage(amount, percents);
      }

      if (i === currentIndex) {
        return roundDecimal(fee);
      }
    }
  }

  static async getConfig() {
    if (!this.config) {
      this.config = await fetchRequest(
        "https://developers.paysera.com/tasks/api/cash-out-natural",
      );
    }

    return this.config;
  }

  static async create(transaction, transactions) {
    this.validate(transaction);
    const config = await this.getConfig();

    return new TransactionCashOutNatural(transaction, config, transactions);
  }

  static validate(transaction) {
    const { type, user_type } = transaction;

    if (type !== "cash_out") {
      throw new Error(`${this.name}: provided type '${type}' is not valid.`);
    }

    if (user_type !== "natural") {
      throw new Error(
        `${this.name}: provided user type '${user_type}' is not valid.`,
      );
    }
  }
}
