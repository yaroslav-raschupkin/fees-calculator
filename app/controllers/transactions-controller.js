import fs from "fs";
import { TransactionCashIn } from "../models/transaction-cash-in.js";
import { TransactionCashOutJuridical } from "../models/transaction-cash-out-juridical.js";
import { TransactionCashOutNatural } from "../models/transaction-cash-out-natural.js";
import { TRANSACTION_TYPE, USER_TYPE } from "../constants.js";

/**
 * Class representing a controller for managing transactions.
 */
export class TransactionsController {
  transactions = [];
  constructor(transactionConfig) {
    this.transactionConfig = transactionConfig;
  }

  async loadTransactions(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    const transactions = JSON.parse(data);

    for (const transaction of transactions) {
      const { type, user_type } = transaction;

      if (type === TRANSACTION_TYPE.CASH_IN) {
        this.transactions.push(
          new TransactionCashIn(
            transaction,
            await this.transactionConfig.getCashInConfig(),
          ),
        );
      } else if (
        type === TRANSACTION_TYPE.CASH_OUT &&
        user_type === USER_TYPE.JURIDICAL
      ) {
        this.transactions.push(
          new TransactionCashOutJuridical(
            transaction,
            await this.transactionConfig.getJuridicalCashOutConfig(),
          ),
        );
      } else if (
        type === TRANSACTION_TYPE.CASH_OUT &&
        user_type === USER_TYPE.NATURAL
      ) {
        this.transactions.push(
          new TransactionCashOutNatural(
            transaction,
            await this.transactionConfig.getNaturalCashOutConfig(),
            transactions,
          ),
        );
      }
    }
  }

  processTransactions() {
    return this.transactions.map((transaction) => transaction.calculateFee());
  }
}
