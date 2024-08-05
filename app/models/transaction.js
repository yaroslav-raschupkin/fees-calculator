/**
 * Class representing a transaction.
 */
export class Transaction {
  constructor(transaction, config) {
    this.validate(transaction);
    this.transaction = transaction;
    this.config = config;
  }

  validate(transaction) {}
}
