import adaptRequest from '../adapters/request_adapter';
import isClientValid from '../auth/client_validator';

/**
 * Constructeur du traitement d'une requête http.
 * @param {Function} control controleur
 * @returns {Function} prise en charge de la requête
 */
export default (control) => (req, res) => {
	const httpRequest = adaptRequest(req);
	if (!isClientValid(httpRequest, process.env.CLIENT_TOKEN)) {
		res.status(401).send({ error: "Erreur d'authentification du client." });
	}
	control(httpRequest)
		.then(({ headers, statusCode, data }) => res.set(headers).status(statusCode).send(data))
		.catch((e) => {
			res.status(500).send({ error: e.message });
		});
};
