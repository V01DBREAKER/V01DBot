const fs = require("fs");
const Discord = require("discord.js");
const config = require("../config.json");

exports.run = (client, message, args) => {
	var system = [];
	var fun = [];
	var moderation = [];
	var search = [];
	args.forEach(function(el) {
		el.toLowerCase();
	});
	fs.readdir("./commands", (err, files) => {
		if (err) return console.error(err);
		files.forEach(file => {
			if (!file.endsWith(".js")) return;
			let command = require(`./${file}`);
			if (command.help.category == "System") {
				system.push(command);
			} else if (command.help.category == "Fun") {
				fun.push(command);
			} else if (command.help.category == "Moderation") {
				moderation.push(command);
			} else if (command.help.category == "Search") {
				search.push(command);
			}
		});
		if(args.length < 1) {
			cmdList(system, client, message, args);
			cmdList(fun, client, message, args);
			cmdList(moderation, client, message, args);
			cmdList(search, client, message, args);
			message.reply("Sent you the command lists.");
				console.log(`Sent ${message.author.username} at ${message.guild.name} command lists`);
		} else {
			if (args[0] == "system") {
				cmdList(system, client, message, args);
			} else if (args[0] == "fun") {
				cmdList(fun, client, message, args);
			} else if (args[0] == "moderation") {
				cmdList(moderation, client, message, args);
			} else if (args[0] == "search") {
				cmdList(search, client, message, args);
			} else {
				message.send("Unknown category");
				return;
			}
			message.reply("Sent you a command list.");
			console.log(`Sent ${message.author.username} at ${message.guild.name} ${args[0]} command list`);
	}
	});
}

function cmdList(cat, client, message, args) {
	const embed = new Discord.RichEmbed()
	.setColor("#3498db")
	.setURL("http://v01dbreaker.comlu.com/V01DBot")
	.setTitle(`My prefix is \`${config.prefix}\``)
	.setFooter("Created by V01DBREAKER", client.user.avatarURL)
	cat.forEach(function(item){
		embed.addField(item.help.name, item.help.usage);
		embed.setAuthor(item.help.category, client.user.avatarURL);
	});
	message.author.send({embed});
};

exports.help = {
	name: "Cmds",
	category: "System",
	description: "This command displays other commands. If catagory specified, displays category commands",
	usage: "\`cmds [category]\`"
}
