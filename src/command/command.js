const { empty } = require("../constants");
const { dump } = require("../crash");
const { log } = require("../logger");
const { callUrl, readConfig } = require("../util");
const { big, italic, typewriter } = require("./style");

class CommandEvent {

	get_arguments(array) {
		if(array.length < 2) {
			return [];
		}

		var arr_new = [];

		for (var i = 1; i < array.length; i++) {
			arr_new.push(array[i]);
		}

		return arr_new;
	}

	constructor(message, command, event) {
		this.message = message;
		this.command = command;
		this.event = event;

		this.args = this.get_arguments(message.split(" "));
	}
}

class CommandManager {

	constructor(prefix) {
		this.commands = [];
		this.prefix = prefix;
	}

	add_command_long(command, help, help_long, executor) {

		const command_obj = {
			command: this.prefix + command,
			help: help,
			help_long: help_long,
			executor: executor
		};

		this.commands.push(command_obj);

		log("New Command: " + JSON.stringify(command_obj) + "!");

	}

	add_command(command, help, executor) {
		this.add_command_long(command, help, "Not specified!", executor);
	}

	async on_command(message, command_event_info) {

		const command_event = new CommandEvent(message, message.split(" ")[0], command_event_info);

		if(command_event.command === this.prefix + "help") {

			switch (command_event.args.length) {
				case 0:
					var help_msg = italic("TheBot help!") + "\n\n";

					this.commands.forEach(function (element) {
						var tmp_msg = "";
		
						tmp_msg += big(element.command) + "\n";
						tmp_msg += typewriter(element.help) + "\n\n";

						help_msg += tmp_msg;
					});

					return {
						is_response: true,
						response: help_msg
					}
				
				case 1:
					var help_msg = italic(command_event.args[0] + " help!") + "\n\n";

					this.commands.forEach(function(element) {
						if(element.command === command_event.args[0]) {
							help_msg += typewriter(element.help_long);
						}
					});

					return {
						is_response: true,
						response: help_msg
					}
					
				default:
					return {
						is_response: true,
						response: "Uh Oh try help!"
					}
			}

		} else {

			for(var cmd in this.commands) {

				if(this.commands[cmd].command === command_event.command) {
					log("Found command " + command_event.command + "!");
					try { 
						const res = await this.commands[cmd].executor(command_event);
						if(res) {
							return res;
						} else {
							return empty;
						}
					} catch (error) {
						const id = dump(error, command_event);

						if(readConfig("send_error")) {
							callUrl("new-message", {
								to: readConfig("owner"),
								response: typewriter(error.stack) 
							});
						}

						return {
							is_response: true,
							response: "*OMG something terrible happened D:*\n_The crash id is " + id + "_\n"
						};
					}
				}
			}

			return {
				is_response: true,
				response: "Command not found!"
			}
		}
	}
}

exports.CommandEvent = CommandEvent;
exports.CommandManager = CommandManager;