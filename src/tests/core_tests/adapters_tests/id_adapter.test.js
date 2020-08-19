import adaptId from '../../app/core/helpers/adapters/id_adapter';
import buildDatabase from '../../../app/core/db/index';
import InvalidQueryError from '../../app/core/helpers/errors/invalid_query_error';

/**
 * Tests de app/core/helpers/adapters/id_adapter.js
 */

let id;
let note;

beforeAll(async (done) => {
	const db = await buildDatabase();
	note = await db.collection('notes').findOne({ title: 'first note' });
	id = adaptId(note._id);
	done();
});

describe('idAdapter', () => {
	test('formatte un id correct', async (done) => {
		expect(id).toStrictEqual(note._id);
		done();
	});
	test("renvoie une erreur InvalidQueryError si l'id n'a pas le bon format", () => {
		expect(() => adaptId('invalidId')).toThrow(InvalidQueryError);
	});
});
