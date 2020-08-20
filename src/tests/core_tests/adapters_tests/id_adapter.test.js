import adaptId from '../../../app/core/adapters/id_adapter';
import buildDatabase from '../../../app/core/db/index';
import InvalidQueryError from '../../../app/core/errors/invalid_query_error';

/**
 * Tests de id_adapter
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
	it('formatte un id correct', async (done) => {
		expect(id).toStrictEqual(note._id);
		done();
	});
	it("renvoie une erreur InvalidQueryError si l'id n'a pas le bon format", () => {
		expect(() => adaptId('invalidId')).toThrow(InvalidQueryError);
	});
});
