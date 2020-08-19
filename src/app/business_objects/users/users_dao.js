import adaptId from '../core/helpers/adapters/id_adapter';
import UniqueViolationError from '../core/helpers/errors/unique_violation_error';

/**
 * Constructeur de la DAO propre aux utilisateurs.
 * @param {Object} database base de données
 * @returns {Object} méthodes DAO utilisateurs
 */
export default async (database) => {
	return Object.freeze({
		create,
		read,
		update,
		remove,
	});

	let db = await database;

	/**
   * Crée un utilisateur.
   * @param {Object} user informations utilisateur
   * @returns {Object} utilisateur
   * @throws {UniqueViolationError} si l'email saisi est déjà utilisé
   */
	async function create(user) {
		const db = await database;
		if (!_isEmailUnique(user.email, db)) throw new UniqueViolationError("L'adresse mail est déjà utilisée.");
		return await db.collection('users').insertOne(user);
	}

	async function _isEmailUnique(email, db) {
		const check = await db.collection('users').findOne({ email: email });
		console.log(check);
		return !check;
	}

	/**
   * Accède à un utilisateur.
   * @param {String} userId id utilisateur
   * @returns {Object} utilisateur
   */
	async function read(userId) {
		const db = await database;
		const id = adaptId(userId);
		return await db.collection('users').findOne({ _id: id });
	}

	/**
   * Met à jour un utilisateur.
   * @param {String} userId id utilisateur
   * @param {Object} userInfo informations utilisateur
   * @returns {Object} utilisateur
   */
	async function update(userId, userInfo) {
		const db = await database;
		if (!_isEmailUnique(userInfo.email, db)) throw new UniqueViolationError("L'adresse mail est déjà utilisée.");
		const id = adaptId(userId);
		return await db.collection('users').updateOne({ _id: id }, { $set: userInfo });
	}

	/**
   * Supprime un utilisateur.
   * @param {String} userId id utilisateur
   * @returns {Object} utilisateur
   */
	async function remove(userId) {
		const db = await database;
		const id = adaptId(userId);
		return await db.collection('users').deleteOne({ _id: id });
	}
};
