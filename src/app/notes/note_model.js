import DataValidationError from '../core/helpers/data_validation_error';

/**
 * Modélisation et validation d'une note.
 * @param {Object} noteInfo données
 * @returns {Object} note validée et normalisée
 */
export default (noteInfo) => {
  // TODO : doc
  const PRESETS = {
    colors: ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'],
  };

  const note = validate(noteInfo, FIELDS);
  return normalize(noteInfo, FIELDS);

  function validate({ title, content, color } = {}, FIELDS) {
    const errors = [];
    const validColor = validateColor(color, errors, PRESETS.colors);
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
      title: title,
      content: content,
      color: color ? color : FIELDS.colors[0],
    };
  }
};
