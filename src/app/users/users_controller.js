import * as httpErrors from '../../helpers/http_errors';
import * as httpResponses from '../../helpers/http_responses';
import * as auth from '../auth';
import buildUser from './user_model';

export default (usersDao) => {
  /**
   * Méthodes.
   */
  return async (httpRequest) => {
    switch (httpRequest.method) {
      case 'POST':
        return postUser(httpRequest);
      case 'GET':
        return getUser(httpRequest);
      case 'PUT':
        return putUser(httpRequest);
      case 'DELETE':
        return deleteUser(httpRequest);
      default:
        return httpErrors.serverError();
    }
  };

  /**
   * Renvoie les informations de l'utilisateur connecté.
   * Validations : Connexion.
   * @param {Object} httpRequest - requête http
   */
  async function getUser(httpRequest) {
    auth.authenticate(httpRequest);
    const result = await usersDao.read(httpRequest.userId);
    return httpResponses.ok(result);
  }

  /**
   * Ajoute un utilisateur et renvoie les informations enregistrées.
   * Validations : Données.
   * @param {Object} httpRequest - requête http
   */
  async function postUser(httpRequest) {
    const userInfo = httpRequest.body;
    let user;
    try {
      user = buildUser(userInfo);
    } catch (e) {
      return httpErrors.invalidDataError(e);
    }
    try {
      const result = await usersDao.create(user);
      return httpResponses.created(result.ops);
    } catch (e) {
      return httpErrors.serverError();
    }
  }

  /**
   * Modifie les données de l'utilisateur connecté.
   * Validations : Connexion, données.
   * @param {Object} httpRequest - requête http
   */
  async function putUser(httpRequest) {
    auth.authenticate(httpRequest);
    const userInfo = httpRequest.body;
    let user;
    try {
      user = buildUser(userInfo);
    } catch (e) {
      return httpErrors.invalidDataError(e);
    }
    try {
      const result = usersDao.update(httpRequest.userId, user);
      return httpResponses.noContent(result);
    } catch (e) {
      return httpErrors.serverError();
    }
  }

  /**
   * Supprime l'utilisateur connecté.
   * Validations : Connexion.
   * @param {Object} httpRequest - requête http
   */
  async function deleteUser(httpRequest) {
    auth.authenticate(httpRequest);
    const result = usersDao.remove(httpRequest.userId);
    return httpResponses.noContent(result);
  }
};
