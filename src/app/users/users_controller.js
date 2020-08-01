import * as httpErrors from '../core/helpers/http_errors';
import * as httpResponses from '../core/helpers/http_responses';
import * as auth from '../core/auth';
import buildUser from './user_model';
import adaptAuth from '../core/helpers/auth_adapter';

// TODO : reprendre avec système d'authentification
// ! à tester

export default (usersDao, authManager) => {
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
      case 'PATCH':
        if (httpRequest.queryParams.auth === 'revoke') {
          return revokeUser(httpRequest);
        } else if (httpRequest.queryParams.auth === 'login') {
          return loginUser(httpRequest);
        } else {
          return httpErrors.serverError();
        }
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
    const token = adaptAuth(httpRequest);
    try {
      const userId = await authManager.verifyToken(token);
    } catch (e) {
      return httpErrors.authValidationError();
    }
    const result = await usersDao.read(userId);
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
    const token = adaptAuth(httpRequest);
    try {
      const userId = await authManager.verifyToken(token);
    } catch (e) {
      return httpErrors.authValidationError();
    }
    const userInfo = httpRequest.body;
    let user;
    try {
      user = buildUser(userInfo);
    } catch (e) {
      return httpErrors.invalidDataError(e);
    }
    try {
      const result = usersDao.update(userId, user);
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
    const token = adaptAuth(httpRequest);
    try {
      const userId = await authManager.verifyToken(token);
    } catch (e) {
      return httpErrors.authValidationError();
    }
    auth.authenticate(httpRequest);
    const result = usersDao.remove(userId);
    return httpResponses.noContent(result);
  }

  /**
   * Connecte un utilisateur.
   * Validations : Authentification.
   * @param {Object} httpRequest - requête http
   */
  async function loginUser(httpRequest) {
    try {
      const userId = authManager.authenticateUser(
        httpRequest.body.email,
        httpRequest.body.password,
      );
    } catch (e) {
      return httpErrors.authValidationError();
    }
    const result = authManager.generateToken(userId);
    return httpResponses.ok(result);
  }

  /**
   * Déconnecte un utilisateur.
   * Validation : Connexion.
   * @param {Object} httpRequest - requête http
   */
  async function revokeUser(httpRequest) {
    const token = adaptAuth(httpRequest);
    try {
      await authManager.verifyToken(token);
      const result = await authManager.revokeToken(token);
      return httpResponses.ok(result);
    } catch (e) {
      return httpErrors.authValidationError();
    }
  }
};
