const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id)[scriptName];
	if (option != undefined && option == 0) return;

	if (!args[0]){

	} else if (message.mentions.users.first()){
		let user = message.mentions.users.first()
		let member = message.mentions.members.first()
		let roles = []
		member.roles.forEach(role=>{
			if (role == '@everyone') roles.push('@everyone')
			else roles.push('<@&'+role.id+'>')
		});
		embedCreate(message, user.username+'#'+user.discriminator, user.avatarURL, user.id, user.presence.status, member.joinedAt.toUTCString(), user.createdAt.toUTCString(), roles)
	} else {
		message.reply('Please mention a user.')
	}
}

exports.help = {
	name: "User",
	category: "Search",
	description: "Find detailed info about a discord user (or yourself)",
	usage: "\`user [@user]\`"
}

function embedCreate(message, username, userURL, id, status, serverJoin, discordJoin, roles){
	const Embed = new Discord.RichEmbed()
	.setAuthor(username, userURL)
	.setThumbnail(userURL)
	.setDescription(`<@${id}>`)
	.setColor('#3498db')
	.addField('Status', status, true)
	.addField('Joined Server', serverJoin, true)
	.addField('Registered At', discordJoin, true)
	.addField(`Roles [${roles.length}]`, roles.join(' '), true)
	.setTimestamp()
	.setFooter(`Id: ${id}`)
	message.channel.send({embed:Embed});
}
