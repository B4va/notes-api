import DataValidationError from '../../helpers/data_validation_error';

export default noteInfo => {
  const COLORS = ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const note = validate (noteInfo);
  return normalize (noteInfo);

  function validate ({title, content, color} = {}) {
    const errors = [];
    const validColor = validateColor (color, errors);
    if (!validColor) throw new DataValidationError (errors);
    return {title, content, color};
  }

  function validateColor (color, errors) {
    if ((color)) {
      if (!COLORS.includes (color)) {
        errors.push ('La couleur renseignée est invalide.');
        return false;
      }
    }
    return true;
  }

  function normalize({title, content, color}) {
    return {
      title: title ? title : '',
      content: content ? content : '',
      color: color ? color : COLORS[0],
    };
  }

  function isValidEmail (email) {
    const valid = new RegExp (/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    return valid.test (email);
  }
};
