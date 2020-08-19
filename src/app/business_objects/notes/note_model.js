import DataValidationError from '../core/helpers/errors/data_validation_error';

/**
 * Modélisation et validation d'une note.
 * @param {Object} noteInfo données
 * @returns {Object} note validée et normalisée
 * 
 * Une note comprends un titre pouvant être nul, un contenu pouvant être nul
 * et une couleur, par défaut définie comme grise et devant faire partie de
 * la liste des couleurs prédéfinie. Chaque note appartient à un utilisateur (1..*) ;
 * l'identifiant de l'utilisateur est associé à la note au moment de sa création qui
 * nécessite donc qu'un utilisateur soit authentifié.
 */
export default (noteInfo) => {
	/**
	 * Valeurs par défaut : 
	 * - couleurs de la note
   */
	let PRESETS = {
		colors: [ 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'orange' ],
	};

	/**
	 * Liste d'erreurs.
	 */
	let ERRORS = [];

	return Object.freeze({
		buildNew: buildNew(),
		buildUpdate: buildUpdate(),
	});

	/**
	 * Valide et normalise une nouvelle note.
	 * @returns {Object} note
	 */
	function buildNew() {
		_validateNew(noteInfo);
		return _normalizeNew(noteInfo);
	}

	/**
   * Valide les attributs de la note.
   * @param {Object} param0 note à valider (dstrc)
   * @throws {DataValidationError} si les données saisie sont invalides
   */
	function _validateNew({ title, content, color } = {}) {
		const validColor = _validateColor(color);
		if (!validColor) throw new DataValidationError(ERRORS);
	}

	/**
   * Normalise les attributs de la note.
   * @param {Object} param0 note à valider (dstrc)
   * @returns {Object} note normalisée
   */
	function _normalizeNew({ title, content, color }) {
		return {
			title: title,
			content: content,
			color: color ? color : PRESETS.colors[0],
		};
	}

	/**
	 * Valide et normalise la mise à jour d'une note.
	 * @returns {Object} mises à jour de la note
	 */
	function buildUpdate() {
		_validateUpdate(noteInfo);
		return _nomalizeUpdate(noteInfo);
	}

	/**
   * Valide les nouveaux attributs de la note.
   * @param {Object} noteInfo nouveaux attributs
   * @throws {DataValidationError} si les données saisie sont invalides
   */
	async function _validateUpdate(noteInfo) {
		const validColor = noteInfo.color ? _validateColor(noteInfo.color) : true;
		if (!validColor) throw new DataValidationError(ERRORS);
	}

	/**
   * Normalise les nouveaux attributs de la note.
   * @param {Object} noteInfo nouveaux attributs
   * @returns {Object} nouveaux attributs normalisés
   */
	function _nomalizeUpdate(noteInfo) {
		let result = {};
		if (noteInfo.title) {
			result.title = noteInfo.title;
		}
		if (noteInfo.content) {
			result.content = noteInfo.content;
		}
		if (noteInfo.color) {
			result.color = noteInfo.color;
		}
		return result;
	}

	/**
   * Valide la couleur de la note.
   * @param {String} color couleur saisie
   * @return {boolean} true si la couleur est valide
   */
	function _validateColor(color) {
		if (color) {
			if (!PRESETS.colors.includes(color)) {
				ERRORS.push('La couleur renseignée est invalide.');
				return false;
			}
		}
		return true;
	}
};
