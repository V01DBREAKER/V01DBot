exports.run = (client, message, args) => {
	if(args.length > 1) return
	message.reply(':cookie:')
	.then(msg => console.log(`Sent a cookie to ${msg.author}`))
}

exports.help = (client, message, args) => {
	message.channel.send({embed: {
		color: 3447003,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Cookie",
		url: "http://v01dbreaker.comlu.com/V01DBot",
		fields: [{
				name: "Category",
				value: "Fun"
				},
				{
				name: "Description",
				value: "Send a cookie to everyone!"
				},	
				{
				name: "Usage",
				value: "\`cookie\`"
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
	name: "Cookie",
	category: "Fun",
	description: "Send a cookie to the chat!",
	usage: "\`cookie\`"
}