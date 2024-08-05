import { TransactionConfig } from "./transaction-config.js";
import { getCashInConfig } from "../api/cash-in.js";
import {
  getJuridicalCashOutConfig,
  getNaturalCashOutConfig,
} from "../api/cash-out.js";

// Mocking API calls
jest.mock("../api/cash-in.js", () => ({
  getCashInConfig: jest.fn(),
}));

jest.mock("../api/cash-out.js", () => ({
  getJuridicalCashOutConfig: jest.fn(),
  getNaturalCashOutConfig: jest.fn(),
}));

describe("TransactionConfig", () => {
  const mockCashInConfig = { max: { amount: 5 }, percents: 0.03 };
  const mockNaturalCashOutConfig = {
    percents: 0.3,
    week_limit: { amount: 1000 },
  };
  const mockJuridicalCashOutConfig = { percents: 0.5, min: { amount: 0.5 } };

  let transactionConfig;

  beforeEach(() => {
    transactionConfig = new TransactionConfig();
    jest.clearAllMocks();
  });

  describe("getCashInConfig", () => {
    it("should fetch and return the cash-in config if not cached", async () => {
      getCashInConfig.mockResolvedValue(mockCashInConfig);
      const config = await transactionConfig.getCashInConfig();
      expect(getCashInConfig).toHaveBeenCalled();
      expect(config).toEqual(mockCashInConfig);
    });

    it("should return cached cash-in config if already fetched", async () => {
      transactionConfig.cashInConfig = mockCashInConfig;
      const config = await transactionConfig.getCashInConfig();
      expect(getCashInConfig).not.toHaveBeenCalled();
      expect(config).toEqual(mockCashInConfig);
    });
  });

  describe("getNaturalCashOutConfig", () => {
    it("should fetch and return the natural cash-out config if not cached", async () => {
      getNaturalCashOutConfig.mockResolvedValue(mockNaturalCashOutConfig);
      const config = await transactionConfig.getNaturalCashOutConfig();
      expect(getNaturalCashOutConfig).toHaveBeenCalled();
      expect(config).toEqual(mockNaturalCashOutConfig);
    });

    it("should return cached natural cash-out config if already fetched", async () => {
      transactionConfig.naturalCashOutConfig = mockNaturalCashOutConfig;
      const config = await transactionConfig.getNaturalCashOutConfig();
      expect(getNaturalCashOutConfig).not.toHaveBeenCalled();
      expect(config).toEqual(mockNaturalCashOutConfig);
    });
  });

  describe("getJuridicalCashOutConfig", () => {
    it("should fetch and return the juridical cash-out config if not cached", async () => {
      getJuridicalCashOutConfig.mockResolvedValue(mockJuridicalCashOutConfig);
      const config = await transactionConfig.getJuridicalCashOutConfig();
      expect(getJuridicalCashOutConfig).toHaveBeenCalled();
      expect(config).toEqual(mockJuridicalCashOutConfig);
    });

    it("should return cached juridical cash-out config if already fetched", async () => {
      transactionConfig.juridicalCashOutConfig = mockJuridicalCashOutConfig;
      const config = await transactionConfig.getJuridicalCashOutConfig();
      expect(getJuridicalCashOutConfig).not.toHaveBeenCalled();
      expect(config).toEqual(mockJuridicalCashOutConfig);
    });
  });
});
