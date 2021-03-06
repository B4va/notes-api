/**
 * Adapte une requête http pour traitements.
 * @param {Object} req requête http
 * @returns {Object} requête adaptée
 */
export default (req = {}) =>
	Object.freeze({
		path: req.path,
		method: req.method,
		params: req.params,
		query: req.query,
		body: req.body,
		headers: req.headers,
		clientToken: req.headers.clienttoken,
	});
