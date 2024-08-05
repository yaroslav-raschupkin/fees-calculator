import { TransactionCashIn } from "./transaction-cash-in.js";
import { calculatePercentage, roundDecimal } from "../utils.js";
import { TRANSACTION_TYPE } from "../constants.js";

// Mocking utility functions
jest.mock("../utils.js", () => ({
  calculatePercentage: jest.fn(),
  roundDecimal: jest.fn(),
}));

describe("TransactionCashIn", () => {
  const mockTransaction = {
    type: TRANSACTION_TYPE.CASH_IN,
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

  describe("validate", () => {
    it("should throw an error for invalid transaction type", () => {
      const invalidTransaction = { type: TRANSACTION_TYPE.CASH_OUT };

      expect(
        () => new TransactionCashIn(invalidTransaction, mockConfig),
      ).toThrow("TransactionCashIn: provided type 'cash_out' is not valid.");
    });

    it("should not throw an error for valid transaction type", () => {
      expect(
        () => new TransactionCashIn(mockTransaction, mockConfig),
      ).not.toThrow();
    });
  });
});
