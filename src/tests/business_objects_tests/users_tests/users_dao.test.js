import buildDatabase from '../../../app/core/db/index';
import buildUserDao from '../../../app/business_objects/users/users_dao';
import InvalidQueryError from '../../../app/core/errors/invalid_query_error';
import mongo from 'mongodb';
import UniqueViolationError from '../../../app/core/errors/unique_violation_error';

/**
 * Tests de users_dao.
 */

let db;
let dao;
let email = 'emailtest@mail.foo';
let password = 'passwordtest';
let trace = 'trace';
let user = { email: email, password: password, trace: trace };
let wrongId = mongo.ObjectID('5f46bd5c34fbfa343c133bed');
let invalidId = 'invalid';
let modifiedPassword = 'modifiedPassword';
let created;
let read;

beforeAll(async (done) => {
	db = await buildDatabase();
	dao = buildUserDao(db);
	created = await dao.create(user);
	read = await db.collection('users').findOne({ email: 'email3@mail.foo' });
	done();
});

describe('usersDao - create', () => {
	it('insère un utilisateur en base de données', async (done) => {
		const testUser = await db.collection('users').findOne({ email: email });
		expect(testUser).not.toBe(undefined);
		done();
	});
	it("retourne les informations de l'utilisateur créé", () => {
		expect(created.email).toStrictEqual(email);
		expect(created.password).toStrictEqual(password);
		expect(created.trace).toStrictEqual(trace);
		expect(created._id).not.toBe(undefined);
	});
	it("renvoie une erreur UniqueViolationError si l'adresse email est déjà associée à un utilisateur enregistré", () => {
		const test = async () => await dao.create(user);
		expect(test).rejects.toThrow(UniqueViolationError);
	});
});

describe('usersDao - read', () => {
	it('récupère un utilisateur en base de données à partir de son id', async (done) => {
		const id = read._id;
		const testUser = await dao.read(id);
		expect(testUser._id).toStrictEqual(read._id);
		expect(testUser.email).toStrictEqual(read.email);
		expect(testUser.password).toStrictEqual(read.password);
		expect(testUser.trace).toStrictEqual(read.trace);
		done();
	});
	it("renvoie null si aucun utilisateur ne correspond à l'id renseigné", async (done) => {
		const testUser = await dao.read(wrongId);
		expect(testUser).toStrictEqual(null);
		done();
	});
	it("renvoie une erreur InvalidQueryError si l'id est invalide", () => {
		const test = async () => await dao.read(invalidId);
		expect(test).rejects.toThrow(InvalidQueryError);
	});
});

describe('usersDao - update', () => {
	it('modifie un utilisateur à partir de son id, en modifiant uniquement les attributs renseignés', async (done) => {
		await dao.update(read._id, { password: modifiedPassword });
		const testUser = await db.collection('users').findOne({ _id: read._id });
		expect(testUser.password).toStrictEqual(modifiedPassword);
		expect(testUser.email).toStrictEqual(read.email);
		expect(testUser.trace).toStrictEqual(read.trace);
		expect(testUser._id).toStrictEqual(read._id);
		done();
	});
	it("renvoie une erreur si aucun utilisateur ne correspond à l'id renseigné", () => {
		const test = async () => await dao.update(wrongId, {});
		expect(test).rejects.toThrow();
	});
	it("renvoie une erreur InvalidQueryError si l'id est invalide", () => {
		const test = async () => await dao.update(invalidId, {});
		expect(test).rejects.toThrow(InvalidQueryError);
	});
	it("revoie une erreur UniqueViolationError si l'email saisi est déjà utilisé", () => {
		const test = async () => await dao.update(read._id, { email: 'email1@mail.foo' });
		expect(test).rejects.toThrow(UniqueViolationError);
	});
});

describe('usersDao - remove', () => {
	it('supprime un utilisateur à partir de son id', async (done) => {
		await db.collection('notes').insertOne({ userId: read._id });
		await dao.remove(read._id);
		const testUser = await dao.read(read._id);
		expect(testUser).toStrictEqual(null);
		done();
	});
	it("renvoie une erreur si aucun utilisateur ne correspond à l'id renseigné", () => {
		const test = async () => await dao.remove(wrongId, {});
		expect(test).rejects.toThrow();
	});
	it("renvoie une erreur InvalidQueryError si l'id est invalide", () => {
		const test = async () => await dao.remove(invalidId);
		expect(test).rejects.toThrow(InvalidQueryError);
	});
	it("supprime les notes associées à l'utilisateur", async (done) => {
		const testNotes = await db.collection('notes').find({ userId: read._id }).toArray();
		expect(testNotes.length).toStrictEqual(0);
		done();
	});
});
