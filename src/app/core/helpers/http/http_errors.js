/**
 * Construit une erreur http.
 * @param {Number} statusCode code de l'erreur
 * @param {String} errorMessage message d'erreur
 * @param {String} details détails de l'erreur
 */
function buildHttpError(statusCode, errorMessage, details = null) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: {
      success: false,
      error: { message: errorMessage, details: details },
    },
  };
}

/**
 * Erreur serveur.
 * @returns {Object} erreur http
 */
export const serverError = () => buildHttpError(500, 'Erreur serveur.');

/**
 * Erreur de format des données.
 * @returns {Object} erreur http
 */
export const dataError = () =>
  buildHttpError(400, 'Impossible de lire les données.');

/**
 * Erreur de validation des données.
 * @param {Error} e erreur
 * @returns {Object} erreur http
 */
export const invalidDataError = (e) =>
  buildHttpError(400, 'Les données renseignées sont invalides.', e.details);

/**
 * Erreur de violation de la contrainte d'unicité : l'information doit être unique.
 * @param {Error} e erreur
 * @returns {Object} erreur http
 */
export const uniqueViolationError = (e) =>
  buildHttpError(400, 'Les données renseignées sont invalides.', e.message);

/**
 * Erreur d'authentification.
 * @returns {Object} erreur http
 */
export const authValidationError = () =>
  buildHttpError(401, 'Accès non autorisé.');

/**
 * Erreur de contenu des données : aucune donnée.
 * @returns {Object} erreur http
 */
export const noDataFoundError = () =>
  buildHttpError(404, "Aucune donnée n'a été trouvée");
