import * as httpErrors from '../core/helpers/http_errors';
import * as httpResponses from '../core/helpers/http_responses';
import buildNote from './note_model';

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
    const result = await notesDao.read(httpRequest.pathParams.id);
    if (!result) {
      return httpErrors.noDataFoundError();
    }
    return httpResponses.ok(result);
  }

  /**
   * Renvoie les informations de toutes les notes appartenant
   * à l'utilisateur connecté.
   * Validations : Connexion, appartenance.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function getNotes(httpRequest) {
    const result = await notesDao.readAll();
    return httpResponses.ok(result);
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
    const noteInfo = httpRequest.body;
    let note;
    try {
      note = buildNote(noteInfo);
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
    const noteInfo = httpRequest.body;
    let note;
    try {
      note = buildNote(noteInfo);
    } catch (e) {
      return httpErrors.invalidDataError(e);
    }
    try {
      const result = notesDao.update(httpRequest.pathParams.id, note);
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
    const note = await notesDao.read(httpRequest.pathParams.id);
    if (!note) {
      return httpErrors.noDataFoundError();
    }
    const result = notesDao.remove(httpRequest.pathParams.id);
    return httpResponses.noContent('Note supprimée');
  }

  /**
   * Supprime toutes les notes appartenant à l'utilisateur connecté.
   * Validations : Connexion, appartenance.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function deleteNotes(httpRequest) {
    const result = notesDao.removeAll();
    return httpResponses.noContent('Notes supprimées');
  }
};
