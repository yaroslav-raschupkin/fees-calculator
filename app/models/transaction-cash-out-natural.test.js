import { TransactionCashOutNatural } from "./transaction-cash-out-natural.js";
import {
  calculatePercentage,
  fetchRequest,
  getISOWeekNumber,
  roundDecimal,
} from "../utils.js";

// Mocking utility functions
jest.mock("../utils.js", () => ({
  calculatePercentage: jest.fn(),
  fetchRequest: jest.fn(),
  getISOWeekNumber: jest.fn(),
  roundDecimal: jest.fn(),
}));

describe("TransactionCashOutNatural", () => {
  const mockTransaction = {
    type: "cash_out",
    user_type: "natural",
    user_id: 1,
    date: "2024-07-21",
    operation: { amount: 1000 },
  };

  const mockConfig = {
    week_limit: { amount: 1000 },
    percents: 0.03,
  };

  const mockTransactions = [
    { ...mockTransaction, date: "2024-07-20", operation: { amount: 500 } },
    mockTransaction,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateFee", () => {
    it("should calculate the fee correctly considering the week limit", () => {
      getISOWeekNumber.mockReturnValue(29); // Mocking week number
      calculatePercentage.mockReturnValue(0);
      roundDecimal.mockImplementation((value) => value);

      const transactionCashOutNatural = new TransactionCashOutNatural(
        mockTransaction,
        mockConfig,
        mockTransactions,
      );

      const fee = transactionCashOutNatural.calculateFee();

      expect(getISOWeekNumber).toHaveBeenCalledWith("2024-07-21");
      expect(calculatePercentage).toHaveBeenCalledWith(500, 0.03);
      expect(roundDecimal).toHaveBeenCalledWith(0);
      expect(fee).toBe(0);
    });

    it("should throw an error if the transaction is not in the list", () => {
      const transactionCashOutNatural = new TransactionCashOutNatural(
        mockTransaction,
        mockConfig,
        [],
      );

      expect(() => transactionCashOutNatural.calculateFee()).toThrow(
        "TransactionCashOutNatural: provided transactions is not in the list",
      );
    });

    it("should calculate the fee when the week limit is exceeded", () => {
      getISOWeekNumber.mockReturnValue(29);
      calculatePercentage.mockReturnValue(30); // Mocking fee calculation
      roundDecimal.mockImplementation((value) => value);

      const transactionCashOutNatural = new TransactionCashOutNatural(
        mockTransaction,
        mockConfig,
        mockTransactions,
      );
      mockTransactions[0].operation.amount = 1200;

      const fee = transactionCashOutNatural.calculateFee();

      expect(getISOWeekNumber).toHaveBeenCalledWith("2024-07-21");
      expect(calculatePercentage).toHaveBeenCalledWith(1000, 0.03);
      expect(roundDecimal).toHaveBeenCalledWith(30);
      expect(fee).toBe(30);
    });
  });

  describe("getConfig", () => {
    it("should fetch and return the config", async () => {
      fetchRequest.mockResolvedValue(mockConfig);
      TransactionCashOutNatural.config = null;

      const config = await TransactionCashOutNatural.getConfig();
      expect(config).toEqual(mockConfig);
    });

    it("should return cached config if already fetched", async () => {
      TransactionCashOutNatural.config = mockConfig;

      const config = await TransactionCashOutNatural.getConfig();

      expect(fetchRequest).not.toHaveBeenCalled();
      expect(config).toEqual(mockConfig);
    });
  });

  describe("create", () => {
    it("should create a TransactionCashOutNatural instance", async () => {
      fetchRequest.mockResolvedValue(mockConfig);

      const transactionCashOutNatural = await TransactionCashOutNatural.create(
        mockTransaction,
        mockTransactions,
      );

      expect(transactionCashOutNatural).toBeInstanceOf(
        TransactionCashOutNatural,
      );
      expect(transactionCashOutNatural.transaction).toEqual(mockTransaction);
      expect(transactionCashOutNatural.config).toEqual(mockConfig);
      expect(transactionCashOutNatural.transactions).toEqual(mockTransactions);
    });

    it("should throw an error for invalid transaction type", async () => {
      const invalidTransaction = { ...mockTransaction, type: "cash_in" };

      await expect(
        TransactionCashOutNatural.create(invalidTransaction, mockTransactions),
      ).rejects.toThrow(
        "TransactionCashOutNatural: provided type 'cash_in' is not valid.",
      );
    });

    it("should throw an error for invalid user type", async () => {
      const invalidTransaction = { ...mockTransaction, user_type: "juridical" };

      await expect(
        TransactionCashOutNatural.create(invalidTransaction, mockTransactions),
      ).rejects.toThrow(
        "TransactionCashOutNatural: provided user type 'juridical' is not valid.",
      );
    });
  });

  describe("validate", () => {
    it("should throw an error for invalid transaction type", () => {
      const invalidTransaction = { type: "cash_in", user_type: "natural" };

      expect(() =>
        TransactionCashOutNatural.validate(invalidTransaction),
      ).toThrow(
        "TransactionCashOutNatural: provided type 'cash_in' is not valid.",
      );
    });

    it("should throw an error for invalid user type", () => {
      const invalidTransaction = { type: "cash_out", user_type: "juridical" };

      expect(() =>
        TransactionCashOutNatural.validate(invalidTransaction),
      ).toThrow(
        "TransactionCashOutNatural: provided user type 'juridical' is not valid.",
      );
    });

    it("should not throw an error for valid transaction", () => {
      expect(() =>
        TransactionCashOutNatural.validate(mockTransaction),
      ).not.toThrow();
    });
  });
});
