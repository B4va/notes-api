import * as encrypter from '../../../app/core/auth/encrypter';

/**
 * Tests de encrypter.
 */

let validPassword = 'password';
let invalidPassword = '123456';
let hash;

beforeAll(async (done) => {
	hash = await encrypter.hash(validPassword);
	done();
});

describe('encrypter - hash', () => {
	test('génère un hash différent du mot de passe initial', () => {
		expect(hash).not.toBe(validPassword);
	});
	test('génère un hash de plus de vingt caractères', () => {
		expect(hash.length).toBeGreaterThan(20);
	});
});

describe('encrypter - isValid', () => {
	it('renvoie vrai si le mot de passe est valide', async (done) => {
		const testValid = await encrypter.isValid(validPassword, hash);
		expect(testValid).toBeTruthy();
		done();
	});
	it('renvoie faux si le mot de passe est invalide', async (done) => {
		const testInvalid = await encrypter.isValid(invalidPassword, hash);
		expect(testInvalid).toBeFalsy();
		done();
	});
});
