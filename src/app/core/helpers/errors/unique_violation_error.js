/**
 * Erreur de violation de la contrainte d'unicité.
 */
export default class UniqueViolationError extends Error {
	constructor(message, ...params) {
		super(...params);
		this.message = message;
	}
}
