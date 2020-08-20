import { mockRequest } from 'mock-req-res';
import adaptRequest from '../../../app/core/adapters/request_adapter';

/**
 * Tests de request_adapter
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
	it('récupère un chemin correct', () => {
		expect(httpRequest.path).toStrictEqual(path);
	});
	it('récupère une méthode correcte', () => {
		expect(httpRequest.method).toStrictEqual(method);
	});
	it('récupère des paramètres corrects', () => {
		expect(httpRequest.params).toStrictEqual(params);
	});
	it('récupère une query correcte', () => {
		expect(httpRequest.query).toStrictEqual(query);
	});
	it('récupère un corps correct', () => {
		expect(httpRequest.body).toStrictEqual(body);
	});
	it('récupère une en-tête correcte', () => {
		expect(httpRequest.headers).toStrictEqual(headers);
	});
	it('récupère un token clien correct', () => {
		expect(httpRequest.clientToken).toStrictEqual(clientToken);
	});
});
