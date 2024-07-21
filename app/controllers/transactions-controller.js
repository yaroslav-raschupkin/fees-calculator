import fs from "fs";
import { TransactionCashIn } from "../models/transaction-cash-in.js";

/**
 * Class representing a controller for managing transactions.
 */
export class TransactionsController {
  transactions = [];

  /**
   * Loads transactions from file and creates transactions instances.
   */
  async loadTransactions(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    const transactions = JSON.parse(data);

    for (const transaction of transactions) {
      if (transaction.type === "cash_in") {
        this.transactions.push(await TransactionCashIn.create(transaction));
      }
    }
  }

  /**
   * Maps the transactions to calculate each fee.
   * @returns {[number]} - returns array of transactions fees
   */
  processTransactions() {
    return this.transactions.map((transaction) => transaction.calculateFee());
  }
}
