export default (httpRequest, secretToken) => {
	if (httpRequest.clientToken != secretToken) {
		return false;
	} else {
		return true;
	}
};
