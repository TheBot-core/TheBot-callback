const { command_manager } = require("../src");
const { fail } = require("../src/constants");
const fs = require("fs");
const { typewriter } = require("../src/command/style");

command_manager.add_command("info", "Get info about a crash!", "crash", async (event) => {
	if(event.args.length != 1) {
		return fail;
	}

	const crash = JSON.parse(fs.readFileSync("./crash/" + event.args[0] + ".json"));

	return {
		is_response: true,
		response: typewriter(crash.stack)
	}
});