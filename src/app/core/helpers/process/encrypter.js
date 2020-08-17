import bcrypt from 'bcrypt';

/**
 * Génère un hash à partir d'un mot de passe.
 * @param {String} password mot de passe
 * @returns {String} hash du mot de passe
 */
export const hash = async (password) => {
	console.log(password)
	const SALT_ROUNDS = 10;
	let hash = await bcrypt.hash(password, SALT_ROUNDS);
	return hash;
};

/**
 * Vérifie la validité d'un mot de passe en comparant
 * son hash au hash conservé en base de données.
 * @param {String} password mot de passe saisi
 * @param {String} hash hash conservé en base de données
 * @returns {boolean} true si le mot de passe est valide 
 */
export const isValid = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};
