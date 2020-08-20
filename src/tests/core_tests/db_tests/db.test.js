import buildDatabase from '../../../app/core/db/index';

/**
 * Tests de db
 */

let collections;

beforeAll(async (done) => {
	const db = await buildDatabase();
	collections = await db.collections();
	done();
});

describe('dbBuilder', () => {
	it('initialise la base de données', async (done) => {
		expect(collections.length).toBeGreaterThan(0);
		done();
	});
});
