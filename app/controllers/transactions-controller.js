import fs from "fs";
import { TransactionCashIn } from "../models/transaction-cash-in.js";

/**
 * Class representing a controller for managing transactions.
 */
export class TransactionsController {
  /**
   * Array to hold transaction instances.
   * @type {Array<Object>}
   */
  transactions = [];

  /**
   * Load transactions from a JSON file
   * @param {string} filePath - Path to the JSON file containing transactions.
   * @returns {void}
   * @throws Will throw an error if the file cannot be read or JSON parsing fails.
   */
  async loadTransactions(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    const transactions = JSON.parse(data);

    for (const transaction of transactions) {
      if (transaction.type === "cash_in") {
        this.transactions.push(await TransactionCashIn.create(transaction));
      }
    }

    console.log(this.transactions);
  }
}
