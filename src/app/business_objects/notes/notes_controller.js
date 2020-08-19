import * as httpErrors from '../../core/http/http_errors';
import * as httpResponses from '../../core/http/http_responses';
import Note from './note_model';
import adaptAuth from '../../core/adapters/auth_adapter';
import InvalidQueryError from '../../core/errors/invalid_query_error';

/**
 * Constructeur du controleur des notes.
 * @param {Object} notesDao DAO propre aux notes
 * @param {Object} authManager gestionnaire d'authentification
 * @returns {Function} controleur
 */
export default (notesDao, authManager) => {
	/**
   * Accès http.
   */
	return async (httpRequest) => {
		switch (httpRequest.method) {
			case 'POST':
				return postNote(httpRequest);
			case 'GET':
				if (httpRequest.pathParams.id) {
					return getNote(httpRequest);
				} else {
					return getNotes(httpRequest);
				}
			case 'PUT':
				return putNote(httpRequest);
			case 'DELETE':
				if (httpRequest.pathParams.id) {
					return deleteNote(httpRequest);
				} else {
					return deleteNotes(httpRequest);
				}
			default:
				return httpErrors.serverError();
		}
	};

	/**
   * Renvoie les informations d'une note appartenant
   * à l'utilisateur connecté.
   * Validations : Connexion, appartenance.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
	async function getNote(httpRequest) {
		const token = adaptAuth(httpRequest);
		try {
			const userId = await authManager.verifyUser(token);
			const result = await notesDao.read(httpRequest.pathParams.id);
			if (!result) {
				return httpErrors.noDataFoundError();
			} else if (result.userId.toString() !== userId.toString()) {
				return httpErrors.authValidationError();
			} else {
				return httpResponses.ok(result);
			}
		} catch (e) {
			if (e instanceof InvalidQueryError) {
				return httpErrors.invalidRequestError();
			} else {
				return httpErrors.authValidationError();
			}
		}
	}

	/**
   * Renvoie les informations de toutes les notes appartenant
   * à l'utilisateur connecté.
   * Validations : Connexion, appartenance.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
	async function getNotes(httpRequest) {
		const token = adaptAuth(httpRequest);
		try {
			const userId = await authManager.verifyUser(token);
			const result = await notesDao.readAll(userId);
			return httpResponses.ok(result);
		} catch (e) {
			return httpErrors.authValidationError();
		}
	}

	/**
   * Ajoute une note associée à l'utilisateur connecté et 
   * renvoie les informations enregistrées.
   * Validations : Connexion, appartenance, données, format des données, validité
   * des données.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
	async function postNote(httpRequest) {
		const token = adaptAuth(httpRequest);
		const noteInfo = httpRequest.body;
		let userId;
		try {
			userId = await authManager.verifyUser(token);
		} catch (e) {
			return httpErrors.authValidationError();
		}
		let note;
		try {
			note = Note(noteInfo).buildNew;
			note.userId = userId;
		} catch (e) {
			return httpErrors.invalidDataError(e);
		}
		try {
			const result = await notesDao.create(note);
			return httpResponses.created(result.ops);
		} catch (e) {
			return httpErrors.serverError();
		}
	}

	/**
   * Modifie les données d'une note appartenant
   * à l'utilisateur connecté.
   * Validations : Connexion, appartenance, données, format des données, validité
   * des données.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
	async function putNote(httpRequest) {
		const token = adaptAuth(httpRequest);
		const noteInfo = httpRequest.body;
		try {
			await authManager.verifyUser(token);
		} catch (e) {
			return httpErrors.authValidationError();
		}
		let note;
		try {
			note = Note(noteInfo).buildUpdate;
		} catch (e) {
			return httpErrors.invalidDataError(e);
		}
		try {
			const result = await notesDao.update(httpRequest.pathParams.id, note);
			return httpResponses.noContent('Note modifiée.');
		} catch (e) {
			return httpErrors.serverError();
		}
	}

	/**
   * Supprime une note appartenant à l'utilisateur connecté.
   * Validations : Connexion, appartenance.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
	async function deleteNote(httpRequest) {
		const token = adaptAuth(httpRequest);
		let userId;
		try {
			userId = await authManager.verifyUser(token);
		} catch (e) {
			return httpErrors.authValidationError();
		}
		const note = await notesDao.read(httpRequest.pathParams.id);
		if (note.userId.toString() !== userId.toString()) {
			return httpErrors.authValidationError();
		} else if (!note) {
			return httpErrors.noDataFoundError();
		} else {
			await notesDao.remove(httpRequest.pathParams.id);
			return httpResponses.noContent('Note supprimée');
		}
	}

	/**
   * Supprime toutes les notes appartenant à l'utilisateur connecté.
   * Validations : Connexion, appartenance.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
	async function deleteNotes(httpRequest) {
		const token = adaptAuth(httpRequest);
		try {
			const user = await authManager.verifyUser(token);
			const result = notesDao.removeAll(user._id);
			return httpResponses.noContent('Notes supprimées');
		} catch (e) {
			return httpErrors.authValidationError();
		}
	}
};
