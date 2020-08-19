import adaptAuth from '../../../app/core/adapters/auth_adapter';

/**
 * Tests de app/core/helpers/adapters/auth_adapter.js
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
	test('récupère un token correct', () => {
		expect(parsedToken).toStrictEqual(token);
	});
	test('renvoie une chaîne vide si aucun token', () => {
		let httpRequest = {
			headers: {},
		};
		let parsedTokenUndefined = adaptAuth(httpRequest);
		expect(parsedTokenUndefined).toStrictEqual('');
	});
});
