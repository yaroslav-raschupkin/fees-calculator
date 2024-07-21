import fs from "fs";

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
  loadTransactions(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    this.transactions = JSON.parse(data);
    console.log(this.transactions);
  }
}
