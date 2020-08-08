import buildUsersHandler from './app/users';
import buildNotesHandler from './app/notes';

const root = '/api/v0';

/**
 * Constructeur des routes de l'application.
 * @param {Object} app application express
 * @param {Object} database base de données
 * @param {Object} authManager gestionnaire d'authentification
 */
export default (app, database, authManager) => {
	const usersHandler = buildUsersHandler(database, authManager);
	const notesHandler = buildNotesHandler(database, authManager);

	/**
   * USERS
   */
	app.get(`${root}/users`, usersHandler); // GET utilisateur connecté
	app.post(`${root}/users`, usersHandler); // POST nouvel utilisateur
	app.put(`${root}/users`, usersHandler); // PUT maj utilisateur connecté
	app.delete(`${root}/users`, usersHandler); // DELETE utilisateur connecté
	app.patch(`${root}/users`, usersHandler); // PATCH connexion utilisateur

	/**
   * NOTES
   */
	app.get(`${root}/notes`, notesHandler); // TODO : GET toutes les notes de l'utilisateur connecté
	app.get(`${root}/notes/:id`, notesHandler); // TODO : GET une note de l'utilisateur connecté
	app.post(`${root}/notes`, notesHandler); // TODO : POST nouvelle note pour l'utilisateur connecté
	app.put(`${root}/notes/:id`, notesHandler); // TODO : PUT maj d'une note de l'utilisateur connecté
	app.delete(`${root}/notes`, notesHandler); // TODO : DELETE toutes les notes de l'utilisateur connecté
	app.delete(`${root}/notes/:id`, notesHandler); // TODO : DELETE une note de l'utilisateur connecté
};
