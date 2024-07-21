/**
 * Class representing a transaction.
 */
export class Transaction {
  /**
   * Create a transaction.
   * @param {Object} transaction - The transaction data.
   * @param {Object} config - The configuration for the transaction.
   */
  constructor(transaction, config) {
    this.transaction = transaction;
    this.config = config;
  }
}
