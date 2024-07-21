import {
  fetchRequest,
  calculatePercentage,
  roundDecimal,
  getISOWeekNumber,
} from "./utils.js";

// Mocking fetch globally
global.fetch = jest.fn();

describe("Utility Functions", () => {
  describe("fetchRequest", () => {
    it("should fetch data from the given URL and return JSON response", async () => {
      const mockData = { success: true };
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });

      const url = "https://api.example.com/data";
      const data = await fetchRequest(url);

      expect(fetch).toHaveBeenCalledWith(url);
      expect(data).toEqual(mockData);
    });

    it("should log an error message if fetching fails", async () => {
      console.error = jest.fn(); // Mock console.error
      fetch.mockRejectedValue(new Error("Network error"));

      const url = "https://api.example.com/data";
      const data = await fetchRequest(url);

      expect(fetch).toHaveBeenCalledWith(url);
      expect(console.error).toHaveBeenCalledWith(
        `Something went wrong while fetching ${url}`,
      );
      expect(data).toBeUndefined();
    });
  });

  describe("calculatePercentage", () => {
    it("should calculate the percentage of the given amount", () => {
      const amount = 1000;
      const percentage = 5;
      const result = calculatePercentage(amount, percentage);

      expect(result).toBe(50);
    });

    it("should return 0 if amount or percentage is 0", () => {
      expect(calculatePercentage(0, 5)).toBe(0);
      expect(calculatePercentage(1000, 0)).toBe(0);
    });
  });

  describe("roundDecimal", () => {
    it("should round the decimal part of the number correctly", () => {
      expect(roundDecimal(10.123)).toBe(10.13);
      expect(roundDecimal(10.126)).toBe(10.13);
      expect(roundDecimal(10.999)).toBe(11.0);
    });

    it("should return the same number if it has no decimal part", () => {
      expect(roundDecimal(10)).toBe(10);
    });
  });

  describe("getISOWeekNumber", () => {
    it("should return the correct ISO week number for a given date", () => {
      expect(getISOWeekNumber("2024-07-21")).toBe(29);
      expect(getISOWeekNumber("2024-01-01")).toBe(1);
      expect(getISOWeekNumber("2024-12-31")).toBe(1); // Edge case for year-end
    });
  });
});
