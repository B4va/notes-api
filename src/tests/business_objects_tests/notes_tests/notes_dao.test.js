import buildDatabase from '../../../app/core/db/index';
import buildNoteDao from '../../../app/business_objects/notes/notes_dao';
import InvalidQueryError from '../../../app/core/errors/invalid_query_error';
import mongo from 'mongodb';

/**
 * Tests de notes_dao.
 */

let db;
let dao;
let title = 'test note';
let content = 'content';
let color = 'gray';
let userId = 'identification';
let note = { title: title, content: content, color: color, userId: userId };
let invalidId = 'invalid';
let wrongId = mongo.ObjectID('5f46bd5c34fbfa343c133bed');
let modifiedTitle = 'modified title';
let created;
let read;

beforeAll(async (done) => {
	db = await buildDatabase();
	dao = buildNoteDao(db);
	created = await dao.create(note);
	read = await db.collection('notes').findOne({ title: 'first note' });
	done();
});

describe('notesDao - create', () => {
	it('insère une note en base de données', async (done) => {
		const testNote = await db.collection('notes').findOne({ title: title });
		expect(testNote).not.toBe(undefined);
		done();
	});
	it('retourne les informations de la note créée', () => {
		expect(created.title).toStrictEqual(title);
		expect(created.content).toStrictEqual(content);
		expect(created.color).toStrictEqual(color);
		expect(created.userId).toStrictEqual(userId);
		expect(created._id).not.toBe(undefined);
	});
});

describe('notesDao - read', () => {
	it('récupère une note en base de données à partir de son id', async (done) => {
		const id = read._id;
		const testNote = await dao.read(id);
		expect(testNote._id).toStrictEqual(read._id);
		expect(testNote.title).toStrictEqual(read.title);
		expect(testNote.content).toStrictEqual(read.content);
		expect(testNote.color).toStrictEqual(read.color);
		expect(testNote.userId).toStrictEqual(read.userId);
		done();
	});
	it("renvoie null si aucune note ne correspond à l'id renseigné", async (done) => {
		const testNote = await dao.read(wrongId);
		expect(testNote).toStrictEqual(null);
		done();
	});
	it("renvoie une erreur InvalidQueryError si l'id est invalide", () => {
		const testNote = async () => await dao.read(invalidId);
		expect(testNote).rejects.toThrow(InvalidQueryError);
	});
});

describe('notesDao - readAll', () => {
	it("renvoie un tableau contenant toutes les notes d'un utilisateur à partir de son id", async (done) => {
		const userId = read.userId;
		const testNotes = await dao.readAll(userId);
		expect(testNotes.length).toStrictEqual(2);
		done();
	});
	it("renvoie un tableau vide si aucune note ne correspond à l'id utilisateur", async (done) => {
		const testNotes = await dao.readAll(invalidId);
		expect(testNotes.length).toStrictEqual(0);
		done();
	});
});

describe('notesDao - update', () => {
	it('modifie une note à partir de son id, en modifiant uniquement les attributs renseignés', async (done) => {
		await dao.update(read._id, { title: modifiedTitle });
		const testNote = await db.collection('notes').findOne({ _id: read._id });
		expect(testNote.title).toStrictEqual(modifiedTitle);
		expect(testNote.content).toStrictEqual(read.content);
		expect(testNote.color).toStrictEqual(read.color);
		expect(testNote.userId).toStrictEqual(read.userId);
		expect(testNote._id).toStrictEqual(read._id);
		done();
	});
	it("renvoie une erreur si aucune note ne correspond à l'id renseigné", () => {
		const testNote = async () => await dao.update(wrongId, {});
		expect(testNote).rejects.toThrow();
	});
	it("renvoie une erreur InvalidQueryError si  l'id est invalide", () => {
		const test = async () => await dao.update(invalidId, {});
		expect(test).rejects.toThrow(InvalidQueryError);
	});
});

describe('notesDao - remove', () => {
	it('supprime une note à partir de son id', async (done) => {
		await dao.remove(read._id);
		const testNote = await dao.read(read._id);
		expect(testNote).toStrictEqual(null);
		done();
	});
	it("renvoie une erreur si aucune note ne correspond à l'id renseigné", () => {
		const testNote = async () => await dao.remove(wrongId, {});
		expect(testNote).rejects.toThrow();
	});
	it("renvoie une erreur InvalidQueryError si l'id est invalide", () => {
		const test = async () => await dao.remove(invalidId);
		expect(test).rejects.toThrow(InvalidQueryError);
	});
});

describe('notesDao - removeAll', () => {
	it("supprime toutes les notes d'un utilisateur à partir de son id", async (done) => {
		await dao.removeAll(read.userId);
		const testNotes = await dao.readAll(read.userId);
		expect(testNotes.length).toStrictEqual(0);
		done();
	});
	it("renvoie une erreur si aucune note ne correspond à l'id renseigné", () => {
		const testNote = async () => await dao.remove(wrongId, {});
		expect(testNote).rejects.toThrow();
	});
	it("renvoie une erreur InvalidQueryError si l'id est invalide", () => {
		const test = async () => await dao.removeAll(invalidId);
		expect(test).rejects.toThrow(InvalidQueryError);
	});
});
