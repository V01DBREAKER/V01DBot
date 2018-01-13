const config = require("../config.json")

exports.run = (client, message, args) => {
  if (message.author.id != config.ownerID) return;
}

exports.help = {
	name: "TMP",
	category: "System",
	description: "TMP",
	usage: "\`tmp\`"
}
