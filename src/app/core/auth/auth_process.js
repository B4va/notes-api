// ! à tester

import jwt from 'jsonwebtoken';
import 'dotenv/config';
import buildTokenDao from './auth_dao';
import { isValid } from '..//auth/encrypter';
import { v4 as uuid } from 'uuid';

export default buildAuthManager;

/**
 * Constructeur du gestionnaire d'authentification.
 * @param {Object} database base de données
 * @returns {Object} méthodes d'authentification
 */
async function buildAuthManager(database) {
	const authDao = buildTokenDao(database);
	return Object.freeze({
		verifyUser,
		revokeToken,
		authenticateUser,
		revokeAll,
		generateTrace,
	});

	/**
   * Authentifie un utilisateur.
   * @param {String} email email utilisateur
   * @param {String} password mot de passe utilisateur
   * @returns {String} token de connexion
   * @throws {Error} si le mot de passe et/ou l'email est invalide
   */
	async function authenticateUser(email, password) {
		const user = await authDao.findUser(email);
		if (user && (await isValid(password, user.password))) {
			return {
				user: user,
				token: await _generateToken(user.trace),
			};
		} else {
			throw new Error();
		}
	}

	async function _generateToken(trace) {
		const token = await jwt.sign({ trace }, process.env.TOKEN_SECRET);
		return { status: 'Token généré.', token: token };
	}

	/**
   * Vérifie la connexion d'un utilisateur.
   * @param {String} token token de connexion
   * @returns {String} id utilisateur
   * @throws {Error} si le token utilisateur a été révoqué et/ou
   *                 si le token ne correspond à aucun utilisateur
   */
	async function verifyUser(token) {
		if (await authDao.isRevokedToken(token)) {
			throw new Error();
		}
    const trace = await jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await authDao.findTrace(trace.trace);
		if (user) {
			return user._id;
		} else {
			throw new Error();
		}
	}

	/**
   * Révoque le token de connexion d'un utilisateur.
   * @param {String} token token de connexion 
   * @returns {Object} statut
   */
	async function revokeToken(token) {
		await authDao.addRevokedToken(token);
		return { status: 'Token révoqué.' };
	}

	/**
   * Invalide tous les token de connexion d'un utilisateur.
   * Modifie la référence enregistrée pour l'utilisateur et
   * sur laquelle se base le chiffrement du token.
   * @param {String} id id utilisateur
   * @returns {Object} statut
   */
	async function revokeAll(id) {
		const newTrace = uuid();
		await authDao.changeTrace(id);
		return { status: 'Emprunte globale modifiée.' };
	}

	/**
   * Génère un identifiant unique servant à tracer l'utilisateur.
   * @returns {String} trace utilisateur
   */
	function generateTrace() {
		return uuid();
	}
}
