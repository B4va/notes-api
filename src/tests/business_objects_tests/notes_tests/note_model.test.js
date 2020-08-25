import buildNoteModel from '../../../app/business_objects/notes/note_model';
import DataValidationError from '../../../app/core/errors/data_validation_error';
import { assert, expectation } from 'sinon';

/**
 * Tests de note_model.
 */

let Note = buildNoteModel();
let validTitle = 'title';
let validContent = 'content';
let invalidColor = 'invalid';
let savedNote = { title: validTitle, content: validContent, color: Note.PRESETS.colors[0] };

describe('noteModel - buildNew', () => {
	it('accepte des données valides', () => {
		const data = { title: validTitle, content: validContent, color: Note.PRESETS.colors[3] };
		const testData = Note.buildNew(data);
		expect(testData.title).toStrictEqual(validTitle);
		expect(testData.content).toStrictEqual(validContent);
		expect(testData.color).toStrictEqual(Note.PRESETS.colors[3]);
	});
	it('accepte des données sans titre, contenu ou couleur', () => {
		const data = {};
		const testData = Note.buildNew(data);
		expect(testData.title).toStrictEqual('');
		expect(testData.content).toStrictEqual('');
		expect(testData.color).toStrictEqual(Note.PRESETS.colors[0]);
	});
	it("renvoie une erreur DataValidationErreur si la couleur saisie n'est pas acceptée", () => {
		const data = { color: invalidColor };
		expect(() => Note.buildNew(data)).toThrow(DataValidationError);
	});
	it("ne prend pas en compte d'attribut supplémentaire", () => {
		const data = { property: 'property' };
		const testData = Note.buildNew(data);
		expect(testData).not.toHaveProperty('property');
	});
});

describe('noteModel - buildUpdate', () => {
	it('accepte des données valides', () => {
		const data = { title: validTitle, content: validContent, color: Note.PRESETS.colors[3] };
		const testData = Note.buildUpdate(data);
		expect(testData.title).toStrictEqual(validTitle);
		expect(testData.content).toStrictEqual(validContent);
		expect(testData.color).toStrictEqual(Note.PRESETS.colors[3]);
	});
	it("accepte des données sans titre, contenu ou couleur, et n'enregistre alors que les données saisies", () => {
		const data = {};
		const testData = Note.buildUpdate(data);
		expect(testData).not.toBe(undefined);
		expect(testData).not.toHaveProperty('title');
		expect(testData).not.toHaveProperty('content');
		expect(testData).not.toHaveProperty('color');
	});
	it("renvoie une erreur DataValidationErreur si la couleur saisie n'est pas acceptée", () => {
		const data = { color: invalidColor };
		expect(() => Note.buildUpdate(data)).toThrow(DataValidationError);
	});
	it("ne prend pas en compte d'attribut supplémentaire", () => {
		const data = { property: 'property' };
		const testData = Note.buildUpdate(data);
		expect(testData).not.toHaveProperty('property');
	});
});
