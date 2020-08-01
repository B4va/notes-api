import buildUsersDao from './users_dao';
import buildUsersController from './users_controller';
import adaptRequest from '../../helpers/request_adapter';
import buildUsersHandler from '../../helpers/handler_builder';

export default (database) => {
  const usersDao = buildUsersDao(database);
  const usersController = buildUsersController(usersDao);
  return buildUsersHandler(usersController);
};
