import { TransactionCashIn } from "./transaction-cash-in.js";
import { calculatePercentage, fetchRequest, roundDecimal } from "../utils.js";

// Mocking utility functions
jest.mock("../utils.js", () => ({
  calculatePercentage: jest.fn(),
  fetchRequest: jest.fn(),
  roundDecimal: jest.fn(),
}));

describe("TransactionCashIn", () => {
  const mockTransaction = {
    type: "cash_in",
    operation: { amount: 1000 },
  };

  const mockConfig = {
    max: { amount: 5 },
    percents: 0.03,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateFee", () => {
    it("should calculate the fee and apply the maximum fee limit", () => {
      const transactionCashIn = new TransactionCashIn(
        mockTransaction,
        mockConfig,
      );
      calculatePercentage.mockReturnValue(30); // 1000 * 0.03
      roundDecimal.mockImplementation((value) => value);

      const fee = transactionCashIn.calculateFee();

      expect(calculatePercentage).toHaveBeenCalledWith(1000, 0.03);
      expect(roundDecimal).toHaveBeenCalledWith(5); // max fee is 5
      expect(fee).toBe(5);
    });

    it("should calculate the fee without applying the maximum fee limit", () => {
      const transactionCashIn = new TransactionCashIn(mockTransaction, {
        max: { amount: 50 },
        percents: 0.03,
      });
      calculatePercentage.mockReturnValue(30); // 1000 * 0.03
      roundDecimal.mockImplementation((value) => value);

      const fee = transactionCashIn.calculateFee();

      expect(calculatePercentage).toHaveBeenCalledWith(1000, 0.03);
      expect(roundDecimal).toHaveBeenCalledWith(30); // fee is 30
      expect(fee).toBe(30);
    });
  });

  describe("getConfig", () => {
    it("should fetch and return the config", async () => {
      fetchRequest.mockResolvedValue(mockConfig);
      TransactionCashIn.config = null;
      const config = await TransactionCashIn.getConfig();
      expect(config).toEqual(mockConfig);
    });

    it("should return cached config if already fetched", async () => {
      TransactionCashIn.config = mockConfig;

      const config = await TransactionCashIn.getConfig();

      expect(fetchRequest).not.toHaveBeenCalled();
      expect(config).toEqual(mockConfig);
    });
  });

  describe("create", () => {
    it("should create a TransactionCashIn instance", async () => {
      fetchRequest.mockResolvedValue(mockConfig);
      const transactionCashIn = await TransactionCashIn.create(mockTransaction);
      expect(transactionCashIn).toBeInstanceOf(TransactionCashIn);
      expect(transactionCashIn.transaction).toEqual(mockTransaction);
      expect(transactionCashIn.config).toEqual(mockConfig);
    });

    it("should throw an error for invalid transaction type", async () => {
      const invalidTransaction = { ...mockTransaction, type: "cash_out" };

      await expect(
        TransactionCashIn.create(invalidTransaction),
      ).rejects.toThrow(
        "TransactionCashIn: provided type 'cash_out' is not valid.",
      );
    });
  });

  describe("validate", () => {
    it("should throw an error for invalid transaction type", () => {
      const invalidTransaction = { type: "cash_out" };

      expect(() => TransactionCashIn.validate(invalidTransaction)).toThrow(
        "TransactionCashIn: provided type 'cash_out' is not valid.",
      );
    });

    it("should not throw an error for valid transaction type", () => {
      expect(() => TransactionCashIn.validate(mockTransaction)).not.toThrow();
    });
  });
});
