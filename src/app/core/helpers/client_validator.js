export default (httpRequest, res) => {
	if (httpRequest.clientToken != process.env.CLIENT_TOKEN) {
		res.status(401).send({ error: "Erreur d'authentification du client." });
		return false;
	} else {
		return true;
	}
};
