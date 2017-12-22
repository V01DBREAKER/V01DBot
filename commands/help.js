exports.run = (client, message, args) => {
	if (args.length < 1) {
		const config = require("../config.json");
		message.author.send({embed: {
			color: 3447003,
			author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
			},
			title: "Hey I'm The V01D Bot",
			url: "https://www.youtube.com/channel/UC8JuoR6e2y_Edm1icqSrmqQ?view_as=subscriber?&ab_channel=Slimepig-V01DBREAKER",
			description: "I was created by V01DBREAKER!",
			fields: [{
				name: "Want to add V01DBot to your server?",
				value: "If you have Manage Server permissions for your guild, you can invite it here: [Invite](https://discordapp.com/api/oauth2/authorize?client_id=329191944167358474&scope=bot)"
			},
			{
				name: "The V01D Discord",
				value: "Need help or have any ideas for the bot? Perhaps you just want to hang out? Come on over to The V01D! \nhttps://discord.gg/kh2ujtV"
			},
			{
				name: "The V01D Website",
				value: "Come visit our website for more infomation! \nhttp://v01dbreaker.comlu.com/V01DBot"
			}
			],
			footer: {
			icon_url: client.user.avatarURL,
			text: "Bot created by V01DBREAKER"
			}
		}
		});
		console.log(`Sent help to ${message.author.username} at ${message.guild.name}`)
		message.reply(`Sent you help via DMs, for a command list, use \`${config.prefix}cmds\` \nFor more detailed infomation about commands use \`${config.prefix}help \(command\)\``)
	} else {
		var command = args[0].toLowerCase();
		try {
			let commandH = require(`./${command}.js`);
			message.channel.send({embed: {
				color: 3447003,
				author: {
					name: commandH.help.name,
					icon_url: client.user.avatarURL
				},
				url: "http://v01dbreaker.comlu.com/V01DBot",
				fields: [{
						name: "Category",
						value: commandH.help.category
						},
						{
						name: "Description",
						value: commandH.help.description
						},	
						{
						name: "Usage",
						value: commandH.help.usage
						}
						],
				footer: {
					icon_url: client.user.avatarURL,
					text: "Created by V01DBREAKER"
				}
			}
			});
		console.log(`Sent help for ${commandH.help.name} to ${message.author.username} at ${message.guild.name}`);
		} catch (err) {
			if (err.code == 'MODULE_NOT_FOUND') {
				console.log(`Help for ${command} not found`);
				message.reply(`Help for ${command} not found`);
				return;
			}
			console.log(err);
		}
	}
}

exports.help = {
	name: "Help",
	category: "System",
	description: "This command displays help for specified commands,\ncan also be used to access bot website and guild.",
	usage: "\`help [command]\`"
}