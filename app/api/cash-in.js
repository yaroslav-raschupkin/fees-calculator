import { fetchRequest } from "../utils.js";

export function getCashInConfig() {
  return fetchRequest("https://developers.paysera.com/tasks/api/cash-in");
}
