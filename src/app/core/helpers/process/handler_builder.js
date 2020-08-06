import adaptRequest from '../adapters/request_adapter';

/**
 * Constructeur du traitement d'une requête http.
 * @param {Function} control controleur
 * @returns {Function} prise en charge de la requête
 */
export default (control) => (req, res) => {
  const httpRequest = adaptRequest(req);
  control(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data),
    )
    .catch((e) => {
      res.status(500).send({ error: e.message });
    });
};
