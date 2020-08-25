import buildUserModel from '../../../app/business_objects/users/user_model';
import DataValidationError from '../../../app/core/errors/data_validation_error';

/**
 * Tests de user_model.
 */

let User = buildUserModel();
let validEmail = 'email@mail.foo';
let validPassword = '123456';
let trace = 'trace';
let invalidEmail = 'email';
let invalidPassword = '123';

describe('userModel - buildNew', () => {
	it('accepte des données valides', () => {
		const data = { email: validEmail, password: validPassword, trace: trace };
		const testData = User.buildNew(data);
		expect(testData.email).toStrictEqual(validEmail);
		expect(testData.password).toStrictEqual(validPassword);
		expect(testData.trace).toStrictEqual(trace);
	});
	it("renvoie une erreur DataValidationError si aucun email n'est saisi", () => {
		const data = { password: validPassword, trace: trace };
		expect(() => User.buildNew(data)).toThrow(DataValidationError);
	});
	it("renvoie une erreur DataValidationError si aucun mot de passe n'est saisi", () => {
		const data = { email: validEmail, trace: trace };
		expect(() => User.buildNew(data)).toThrow(DataValidationError);
	});
	it("renvoie une erreur DataValidationError si aucune trace n'est saisie", () => {
		const data = { email: validEmail, password: validPassword };
		expect(() => User.buildNew(data)).toThrow(DataValidationError);
	});
	it("renvoie une erreur DataValidationErreur si l'email saisi est invalide", () => {
		const data = { email: invalidEmail, password: validPassword, trace: trace };
		expect(() => User.buildNew(data)).toThrow(DataValidationError);
	});
	it('renvoie une erreur DataValidationErreur si le mot de passe saisi est invalide', () => {
		const data = { email: validEmail, password: invalidPassword, trace: trace };
		expect(() => User.buildNew(data)).toThrow(DataValidationError);
	});
	it("ne prend pas en compte d'attribut supplémentaire", () => {
		const data = { email: validEmail, password: validPassword, trace: trace, property: 'property' };
		const testData = User.buildNew(data);
		expect(testData).not.toHaveProperty('property');
	});
});

describe('userModel - buildUpdate', () => {
	it('accepte des données valides', () => {
		const data = { email: validEmail, password: validPassword, trace: trace };
		const testData = User.buildUpdate(data);
		expect(testData.email).toStrictEqual(validEmail);
		expect(testData.password).toStrictEqual(validPassword);
		expect(testData.trace).toStrictEqual(trace);
	});
	it('accepte des données sans email, mot de passe ou trace', () => {
		const data = {};
		const testData = User.buildUpdate(data);
		expect(testData).not.toBe(undefined);
	});
	it("renvoie une erreur DataValidationErreur si l'email saisi est invalide", () => {
		const data = { email: invalidEmail };
		expect(() => User.buildUpdate(data)).toThrow(DataValidationError);
	});
	it('renvoie une erreur DataValidationErreur si le mot de passe saisi est invalide', () => {
		const data = { password: invalidPassword };
		expect(() => User.buildUpdate(data)).toThrow(DataValidationError);
	});
	it("ne prend pas en compte d'attribut supplémentaire", () => {
		const data = { property: 'property' };
		const testData = User.buildUpdate(data);
		expect(testData).not.toHaveProperty('property');
	});
});
