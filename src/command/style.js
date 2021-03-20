function big(what) {
	return "*" + what+ "*";
}

function italic(what) {
	return "_" + what+ "_";
}

function strikethrough(what) {
	return "~" + what+ "~";
}

function typewriter(what) {
	return "```" + what+ "```";
}


exports.big = big;
exports.italic = italic;
exports.strikethrough = strikethrough;
exports.typewriter = typewriter;