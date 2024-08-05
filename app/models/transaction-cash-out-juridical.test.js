import { TransactionCashOutJuridical } from "./transaction-cash-out-juridical.js";
import { calculatePercentage, roundDecimal } from "../utils.js";
import { TRANSACTION_TYPE, USER_TYPE } from "../constants.js";
import { getJuridicalCashOutConfig } from "../api/cash-out.js";

// Mocking utility functions
jest.mock("../utils.js", () => ({
  calculatePercentage: jest.fn(),
  roundDecimal: jest.fn(),
}));

// Mocking API calls
jest.mock("../api/cash-out.js", () => ({
  getJuridicalCashOutConfig: jest.fn(),
}));

describe("TransactionCashOutJuridical", () => {
  const mockTransaction = {
    type: TRANSACTION_TYPE.CASH_OUT,
    user_type: USER_TYPE.JURIDICAL,
    operation: { amount: 1000 },
  };

  const mockConfig = {
    min: { amount: 5 },
    percents: 0.03,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateFee", () => {
    it("should calculate the fee and apply the minimum fee limit", () => {
      const transactionCashOutJuridical = new TransactionCashOutJuridical(
        mockTransaction,
        mockConfig,
      );
      calculatePercentage.mockReturnValue(30); // 1000 * 0.03
      roundDecimal.mockImplementation((value) => value);

      const fee = transactionCashOutJuridical.calculateFee();

      expect(calculatePercentage).toHaveBeenCalledWith(1000, 0.03);
      expect(roundDecimal).toHaveBeenCalledWith(30); // fee is 30
      expect(fee).toBe(30);
    });

    it("should calculate the fee without applying the minimum fee limit", () => {
      const transactionCashOutJuridical = new TransactionCashOutJuridical(
        mockTransaction,
        {
          min: { amount: 50 },
          percents: 0.03,
        },
      );
      calculatePercentage.mockReturnValue(30); // 1000 * 0.03
      roundDecimal.mockImplementation((value) => value);

      const fee = transactionCashOutJuridical.calculateFee();

      expect(calculatePercentage).toHaveBeenCalledWith(1000, 0.03);
      expect(roundDecimal).toHaveBeenCalledWith(50); // min fee is 50
      expect(fee).toBe(50);
    });
  });

  describe("getConfig", () => {
    it("should fetch and return the config", async () => {
      getJuridicalCashOutConfig.mockResolvedValue(mockConfig);
      TransactionCashOutJuridical.config = null;

      const config = await TransactionCashOutJuridical.getConfig();
      expect(config).toEqual(mockConfig);
    });

    it("should return cached config if already fetched", async () => {
      TransactionCashOutJuridical.config = mockConfig;

      const config = await TransactionCashOutJuridical.getConfig();

      expect(getJuridicalCashOutConfig).not.toHaveBeenCalled();
      expect(config).toEqual(mockConfig);
    });
  });

  describe("create", () => {
    it("should create a TransactionCashOutJuridical instance", async () => {
      getJuridicalCashOutConfig.mockResolvedValue(mockConfig);

      const transactionCashOutJuridical =
        await TransactionCashOutJuridical.create(mockTransaction);
      expect(transactionCashOutJuridical).toBeInstanceOf(
        TransactionCashOutJuridical,
      );
      expect(transactionCashOutJuridical.transaction).toEqual(mockTransaction);
      expect(transactionCashOutJuridical.config).toEqual(mockConfig);
    });

    it("should throw an error for invalid transaction type", async () => {
      const invalidTransaction = {
        ...mockTransaction,
        type: TRANSACTION_TYPE.CASH_IN,
      };

      await expect(
        TransactionCashOutJuridical.create(invalidTransaction),
      ).rejects.toThrow(
        "TransactionCashOutJuridical: provided type 'cash_in' is not valid.",
      );
    });

    it("should throw an error for invalid user type", async () => {
      const invalidTransaction = {
        ...mockTransaction,
        user_type: USER_TYPE.NATURAL,
      };

      await expect(
        TransactionCashOutJuridical.create(invalidTransaction),
      ).rejects.toThrow(
        "TransactionCashOutJuridical: provided user type 'natural' is not valid.",
      );
    });
  });

  describe("validate", () => {
    it("should throw an error for invalid transaction type", () => {
      const invalidTransaction = {
        type: TRANSACTION_TYPE.CASH_IN,
        user_type: USER_TYPE.JURIDICAL,
      };

      expect(() =>
        TransactionCashOutJuridical.validate(invalidTransaction),
      ).toThrow(
        "TransactionCashOutJuridical: provided type 'cash_in' is not valid.",
      );
    });

    it("should throw an error for invalid user type", () => {
      const invalidTransaction = {
        type: TRANSACTION_TYPE.CASH_OUT,
        user_type: USER_TYPE.NATURAL,
      };

      expect(() =>
        TransactionCashOutJuridical.validate(invalidTransaction),
      ).toThrow(
        "TransactionCashOutJuridical: provided user type 'natural' is not valid.",
      );
    });

    it("should not throw an error for valid transaction", () => {
      expect(() =>
        TransactionCashOutJuridical.validate(mockTransaction),
      ).not.toThrow();
    });
  });
});
