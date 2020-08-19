import DataValidationError from '../../core/errors/data_validation_error';
import usersDao from './users_dao';

/**
 * Modélisation et validation d'un utilisateur.
 * @param {Object} userInfo données
 * @returns {Object} utilisateur validé et normalisé
 * 
 * Un utilisateur comprends un email unique devant répondre d'un format adapté
 * un mot de passe devant comporter 6 caractères au minimum et d'une trace générée
 * à la création du modèle. C'est cette trace qui servira à l'identifier via un token
 * de connexion. Les token de connexion peuvent être révoqués en étant ajoutée à une 
 * liste de tokens invalidés. Dans le cas d'une révocation générale des token, c'est la
 * trace associée à l'utilisateur qui sera mise à jour, révoquant de fait les tokens
 * précédemment générés. Un utilisateur peut être associé à un nombre indéfini de notes (*..1).
 */
export default (userInfo) => {
	/**
	 * Liste d'erreurs.
	 */
	let ERRORS = [];

	return {
		buildNew: buildNew(),
		buildUpdate: buildUpdate(),
	};

	/**
	 * Valide et normalise un nouvel utilisateur.
	 * @returns {Object} utilisateur
	 */
	function buildNew() {
		_validateNew(userInfo);
		return _normalizeNew(userInfo);
	}

	/**
   * Valide les attributs d'un utilisateur.
   * @param {Object} param0 utilisateur à valider (dstrc)
   * @throws {DataValidationError} si les données saisies sont invalides
   */
	async function _validateNew({ email, password, trace } = {}) {
		const validEmail = await _validateEmail(email);
		const validPassword = _validatePassword(password);
		if (!validEmail || !validPassword) throw new DataValidationError(ERRORS);
	}

	/**
   * Normalise les attributs de l'utilisateur.
   * @param {Object} param0 utilisateur à normaliser (destrc)
   * @returns {Object} utilisateur normalisé
   */
	function _normalizeNew({ email, password, trace }) {
		return {
			email: email,
			password: password,
			trace: trace,
		};
	}

	/**
	 * Valide et normalise la mise à jour d'un utilisateur.
	 * @returns {Object} mise à jour de l'utilisateur
	 */
	function buildUpdate() {
		_validateUpdate(userInfo);
		return _normalizeUpdate(userInfo);
	}

	/**
   * Valide les nouveaux attributs de l'utilisateur.
   * @param {Object} userInfo nouveaux attributs
   * @throws {DataValidationError} si les données saisie sont invalides
   */
	async function _validateUpdate(userInfo) {
		const validEmail = userInfo.email ? _validateEmail(userInfo.email) : true;
		const validPassword = userInfo.password ? _validatePassword(userInfo.password) : true;
		if (!validEmail || !validPassword) throw new DataValidationError(ERRORS);
	}

	function _normalizeUpdate(userInfo) {
		let result = {};
		if (userInfo.email) {
			result.email = userInfo.email;
		}
		if (userInfo.password) {
			result.password = userInfo.password;
		}
		if (userInfo.trace) {
			result.trace = userInfo.trace;
		}
		return result;
	}

	/**
   * Valide l'email de l'utilisateur.
   * @param {String} email email saisi
   * @param {Array} errors liste d'erreurs
   * @returns {boolean} true si l'email est valide
   */
	function _validateEmail(email) {
		// Présence
		if (!email) {
			ERRORS.push('Une adresse email doit être renseignée.');
			return false;
		}
		// Format
		if (!_isValidEmailFormat(email)) {
			ERRORS.push("L'adresse email renseignée est invalide.");
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
};
