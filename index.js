function app() {
  const fileName = process.argv[2];

  if (!fileName) {
    throw new Error("Path to transactions file was not provided");
  }
}

try {
  app();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
}
