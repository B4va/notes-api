import bcrypt from 'bcrypt';

/**
 * Génère un hash à partir d'un mot de passe.
 * @param {String} password mot de passe
 * @returns {String} hash du mot de passe
 */
export const hash = async (password) => {
  const SALT_ROUNDS = 10;
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Vérifie la validité d'un mot de passe en comparant
 * son hash au hash conservé en base de données.
 * @param {String} password mot de passe saisi
 * @param {String} hash hash conservé en base de données
 * @returns {boolean} true si le mot de passe est valide 
 */
export const isValid = async (password, hash) =>
  await bcrypt.compare(password, hash);
