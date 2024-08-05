import fs from "fs";
import { TransactionsController } from "./transactions-controller.js";
import { TransactionCashIn } from "../models/transaction-cash-in.js";
import { TransactionCashOutJuridical } from "../models/transaction-cash-out-juridical.js";
import { TransactionCashOutNatural } from "../models/transaction-cash-out-natural.js";
import { TRANSACTION_TYPE, USER_TYPE } from "../constants.js";

// Mocking the modules
jest.mock("fs");
jest.mock("../models/transaction-cash-in.js");
jest.mock("../models/transaction-cash-out-juridical.js");
jest.mock("../models/transaction-cash-out-natural.js");

describe("TransactionsController", () => {
  const transactionConfigMock = {
    getCashInConfig: jest
      .fn()
      .mockResolvedValue({ max: { amount: 5 }, percents: 0.03 }),
    getJuridicalCashOutConfig: jest
      .fn()
      .mockResolvedValue({ percents: 0.3, min: { amount: 0.5 } }),
    getNaturalCashOutConfig: jest
      .fn()
      .mockResolvedValue({ percents: 0.3, week_limit: { amount: 1000 } }),
  };

  const mockTransactions = [
    { type: TRANSACTION_TYPE.CASH_IN, operation: { amount: 200 } },
    {
      type: TRANSACTION_TYPE.CASH_OUT,
      user_type: USER_TYPE.JURIDICAL,
      operation: { amount: 300 },
    },
    {
      type: TRANSACTION_TYPE.CASH_OUT,
      user_type: USER_TYPE.NATURAL,
      operation: { amount: 400 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadTransactions", () => {
    it("should load transactions from the file and create instances", async () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTransactions));

      const transactionsController = new TransactionsController(
        transactionConfigMock,
      );
      await transactionsController.loadTransactions(
        "path/to/transactions.json",
      );

      expect(fs.readFileSync).toHaveBeenCalledWith(
        "path/to/transactions.json",
        "utf8",
      );
      expect(transactionConfigMock.getCashInConfig).toHaveBeenCalled();
      expect(
        transactionConfigMock.getJuridicalCashOutConfig,
      ).toHaveBeenCalled();
      expect(transactionConfigMock.getNaturalCashOutConfig).toHaveBeenCalled();

      expect(TransactionCashIn).toHaveBeenCalledWith(mockTransactions[0], {
        max: { amount: 5 },
        percents: 0.03,
      });
      expect(TransactionCashOutJuridical).toHaveBeenCalledWith(
        mockTransactions[1],
        { percents: 0.3, min: { amount: 0.5 } },
      );
      expect(TransactionCashOutNatural).toHaveBeenCalledWith(
        mockTransactions[2],
        { percents: 0.3, week_limit: { amount: 1000 } },
        mockTransactions,
      );
    });
  });

  describe("processTransactions", () => {
    it("should process all transactions and calculate fees", () => {
      const transactionCashInInstance = {
        calculateFee: jest.fn().mockReturnValue(1),
      };
      const transactionCashOutJuridicalInstance = {
        calculateFee: jest.fn().mockReturnValue(2),
      };
      const transactionCashOutNaturalInstance = {
        calculateFee: jest.fn().mockReturnValue(3),
      };

      const controller = new TransactionsController(transactionConfigMock);
      controller.transactions = [
        transactionCashInInstance,
        transactionCashOutJuridicalInstance,
        transactionCashOutNaturalInstance,
      ];

      const fees = controller.processTransactions();

      expect(transactionCashInInstance.calculateFee).toHaveBeenCalled();
      expect(
        transactionCashOutJuridicalInstance.calculateFee,
      ).toHaveBeenCalled();
      expect(transactionCashOutNaturalInstance.calculateFee).toHaveBeenCalled();
      expect(fees).toEqual([1, 2, 3]);
    });
  });
});
