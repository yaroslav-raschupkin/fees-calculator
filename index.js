import { TransactionsController } from "./app/controllers/transactions-controller.js";

function app() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Path to transactions file was not provided");
  }

  const transactionsController = new TransactionsController();
  transactionsController.loadTransactions(filePath);
}

try {
  app();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
}
