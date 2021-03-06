/**
 * Construit une erreur http.
 * @param {Number} statusCode code de l'erreur
 * @param {String} errorMessage message d'erreur
 * @param {String} details détails de l'erreur
 */
function _buildHttpError(statusCode, errorMessage, details = null) {
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
export const serverError = () => _buildHttpError(500, 'Erreur serveur.');

/**
 * Erreur de format des données.
 * @returns {Object} erreur http
 */
export const dataError = () => _buildHttpError(400, 'Impossible de lire les données.');

/**
 * Erreur de validation des données.
 * @param {Error} e erreur
 * @returns {Object} erreur http
 */
export const invalidDataError = (e) => _buildHttpError(400, 'Les données renseignées sont invalides.', e.details);

/**
 * Erreur de violation de la contrainte d'unicité : l'information doit être unique.
 * @param {Error} e erreur
 * @returns {Object} erreur http
 */
export const uniqueViolationError = (e) => _buildHttpError(400, 'Les données renseignées sont invalides.', e.message);

/**
 * Erreur dans la requête envoyée au serveur
 * @returns {Object} erreur http
 */
export const invalidRequestError = () => _buildHttpError(400, 'Requête invalide.');

/**
 * Erreur d'authentification.
 * @returns {Object} erreur http
 */
export const authValidationError = () => _buildHttpError(401, 'Accès non autorisé.');

/**
 * Erreur de contenu des données : aucune donnée.
 * @returns {Object} erreur http
 */
export const noDataFoundError = () => _buildHttpError(404, "Aucune donnée n'a été trouvée");
