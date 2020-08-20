import isValidToken from '../../../app/core/auth/client_validator';

/**
 * Tests de client_validator.
 */

let tokenSecret = 'tokensecret';
let validHttpRequest = { clientToken: 'tokensecret' };
let invalidHttpRequest = { clientToken: 'invalidToken' };

describe('clientValidator', () => {
	it('renvoie vrai si token valide', () => {
		expect(isValidToken(validHttpRequest, tokenSecret)).toBeTruthy();
	});
	it('renvoie faux si token invalide', () => {
		expect(isValidToken(invalidHttpRequest, tokenSecret)).toBeFalsy();
	});
});
