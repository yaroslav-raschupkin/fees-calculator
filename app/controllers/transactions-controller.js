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

  async loadTransactions(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    const transactions = JSON.parse(data);

    for (const transaction of transactions) {
      const { type, user_type } = transaction;

      if (type === TRANSACTION_TYPE.CASH_IN) {
        this.transactions.push(await TransactionCashIn.create(transaction));
      } else if (
        type === TRANSACTION_TYPE.CASH_OUT &&
        user_type === USER_TYPE.JURIDICAL
      ) {
        this.transactions.push(
          await TransactionCashOutJuridical.create(transaction),
        );
      } else if (
        type === TRANSACTION_TYPE.CASH_OUT &&
        user_type === USER_TYPE.NATURAL
      ) {
        this.transactions.push(
          await TransactionCashOutNatural.create(transaction, transactions),
        );
      }
    }
  }

  processTransactions() {
    return this.transactions.map((transaction) => transaction.calculateFee());
  }
}
