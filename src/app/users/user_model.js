import DataValidationError from '../core/helpers/errors/data_validation_error';
import usersDao from './users_dao';

/**
 * Modélisation et validation d'un utilisateur.
 * @param {Object} userInfo données
 * @returns {Object} utilisateur validé et normalisé
 */
export default async (userInfo) => {
  const user = await _validate(userInfo);
  return _normalize(userInfo);

  /**
   * Valide les attributs d'un utilisateur.
   * @param {Object} param0 utilisateur à valider (dstrc)
   * @returns {Object} utilisateur validé
   * @throws {DataValidationError} si les données saisies sont invalides
   */
  async function _validate({ email, password, trace } = {}) {
    const errors = [];
    const validEmail = await _validateEmail(email, errors);
    const validPassword = _validatePassword(password, errors);
    if (!validEmail || !validPassword) throw new DataValidationError(errors);
    return { email, password, trace };
  }

  /**
   * Valide l'email de l'utilisateur.
   * @param {String} email email saisi
   * @param {Array} errors liste d'erreurs
   * @returns {boolean} true si l'email est valide
   */
  async function _validateEmail(email, errors) {
    // Présence
    if (!email) {
      errors.push('Une adresse email doit être renseignée.');
      return false;
    }
    // Format
    if (!_isValidEmailFormat(email)) {
      errors.push("L'adresse email renseignée est invalide.");
      return false;
    }
    return true;
  }

  /**
   * Valide le format de l'email.
   * @param {String} email email à valider
   * @returns {boolean} true si le format de l'email est valide
   */
  function _isValidEmailFormat(email) {
    const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    return valid.test(email);
  }

  /**
   * Valide le mot de passe de l'utilisateur.
   * @param {String} password mot de passe saisi
   * @param {Array} errors liste d'erreurs
   * @returns {boolean} true si le mot de passe est valide
   */
  function _validatePassword(password, errors) {
    // Présence
    if (!password) {
      errors.push('Un mot de passe doit être renseigné.');
      return false;
    }
    // Longueur
    if (password.length < 6) {
      errors.push("Le mot de passe doit être long d'au moins 6 caractères.");
      return false;
    }
    return true;
  }

  /**
   * Normalise les attributs de l'utilisateur.
   * @param {Object} param0 utilisateur à normaliser (destrc)
   * @returns {Object} utilisateur normalisé
   */
  function _normalize({ email, password, trace }) {
    return {
      email: email,
      password: password,
      trace: trace,
    };
  }
};
