import DataValidationError from '../core/helpers/data_validation_error';

export default (userInfo) => {
  const FIELDS = {
    email,
    password,
  };

  const user = validate(userInfo);
  return normalize(userInfo);

  function validate({ email, password } = {}) {
    const errors = [];
    const validEmail = validateEmail(email, errors);
    const validPassword = validatePassword(password, errors);
    if (!validEmail || !validPassword) throw new DataValidationError(errors);
    return { email, password };
  }

  function validateEmail(email, errors) {
    // Présence
    if (!email) {
      errors.push('Une adresse email doit être renseignée.');
      return false;
    }
    // Format
    if (!isValidEmail(email)) {
      errors.push("L'adresse email renseignée est invalide.");
      return false;
    }
    return true;
  }

  function isValidEmail(email) {
    const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    return valid.test(email);
  }

  function validatePassword(password, errors) {
    // Présence
    if (!password) {
      errors.push('Un mot de passe doit être renseigné.');
      return false;
    }
    // Longueur
    if (password.length < 6) {
      errors.push("Le mot de passe doit être long d'au moins 6 caractères.");
      return false;
    }
    return true;
  }

  function normalize({ email, password }) {
    return {
      email: email,
      password: password,
    };
  }
};
