import { fetchRequest } from "../utils.js";

export function getNaturalCashOutConfig() {
  return fetchRequest(
    "https://developers.paysera.com/tasks/api/cash-out-natural",
  );
}

export function getJuridicalCashOutConfig() {
  return fetchRequest(
    "https://developers.paysera.com/tasks/api/cash-out-juridical",
  );
}
