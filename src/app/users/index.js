import buildUsersDao from './users_dao';
import buildUsersController from './users_controller';
import adaptRequest from '../../helpers/request_adapter';

export default database => {
  const usersDao = buildUsersDao (database);
  const handleUsersRequest = buildUsersController (usersDao);

  return (req, res) => {
    const httpRequest = adaptRequest (req);
    handleUsersRequest (httpRequest)
      .then (({headers, statusCode, data}) =>
        res.set (headers).status (statusCode).send (data)
      )
      .catch (e => {
        res.status (500).send ({error: e.message});
      });
  };
};
