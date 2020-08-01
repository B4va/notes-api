import buildDatabase from '../db';

function buildHttpResponse(statusCode, result) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: JSON.stringify(result),
  };
}

export const ok = (result) => buildHttpResponse(200, result);

export const created = (result) => buildHttpResponse(201, result);

export const deleted = (result) => buildHttpResponse(200, result);

export const updated = (result) => buildHttpResponse(200, result);
