import fs from "fs";
import { TransactionsController } from "./transactions-controller.js";
import { TransactionCashIn } from "../models/transaction-cash-in.js";
import { TransactionCashOutJuridical } from "../models/transaction-cash-out-juridical.js";
import { TransactionCashOutNatural } from "../models/transaction-cash-out-natural.js";

// Mocking the modules
jest.mock("fs");
jest.mock("../models/transaction-cash-in.js");
jest.mock("../models/transaction-cash-out-juridical.js");
jest.mock("../models/transaction-cash-out-natural.js");

describe("TransactionsController", () => {
  const mockTransactions = [
    { type: "cash_in", operation: { amount: 200 } },
    { type: "cash_out", user_type: "juridical", operation: { amount: 300 } },
    { type: "cash_out", user_type: "natural", operation: { amount: 400 } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadTransactions", () => {
    it("should load transactions from the file and create instances", async () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTransactions));

      const transactionCashInInstance = { calculateFee: jest.fn() };
      const transactionCashOutJuridicalInstance = { calculateFee: jest.fn() };
      const transactionCashOutNaturalInstance = { calculateFee: jest.fn() };

      TransactionCashIn.create.mockResolvedValue(transactionCashInInstance);
      TransactionCashOutJuridical.create.mockResolvedValue(
        transactionCashOutJuridicalInstance,
      );
      TransactionCashOutNatural.create.mockResolvedValue(
        transactionCashOutNaturalInstance,
      );

      const controller = new TransactionsController();
      await controller.loadTransactions("path/to/file");

      expect(fs.readFileSync).toHaveBeenCalledWith("path/to/file", "utf8");
      expect(TransactionCashIn.create).toHaveBeenCalledWith(
        mockTransactions[0],
      );
      expect(TransactionCashOutJuridical.create).toHaveBeenCalledWith(
        mockTransactions[1],
      );
      expect(TransactionCashOutNatural.create).toHaveBeenCalledWith(
        mockTransactions[2],
        mockTransactions,
      );
      expect(controller.transactions).toEqual([
        transactionCashInInstance,
        transactionCashOutJuridicalInstance,
        transactionCashOutNaturalInstance,
      ]);
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

      const controller = new TransactionsController();
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
