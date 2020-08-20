import buildDatabase from '../../../app/core/db/index';
import buildAuthManager from '../../../app/core/auth/auth_manager';
import jwt from 'jsonwebtoken';

/**
 * Tests de auth_manager.
 */

let db;
let authManager;
let user;
let token;
let invalidToken;
let wrongFormatToken = 'wrongformat';

beforeAll(async (done) => {
	db = await buildDatabase();
	authManager = await buildAuthManager(db);
	user = await db.collection('users').findOne({ email: 'email2@mail.foo' });
	const trace = user.trace;
	token = await jwt.sign({ trace }, process.env.TOKEN_SECRET);
	const invalidTrace = 'invalid';
	invalidToken = await jwt.sign({ invalidTrace }, process.env.TOKEN_SECRET);
	done();
});

describe('authManager - verifyUser', () => {
	it("renvoie l'id de l'utilisateur si le token d'authentification est valide", async (done) => {
		const testValidToken = await authManager.verifyUser(token);
		expect(testValidToken).toStrictEqual(user._id);
		done();
	});
	it('renvoie une erreur si le token est invalide', async (done) => {
		const testInvalidToken = async () => await authManager.verifyUser(invalidToken);
		await expect(testInvalidToken).rejects.toThrow();
		done();
	});
	it('renvoie une erreur si le token est au mauvais format', async (done) => {
		const testInvalidToken = async () => await authManager.verifyUser(wrongFormatToken);
		await expect(testInvalidToken).rejects.toThrow();
		done();
	});
});

describe('authManager - revokeToken', () => {
	// TODO : revokeToken
});

describe('authManager - authenticateUser', () => {
	// TODO : authenticateUser
});

describe('authManager - revokeAll', () => {
	// TODO : revokeAll
});

describe('authManager - generateTrace', () => {
	// TODO : generateTrace
});
