import buildUsersDao from './users_dao';
import buildUsersController from './users_controller';
import buildUsersHandler from '../../core/process/handler_builder';

export default async (database, authManager) => {
  const usersDao = await buildUsersDao(database);
  const usersController = buildUsersController(usersDao, authManager);
  return buildUsersHandler(usersController);
};
