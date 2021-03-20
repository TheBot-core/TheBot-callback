const express = require('express');
const { CommandManager } = require('./command/command');
const { log } = require('./logger');
const { checkToken, callUrl } = require('./util');

const bodyParser = require("body-parser");
const { ping, crash, join, say, role, print } = require('./commands');

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

command_manager.add_command("ping", "Ping the bot!", ping);
command_manager.add_command("crash", "Crash the bot!", crash);
command_manager.add_command("join", "Join a group!", join);
command_manager.add_command("say", "Say something!", say);
command_manager.add_command("role", "Get and set roles!", role);

command_manager.add_command("print", "Print a text file!", print);

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