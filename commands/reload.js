exports.run = (client, message, args) => {
	const config = require("../config.json");
	if (message.author.id !== config.ownerID) return;
	if (!args || args.length < 1) return message.reply("Must provide a command name to reload.");
	delete require.cache[require.resolve(`./${args[0]}.js`)];
	message.reply(`The command ${args[0]} has been reloaded`);
	console.log(`The command ${args[0]} has been reloaded`)
}

exports.help = {
	name: "Reload",
	category: "System",
	description: "This command reloads a command for bug testing.",
	usage: "\`reload [command]\`"
}