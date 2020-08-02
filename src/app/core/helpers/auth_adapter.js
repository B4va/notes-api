export default (httpRequest) => {
  const authHeader = httpRequest.headers['authorization'];
  return authHeader.split(' ')[1];
};
