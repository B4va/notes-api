/**
 * Erreur de paramétrage d'une requête.
 */
export default class InvalidQueryError extends Error {
  constructor(details, ...params) {
    super(...params);
  }
}
