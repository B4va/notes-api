import buildUsersHandler from './app/users';
import buildNotesHandler from './app/notes';

const root = '/api/v0';

export default (app, database) => {
  const usersHandler = buildUsersHandler(database);
  const notesHandler = buildNotesHandler(database);

  /**
   * USERS
   */
  app.get(`${root}/users`, usersHandler); // GET utilisateur connecté
  app.post(`${root}/users`, usersHandler); // POST nouvel utilisateur
  app.put(`${root}/users`, usersHandler); // PUT maj utilisateur connecté
  app.delete(`${root}/users`, usersHandler); // DELETE utilisateur connecté

  /**
   * NOTES
   */
  app.get(`${root}/notes`, notesHandler); // GET toutes les notes de l'utilisateur connecté
  app.get(`${root}/notes/:id`, notesHandler); // GET une note de l'utilisateur connecté
  app.post(`${root}/notes`, notesHandler); // POST nouvelle note pour l'utilisateur connecté
  app.put(`${root}/notes/:id`, notesHandler); // PUT maj d'une note de l'utilisateur connecté
  app.delete(`${root}/notes`, notesHandler); // DELETE toutes les notes de l'utilisateur connecté
  app.delete(`${root}/notes/:id`, notesHandler); // DELETE une note de l'utilisateur connecté
};
