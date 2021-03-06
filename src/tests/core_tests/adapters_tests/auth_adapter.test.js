import adaptAuth from '../../../app/core/adapters/auth_adapter';

/**
 * Tests de auth_adapter.
 */

let parsedToken;
let token = 'testtoken';

beforeAll(() => {
	let httpRequest = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};
	parsedToken = adaptAuth(httpRequest);
});

describe('authAdapter', () => {
	it('récupère un token correct', () => {
		expect(parsedToken).toStrictEqual(token);
	});
	it('renvoie une chaîne vide si aucun token', () => {
		let httpRequest = {
			headers: {},
		};
		let parsedTokenUndefined = adaptAuth(httpRequest);
		expect(parsedTokenUndefined).toStrictEqual('');
	});
});
