import { mockRequest } from 'mock-req-res';
import adaptRequest from '../../app/core/helpers/adapters/request_adapter';

/**
 * Tests de app/core/helpers/adapters/request_adapter.js
 */

let httpRequest; // requête adaptée
let path = '/api/v0/';
let method = 'GET';
let params = { param: 'param' };
let query = { query: 'query' };
let body = { test: 'test' };
let clientToken = 'client_token';
let headers = { clienttoken: clientToken };

beforeAll(() => {
	const req = mockRequest({
		path: path,
		method: method,
		params: params,
		query: query,
		body: body,
		headers: headers,
	});
	httpRequest = adaptRequest(req);
});

describe('requestAdapter', () => {
	test('récupère un chemin correct', () => {
		expect(httpRequest.path).toStrictEqual(path);
	});
	test('récupère une méthode correcte', () => {
		expect(httpRequest.method).toStrictEqual(method);
	});
	test('récupère des paramètres corrects', () => {
		expect(httpRequest.params).toStrictEqual(params);
	});
	test('récupère une query correcte', () => {
		expect(httpRequest.query).toStrictEqual(query);
	});
	test('récupère un corps correct', () => {
		expect(httpRequest.body).toStrictEqual(body);
	});
	test('récupère une en-tête correcte', () => {
		expect(httpRequest.headers).toStrictEqual(headers);
	});
	test('récupère un token clien correct', () => {
		expect(httpRequest.clientToken).toStrictEqual(clientToken);
	});
});
