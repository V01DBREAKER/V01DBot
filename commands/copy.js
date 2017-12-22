exports.run = (client, message, args) => {
	const config = require("../config.json");
	var copy = message.content.substr(6);
	if (copy.startsWith(config.prefix)) {
		message.reply('I\'m not made for spamming!')
	} else if (copy === undefined) {
		message.reply('Nothing to copy...')
	} else {
		message.channel.send(copy);
		console.log(`Copied ${message.author.username} at ${message.guild.name}`)
	}
}

exports.help = (client, message, args) => {
	message.channel.send({embed: {
		color: 3447003,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Copy",
		url: "http://v01dbreaker.comlu.com/V01DBot",
		fields: [{
				name: "Category",
				value: "Fun"
				},
				{
				name: "Description",
				value: "Make the bot copy you!"
				},	
				{
				name: "Usage",
				value: "\`copy [message]\`"
				}
				],
		footer: {
			icon_url: client.user.avatarURL,
			text: "Created by V01DBREAKER"
		}
	}
	});
}
exports.help = {
	name: "Copy",
	category: "Fun",
	description: "Make the bot copy you!",
	usage: "\`copy [message]\`"
}