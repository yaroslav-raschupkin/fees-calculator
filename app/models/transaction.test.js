// file.test.js

import { Transaction } from "./transaction.js";
import { TRANSACTION_TYPE } from "../constants.js";

describe("Transaction", () => {
  let transactionData;
  let config;

  beforeEach(() => {
    transactionData = { amount: 100, type: TRANSACTION_TYPE.CASH_OUT };
    config = { fee: 0.01 };
  });

  it("should create a Transaction instance", () => {
    const transaction = new Transaction(transactionData, config);
    expect(transaction).toBeInstanceOf(Transaction);
  });

  it("should initialize with transaction data and config", () => {
    const transaction = new Transaction(transactionData, config);
    expect(transaction.transaction).toEqual(transactionData);
    expect(transaction.config).toEqual(config);
  });
});
