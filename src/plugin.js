const fs = require("fs");
const { log } = require("./logger");

function load_all() {
	fs.readdirSync("plugin").forEach(element => {
		log("Loading plugin " + element);
	
		const plugin = require("../plugin/" + element.replace(".js", ""));
	
		eval(plugin);
	});
}

function load_plugin(name) {
	log("Loading plugin " + name);
	
	const plugin = require("../plugin/" + name.replace(".js", ""));

	eval(plugin);
}

exports.load_all = load_all;
exports.load_plugin = load_plugin;