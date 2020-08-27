import adaptId from '../../core/adapters/id_adapter';
import UniqueViolationError from '../../core/errors/unique_violation_error';

/**
 * Constructeur de la DAO propre aux utilisateurs.
 * @param {Object} database base de données
 * @returns {Object} méthodes DAO utilisateurs
 */
export default (database) => {
	return Object.freeze({
		create,
		read,
		update,
		remove,
	});

	/**
   * Crée un utilisateur.
   * @param {Object} user informations utilisateur
   * @returns {Object} utilisateur
   * @throws {UniqueViolationError} si l'email saisi est déjà utilisé
   */
	async function create(user) {
		const db = await database;
		const isUnique = await _isEmailUnique(user.email, db);
		if (!isUnique) throw new UniqueViolationError("L'adresse mail est déjà utilisée.");
		const created = await db.collection('users').insertOne(user);
		return created.ops[0];
	}

	async function _isEmailUnique(email, db) {
		const check = await db.collection('users').findOne({ email: email });
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
		const id = adaptId(userId);
		const user = await db.collection('users').findOne({ _id: userId });
		if (!user) throw new Error();
		const isUnique = await _isEmailUnique(userInfo.email, db);
		if (!isUnique) throw new UniqueViolationError("L'adresse mail est déjà utilisée.");
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
		const user = await db.collection('users').findOne({ _id: userId });
		if (!user) throw new Error();
		await db.collection('notes').deleteMany({ userId: userId });
		return await db.collection('users').deleteOne({ _id: id });
	}
};
