const express = require('express');
const { CommandManager } = require('./command/command');
const { log } = require('./logger');
const { checkToken } = require('./util');

const bodyParser = require("body-parser");
const { ping, crash, join, say, role, print, setup, ping_help, crash_help, join_help, print_help, setup_help, say_help, role_help } = require('./commands');

const fs = require("fs");
const { load_all } = require('./plugin');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

	log(req.path);

	if(!checkToken(req.body.token)) {
		res.send("{ \"status\" : \"TOKEN_REJECTED\" }");
		log("Invalid token received!");
		return;
	}

	switch(req.path) {
		case "/api/message":
			next();
			break;
		
		default:
			res.send("{}");
			break;
	}
});

const command_manager = new CommandManager("#");

command_manager.add_command_long("ping", "Ping the bot!", ping_help, undefined, ping);
command_manager.add_command_long("crash", "Crash the bot!", crash_help, "crash", crash);
command_manager.add_command_long("join", "Join a group!", join_help, "join", join);
command_manager.add_command_long("say", "Say something!", say_help, undefined, say);
command_manager.add_command_long("role", "Get and set roles!", role_help, "role", role);

command_manager.add_command_long("print", "Print a text file!", print_help, undefined, print);

command_manager.add_command_long("setup", "Load a plugin!", setup_help, "plugin", setup);

exports.command_manager = command_manager;

if(!fs.existsSync("./plugin")) {
	fs.mkdirSync("./plugin");
}

load_all();

app.post("/api/message", async (req, res) => {

	if(req.body.data.message.body.startsWith(command_manager.prefix)) {
		const response = await command_manager.on_command(req.body.data.message.body, req.body.data);
	
		res.send(JSON.stringify(response));
	} else {
		res.send(JSON.stringify({
			is_response: false
		}));
	}
});


app.listen(5050, () => {
	console.log("TheBot listening at http://localhost:" + 5050);
});