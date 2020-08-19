import buildDatabase from '../../../app/core/db/index';
import buildAuthDao from '../../../app/core/auth/auth_dao';
import adaptId from '../../../app/core/adapters/id_adapter';

/**
 * Tests de authDao.
 */

let db;
let authDao;
let user;
let revokedToken = 'revokedtoken';
let validToken = 'validtoken';
let validUserEmail = 'email1@mail.foo';
let invalidUserEmail = 'invalid@mail.foo';
let validTrace = '0123456789';
let invalidTrace = 'invalidtrace';
let tokenToRevoke = 'token';

beforeAll(async (done) => {
	db = await buildDatabase();
	authDao = await buildAuthDao(db);
	user = await db.collection('users').findOne({ email: 'email1@mail.foo' });
	done();
});

describe('authDao - isRevokedToken', () => {
	test('renvoie vrai si le token appartient à la liste des token révoqués', async (done) => {
		const testRevokedToken = await authDao.isRevokedToken(revokedToken);
		expect(testRevokedToken).toBeTruthy();
		done();
	});
	test("renvoie faux si le token n'appartient pas à la liste des token révoqués", async (done) => {
		const testValidToken = await authDao.isRevokedToken(validToken);
		expect(testValidToken).toBeFalsy();
		done();
	});
});

describe('authDao - findUser', () => {
	test('renvoie un utilisateur si email valide', async (done) => {
		const validUser = await authDao.findUser(validUserEmail);
		expect(validUser.email).toStrictEqual(validUserEmail);
		done();
	});
	test('renvoie null si email invalide', async (done) => {
		const invalidUser = await authDao.findUser(invalidUserEmail);
		expect(invalidUser).toBe(null);
		done();
	});
});

describe('authDao - findTrace', () => {
	test('renvoie un utilisateur si trace valide', async (done) => {
		const validUser = await authDao.findTrace(validTrace);
		expect(validUser.email).toStrictEqual(validUserEmail);
		done();
	});
	test('renvoie null si trace invalide', async (done) => {
		const invalidUser = await authDao.findTrace(invalidTrace);
		expect(invalidUser).toBe(null);
		done();
	});
});

describe('authDao - addRevokedToken', () => {
	test('ajoute un token révoqué en base de données', async (done) => {
		await authDao.addRevokedToken(tokenToRevoke);
		const testRevokedToken = await db.collection('token').findOne({ token: tokenToRevoke });
		expect(testRevokedToken).not.toBe(null);
		done();
	});
});

describe('authDao - changeTrace', () => {
	test("modifie la trace d'un utilisateur", async (done) => {
		await authDao.changeTrace(user._id);
		const updatedUser = await db.collection('users').findOne({ email: 'email1@mail.foo' });
		expect(updatedUser.trace).not.toBe(validTrace);
		done();
	});
});
