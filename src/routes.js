import buildUsersHandler from './app/users';
import buildNotesHandler from './app/notes';

const root = '/api/v0';

export default (app, database) => {
  const usersHandler = buildUsersHandler (database);
  const notesHandler = buildNotesHandler (database);

  // Users routes
  app.get (`${root}/users`, usersHandler);
  app.post (`${root}/users`, usersHandler);
  app.put (`${root}/users`, usersHandler);
  app.delete (`${root}/users`, usersHandler);

  // Notes routes
  app.get (`${root}/notes`, notesHandler);
  app.get (`${root}/notes/:id`, notesHandler);
  app.post (`${root}/notes`, notesHandler);
  app.put (`${root}/notes/:id`, notesHandler);
  app.delete (`${root}/notes`, notesHandler);
  app.delete (`${root}/notes/:id`, notesHandler);
};
