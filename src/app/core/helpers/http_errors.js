function buildHttpError(statusCode, errorMessage, details = null) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: {
      success: false,
      error: { message: errorMessage, details: details },
    },
  };
}

export const serverError = () => buildHttpError(500, 'Erreur serveur.');

export const dataError = () =>
  buildHttpError(400, 'Impossible de lire les données.');

export const invalidDataError = (e) =>
  buildHttpError(400, 'Les données renseignées sont invalides.', e.details);

  export const uniqueViolationError = (e) =>
  buildHttpError(400, 'Les données renseignées sont invalides.', e.message);

export const authValidationError = () =>
  buildHttpError(401, 'Accès non autorisé.');

export const noDataFoundError = () =>
  buildHttpError(404, "Aucune donnée n'a été trouvée");
