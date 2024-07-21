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
