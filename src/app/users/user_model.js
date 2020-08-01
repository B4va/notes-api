import DataValidationError from '../../helpers/data_validation_error';

export default (userInfo) => {
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
    if (!email) {
      errors.push('Une adresse email doit être renseignée.');
      return false;
    }
    if (!isValidEmail(email)) {
      errors.push("L'adresse email renseignée est invalide.");
      return false;
    }
    return true;
  }

  function validatePassword(password, errors) {
    if (!password) {
      errors.push('Un mot de passe doit être renseigné.');
      return false;
    }
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

  function isValidEmail(email) {
    const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    return valid.test(email);
  }
};
