const fs = require("fs");
const { configFile } = require("./constants");

const fetch = require("node-fetch")

function readConfig(what) {
	return JSON.parse(fs.readFileSync(configFile))[what];
}

async function callUrl(what, data) {
	const url = (await readConfig("url"))[what];
	const data_fetched = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			data: data,
			token: await readConfig("token")
		}),
		headers: {
			"Content-Type": "application/json"
		}
	});
	return data_fetched.json();
}

function checkToken(token) {
	return readConfig("token") === token; 
}

exports.readConfig = readConfig;
exports.callUrl = callUrl;
exports.checkToken = checkToken;