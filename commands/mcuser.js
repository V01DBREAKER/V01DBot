const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	const Discord = require("discord.js");
	if(args.length < 1) {
		message.reply('Please enter a username.');
	} else {
		const embed = new Discord.RichEmbed()
			.setTitle(args[0])
			.setAuthor(client.user.username, client.user.avatarURL)
			.setColor(0x00AE86)
			.setDescription("Generated Using www.minecraftskinstealer.com")
			.setFooter("Created by V01DBREAKER", client.user.avatarURL)
			.setImage(`https://www.minecraftskinstealer.com/skin.php?u=${args[0]}&s=700`)
			.setThumbnail(`https://www.minecraftskinstealer.com/face.php?u=${args[0]}`)
			.setTimestamp()
			.setURL(`https://www.minecraftskinstealer.com/player.php?user=${args[0]}`)
			message.channel.send({embed});
			console.log(`Sent ${message.author.username} at ${message.guild.name} Minecraft user ${args[0]}`);
		};

}

exports.help = {
	name: "McUser",
	category: "Search",
	description: "Search for a Minecraft user's skin",
	usage: "\`mcuser [username]\`"
}
