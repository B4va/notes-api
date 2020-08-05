import DataValidationError from '../core/helpers/data_validation_error';

/**
 * Modélisation et validation d'une note.
 * @param {Object} noteInfo données
 * @returns {Object} note validée et normalisée
 */
export default (noteInfo) => {
  /**
   * Valeurs par défaut : 
   * - couleurs de la note
   */
  const PRESETS = {
    colors: ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'],
  };

  const note = validate(noteInfo, FIELDS);
  return normalize(noteInfo, FIELDS);

  /**
   * Valide les attributs de la note.
   * @param {Object} param0 note à valider (dstrc)
   * @param {Object} FIELDS valeurs par défaut
   * @returns {Object} note validée
   */
  function validate({ title, content, color } = {}, FIELDS) {
    const errors = [];
    const validColor = validateColor(color, errors, PRESETS.colors);
    if (!validColor) throw new DataValidationError(errors);
    return { title, content, color };
  }

  /**
   * Valide la couleur de la note.
   * @param {*} color couleur saisie
   * @param {*} errors liste d'erreurs
   * @param {*} colors couleurs par défaut
   * @return {boolean} true si la couleur est valide
   */
  function validateColor(color, errors, colors) {
    if (color) {
      if (!colors.includes(color)) {
        errors.push('La couleur renseignée est invalide.');
        return false;
      }
    }
    return true;
  }

  /**
   * Normalise les attributs de la note.
   * @param {Object} param0 note à valider (dstrc)
   * @param {Object} FIELDS valeurs par défaut
   * @returns {Object} note normalisée
   */
  function normalize({ title, content, color }, FIELDS) {
    return {
      title: title,
      content: content,
      color: color ? color : FIELDS.colors[0],
    };
  }
};
