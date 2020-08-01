import adaptRequest from '../helpers/request_adapter';

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
