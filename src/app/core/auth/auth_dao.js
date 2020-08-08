import mongo from 'mongodb';
import { v4 as uuid } from 'uuid';

/**
 * Constructeur de la DAO propre à l'authentification des utilisateurs.
 * @param {Object} database base de données
 * @returns {Object} méthodes DAO authentification
 */
export default (database) => {
	return Object.freeze({
		isRevokedToken,
		findUser,
		findTrace,
		addRevokedToken,
		changeTrace,
	});

	/**
   * Détermine si un token appartient à la liste des token révoqués.
   * @param {String} token token de connexion 
   * @returns {boolean} true si le token est révoqué
   */
	async function isRevokedToken(token) {
		const db = await database;
		const check = await db.collection('token').findOne({ token: token });
		return !!check;
	}

	/**
   * Recherche un utilisateur correspondant aux identifiants de connexion.
   * @param {String} email email utilisateur
   * @returns {Object} utilisateur ou null si identifiants inconnus
   */
	async function findUser(email) {
		const db = await database;
		return await db.collection('users').findOne({ email: email });
	}

	/**
   * Recherche un utilisateur sur la base de sa trace.
   * @param {String} trace trace déchiffrée à partir du token
   * @returns {Object} utilisateur ou null si la trace ne correspond pas
   */
	async function findTrace(trace) {
		const db = await database;
		return await db.collection('users').findOne({ trace: trace });
	}

	/**
   * Ajoute un token à la liste des token révoqués.
   * @param {String} token token de connexion
   */
	async function addRevokedToken(token) {
		const db = await database;
		await db.collection('token').insertOne({ token: token });
	}

	/**
   * Modifie la trace d'un utilisateur, à partir de laquelle
   * sont chiffrés ses token de connexion.
   * @param {String} userId id utilisateur
   */
	async function changeTrace(userId) {
    const db = await database;
		const id = mongo.ObjectID(userId);
		await db.collection('users').updateOne({ _id: id }, { $set: { trace: uuid() } });
	}
};
