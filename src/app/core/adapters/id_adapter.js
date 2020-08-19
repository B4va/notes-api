import InvalidQueryError from '../errors/invalid_query_error';
import mongo from 'mongodb';

/**
 * Adapte un identifiant à son format en bdd.
 * @param {String} id identifiant saisi
 * @returns {String} identifiant au format bdd
 */
export default (id) => {
	try {
		return new mongo.ObjectID(id);
	} catch (e) {
		throw new InvalidQueryError();
	}
};
