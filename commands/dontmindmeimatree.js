exports.run = (client, message, args) => {
	if(args.length > 1) return
	message.reply('Don\'t mind me <:BirchTree:365724893054238721>')
	.then(msg => console.log(`Sent a tree joke to ${msg.author}`))
}

exports.help = (client, message, args) => {
	message.channel.send({embed: {
		color: 3447003,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Don't Mind Me I'm A Tree",
		url: "http://v01dbreaker.comlu.com/V01DBot",
		fields: [{
				name: "Category",
				value: "Fun"
				},
				{
				name: "Description",
				value: "Throwback to when this bot was just a Minecraft bot..."
				},	
				{
				name: "Usage",
				value: "\`dontmindmeimatree\`"
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
	name: "Don\'t Mind Me I\'m A Tree",
	category: "Fun",
	description: "Throwback to when this bot was just a Minecraft bot...",
	usage: "\`dontmindmeimatree\`"
}