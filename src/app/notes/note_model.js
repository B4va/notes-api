import DataValidationError from '../../helpers/data_validation_error';

export default (noteInfo) => {
  const FIELDS = {
    title: '',
    content: '',
    colors: ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'],
  };

  const note = validate(noteInfo, FIELDS);
  return normalize(noteInfo, FIELDS);

  function validate({ title, content, color } = {}, FIELDS) {
    const errors = [];
    const validColor = validateColor(color, errors, FIELDS.colors);
    if (!validColor) throw new DataValidationError(errors);
    return { title, content, color };
  }

  function validateColor(color, errors, colors) {
    // Valeurs acceptés
    if (color) {
      if (!colors.includes(color)) {
        errors.push('La couleur renseignée est invalide.');
        return false;
      }
    }
    return true;
  }

  function normalize({ title, content, color }, FIELDS) {
    return {
      title: title ? title : FIELDS.title,
      content: content ? content : FIELDS.content,
      color: color ? color : FIELDS.colors[0],
    };
  }
};
