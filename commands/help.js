const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	if (args.length < 1) {
		const embed = new Discord.RichEmbed()
			.setColor('#3498db')
			.setAuthor(client.user.username, client.user.avatarURL)
			.setTitle('Hey I\'m The V01DBot')
			.setURL('https://github.com/V01DBREAKER/V01DBot')
			.setDescription('I was created by V01DBREAKER!')
			.addField('Want to add V01DBot to your server?', "If you have Manage Server permissions for your guild, you can invite it here: [Invite](https://discordapp.com/api/oauth2/authorize?client_id=329191944167358474&scope=bot&permissions=506981446)")
			.addField('The V01D Discord', "Need help or have any ideas for the bot? Perhaps you just want to hang out? Come on over to The V01D! \nhttps://discord.gg/kh2ujtV")
			.addField('The V01DSite', "Come visit our website for more infomation! \nhttp://v01dbreaker.comlu.com/V01DBot")
			.setFooter("Bot created by V01DBREAKER", client.user.avatarURL)
		message.author.send({embed});
		console.log(`Sent help to ${message.author.username} at ${message.guild.name}`)
		message.reply(`Sent you help via DMs, for a command list, use \`${config.prefix}cmds\` \nFor more detailed infomation about commands use \`${config.prefix}help \(command\)\``)
	} else {
		var command = args[0].toLowerCase();
		try {
			let commandH = require(`./${command}.js`);
			const embed = new Discord.RichEmbed()
				.setColor('#3498db')
				.setAuthor(client.user.username, client.user.avatarURL)
				.setURL("http://v01dbreaker.comlu.com/V01DBot")
				.addField("Category", commandH.help.category)
				.addField("Description", commandH.help.description)
				.addField("Usage", commandH.help.usage)
				.setFooter("Bot created by V01DBREAKER", client.user.avatarURL)
			message.reply({embed});
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
