const { get_role, set_role } = require("./command/role_manager");
const { fail } = require("./constants");
const { callUrl } = require("./util");
const fs = require("fs");
const { load_plugin } = require("./plugin");
const { typewriter } = require("./command/style");


exports.ping = async (event) => {
	if(event.args.length != 0) {
		return fail;
	}

	return {
		is_response: true,
		response: "Pong!"
	}
}

exports.ping_help = `Use '#ping' to ping the bot!`;

exports.crash = async (event) => {
	if(event.args.length != 0) {
		return fail;
	}

	throw new Error("D:");
}

exports.crash_help = `Use '#crash' to crash the bot! (Admin only)`;

exports.join = async (event) => {
	if(event.args.length != 1) {
		return fail;
	}

	if(event.args[0].startsWith("https://chat.whatsapp.com/")) {
		const group = event.args[0].replace("https://chat.whatsapp.com/", "");
		callUrl("join", {
			invite: group
		});

		return {
			is_response: true,
			response: "Joining group " + group
		};
	} else {
		return fail;
	}
}

exports.join_help = `Use '#join [invite]' to join a group! (Admin only)\n\nExample: \n#join https://chat.whatsapp.com/0`;

exports.say = async (event) => {
	if(event.args.length < 1) {
		return fail;
	}

	return {
		is_response: true,
		response: event.args.join(" ")
	};
}

exports.say_help = `Use '#say [what]' to say something!\n\nExample: \n#say Hello world`;

exports.role = async (event) => {
	if(event.args.length < 2) {
		return fail;
	}

	switch(event.args[0]) {
		case "get":
			if(event.args.length != 2) {
				return fail;
			}
	
			const user = event.event.message.mentionedIds[0];
			const role = get_role(user);
	
			return {
				is_response: true,
				response: `The role of ${event.args[1]} is ${role}`,
				mentions: [user]
			};
	
		case "set":
			if(event.args.length != 3) {
				return fail;
			}
		
			const user2 = event.event.message.mentionedIds[0];
		
			set_role(user2, event.args[2]);
		
			return {
				is_response: true,
				response: `Setting role of ${event.args[1]} to ${event.args[2]}`,
				mentions: [user2]
			};
			
		default:
			return fail;
	}
}

exports.role_help = `Use '#role [get, set]' to manage roles! (Admin only)\n\nExample: \n#role get @somebody\n#role set @somebody mod`;

exports.print = (event) => {
	if(event.args.length != 1 || !event.event.message.hasQuotedMsg || !event.event.quote.message.hasMedia) {
		return fail;
	}

	return {
		is_response: true,
		response: typewriter(Buffer.from(event.event.quote.media.data, "base64").toString("ascii"))
	};
}

exports.print_help = `Use '#print' to print the content of the quoted file!`;

exports.setup = (event) => {

	if(event.args.length != 1) {
		return fail;
	}

	if(!event.event.message.hasQuotedMsg || !event.event.quote.message.hasMedia) {
		return fail;
	}

	const plugin = Buffer.from(event.event.quote.media.data, "base64").toString("ascii");
	const name = event.event.quote.message.body;

	fs.writeFileSync("./plugin/" + name, plugin);

	load_plugin(name);

	return {
		is_response: true,
		response: "Plugin loaded!"
	};
}

exports.setup_help = `Use '#setup' to setup the quoted file as a plugin! (Admin only)`;