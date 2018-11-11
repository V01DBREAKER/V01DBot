const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');

exports.run = (client, message, args) => {
	if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id != config.ownerID) {
    message.reply("You need the MANAGE_GUILD permission to enable chat bot...");
    return;
  };
	if (args[0] == undefined){
		message.reply("Please specify what command to enable or disable \nUsage:`v!options [command] [enable/disable]`")
	}
	if (args[0] == 'chat') {
		if (client.op.get(message.guild.id) == undefined) {
			client.op.set(message.guild.id, [1,[['test','test'],['test','test']]]);
		}
		let chatOp = client.op.get(message.guild.id);
		if (args[1] == 'enable' || args[1] == 'enabled' || args[1] == '1') {
			chatOp[0] = 1;
			client.op.set(message.guild.id, chatOp);
			message.reply("Bot chat is now enabled.");
			console.log(`Enabled bot chat at ${message.guild.name}:${message.guild.id}`);
			return;
		} else {
			chatOp[0] = 0;
			client.op.set(message.guild.id, chatOp);
			message.reply("Bot chat is now disabled.");
			console.log(`Disabled bot chat at ${message.guild.name}:${message.guild.id}`);
			return;
		}
	}
	if (args[0] == 'cmds' || args[0] == 'eval' || args[0] == 'help' || args[0] == 'options' || args[0] == 'ping' || args[0] == 'reload' || args[0] == 'stop' || args[0] == 'uptime' ||  args[0] == 'template') {
		message.reply("Sorry, but you cannot disable these commands")
		return;
	};
	if (client.op.get(message.guild.id) == undefined) {
		client.op.set(message.guild.id, [1,[['test','test'],['test','test']]]);
	};
	let opList = client.op.get(message.guild.id);
	fs.readdir("./commands/", (err, files) => {
 		if (err) return console.error(err);
 		files.forEach(file => {
	 		let fileName = file.split(".")[0];
	 		if (args[0] == fileName){
				if (args[1] == 'enabled' || args[1] == 'enable' || args[1] == '1') {
					if (opList[1].find(function(el){return el = fileName}) == undefined) {
						opList[1].push([fileName, '1'])
					} else {
						let cmd = opList[1].findIndex(function(el) {
  						return el = fileName;
						});
						opList[1][cmd][1] = 1;
					}
					message.reply(`The ${fileName} command is now enabled.`)
					client.op.set(message.guild.id, opList)
					console.log(`Enabled ${fileName} at ${message.guild.name}:${message.guild.id}`);
				} else if (args[1] == 'disabled' || args[1] == 'disable' || args[1] == '0') {
					if (opList[1].find(function(el){return el = fileName}) == undefined) {
						opList[1].push([fileName, 0])
					} else {
						let cmd = opList[1].findIndex(function(el) {
							return el = fileName;
						});
						opList[1][cmd][1] = 0;
					}
					message.reply(`The ${fileName} command is now disabled.`)
					client.op.set(message.guild.id, opList)
					console.log(`Disabled ${fileName} at ${message.guild.name}:${message.guild.id}`);
				} else {
					message.reply("Please state whether you want to **enable** or **disable** this command.")
				}
			};
 		});
	});
}

exports.help = {
	name: "Options",
	category: "System",
	description: "Disable and enable commands on your server! Requires the Manage Server permission.",
	usage: "\`options [command] [enable/disable] \`"
}
