import buildUsersDao from './users_dao';
import buildUsersController from './users_controller';
import buildUsersHandler from '../core/helpers/handler_builder';

export default (database, authManager) => {
  const usersDao = buildUsersDao(database);
  const usersController = buildUsersController(usersDao, authManager);
  return buildUsersHandler(usersController);
};
