/**
 * Isole le token de connexion à partir d'une requête http.
 * @param {Object} httpRequest requête http
 * @returns {String} token de connexion
 */
export default (httpRequest) => {
  const authHeader = httpRequest.headers['authorization'];
  return authHeader.split(' ')[1];
};
