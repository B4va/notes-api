/**
 * Erreur de validation des données.
 */
export default class DataValidationError extends Error {
  constructor(details, ...params) {
    super(...params);
    this.details = details;
  }
}
