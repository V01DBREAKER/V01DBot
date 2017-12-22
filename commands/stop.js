exports.run = (client, message, args) => {
	if(args.length > 1) return
    const config = require("../config.json");
	if (message.author.id !== config.ownerID) return;
	message.channel.send('Bye world! Be back as soon as my owner reactivates me!')
	console.log('Bot is shutting down...')
	client.user.setStatus('invisible')
	client.destroy();
	setTimeout(function () {
		process.exit()
	}, 5000);
}

exports.help = (client, message, args) => {
	message.channel.send({embed: {
		color: 3447003,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Stop",
		url: "http://v01dbreaker.comlu.com/V01DBot",
		fields: [{
				name: "Category",
				value: "System"
				},
				{
				name: "Description",
				value: "Stops the bot, only used by bot owner"
				},	
				{
				name: "Usage",
				value: "\`stop\`"
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
	name: "Stop",
	category: "System",
	description: "Shuts down the bot, for use by bot owner only.",
	usage: "\`stop\`"
}