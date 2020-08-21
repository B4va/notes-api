import buildDatabase from '../../../app/core/db/index';
import buildAuthManager from '../../../app/core/auth/auth_manager';
import jwt from 'jsonwebtoken';

/**
 * Tests de auth_manager.
 */

let db;
let authManager;
let user;
let validPassword = 'pass_word';
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
	it('ajoute un token révoqué en base de données', async (done) => {
		await authManager.revokeToken('token');
		const testRevokedToken = await db.collection('token').findOne({ token: 'token' });
		expect(testRevokedToken).not.toBe(undefined);
		done();
	});
});

describe('authManager - authenticateUser', () => {
	it('renvoie un token de connexion si les identifiants saisis sont valides', async (done) => {
		const email = user.email;
		const testValidAuth = await authManager.authenticateUser(email, validPassword);
		expect(testValidAuth).toHaveProperty('user', user);
		expect(testValidAuth).toHaveProperty('token');
		expect(testValidAuth.token).not.toBe(undefined);
		done();
	});
	it('renvoie une erreur si les indentifiants saisis sont invalides', async (done) => {
		const email = user.email;
		const password = 'invalid';
		const testInvalidAuth = async () => authManager.authenticateUser(email, password);
		await expect(testInvalidAuth).rejects.toThrow();
		done();
	});
});

describe('authManager - revokeAll', () => {
	it("génère une nouvelle trace pour l'utilisateur", async (done) => {
		const previousTrace = user.trace;
		await authManager.revokeAll(user.id);
		const newTrace = await db.collection('users').findOne({ email: user.email }).trace;
		expect(newTrace).not.toBe(previousTrace);
		done();
	});
});

describe('authManager - generateTrace', () => {
	it('genere un identifiant de plus de 20 caractères', () => {
		const traceTest = authManager.generateTrace();
		expect(traceTest.length).toBeGreaterThan(20);
	});
	it('genere un identifiant unique à chaque exécution', () => {
		const traceTest1 = authManager.generateTrace();
		const traceTest2 = authManager.generateTrace();
		expect(traceTest1).not.toBe(traceTest2);
	});
});
