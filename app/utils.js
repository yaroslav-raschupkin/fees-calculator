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

export function getISOWeekNumber(date) {
  const dateObj = new Date(date);
  const dayOfWeek = (dateObj.getDay() + 6) % 7;
  dateObj.setDate(dateObj.getDate() - dayOfWeek + 3);
  const firstThursday = new Date(dateObj.getFullYear(), 0, 4);
  return Math.ceil(
    ((dateObj - firstThursday) / 86400000 + firstThursday.getDay() + 1) / 7,
  );
}
