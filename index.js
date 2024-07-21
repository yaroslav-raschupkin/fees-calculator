import { TransactionsController } from "./app/controllers/transactions-controller.js";

try {
  (async function app() {
    const filePath = process.argv[2];

    if (!filePath) {
      throw new Error("Path to transactions file was not provided");
    }

    const transactionsController = new TransactionsController();
    await transactionsController.loadTransactions(filePath);
    const fees = transactionsController.processTransactions();
    console.log(fees.map((fee) => fee.toFixed(2)).join("\n"));
  })();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
}
