exports.configFile = "./settings.json"

exports.fail = {
	is_response: true,
	response: "Something is wrong!"
}

exports.perm_fail = {
	is_response: true,
	response: "You cant do that!"
}

exports.empty = {
	is_response: false
}