/**
 * Fetch wrapper with error boundary
 * @param {string} url - URL for fetch request
 * @returns {Promise<any>}
 */
export async function fetchRequest(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error(`Something went wrong while fetching ${url}`);
  }
}

export function calculatePercentage(amount, percentage) {
  return (amount * percentage) / 100;
}

export function roundDecimal(number) {
  const int = Math.floor(number);
  const dec = number - int;
  const roundedDecimalPart = Math.ceil(dec * 100) / 100;
  return int + roundedDecimalPart;
}
