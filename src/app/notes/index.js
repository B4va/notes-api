import buildNotesDao from './notes_dao';
import buildNotesController from './notes_controller';
import adaptRequest from '../../helpers/request_adapter';

export default (database) => {
  const notesDao = buildNotesDao(database);
  const handleNotesRequest = buildNotesController(notesDao);

  return (req, res) => {
    const httpRequest = adaptRequest(req);
    handleNotesRequest(httpRequest)
      .then(({ headers, statusCode, data }) =>
        res.set(headers).status(statusCode).send(data),
      )
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  };
};
