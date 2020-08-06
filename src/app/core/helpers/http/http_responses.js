import buildDatabase from '../../db';

/**
 * Construit une réponse http valide.
 * @param {Number} statusCode code de la réponse
 * @param {Object} result données renvoyées
 */
function _buildHttpResponse(statusCode, result) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: JSON.stringify(result),
  };
}

/**
 * Retour de données.
 * @param {Object} result données à renvoyer
 * @returns {Object} réponse http
 */
export const ok = (result) => _buildHttpResponse(200, result);

/**
 * Retour de données après création d'un objet.
 * @param {Object} result objet à renvoyer
 * @returns {Object} réponse http
 */
export const created = (result) => _buildHttpResponse(201, result);

/**
 * Retour sans données.
 * @param {Object} message message à renvoyer
 * @returns {Object} réponse http
 */
export const noContent = (message) => _buildHttpResponse(200, message);
