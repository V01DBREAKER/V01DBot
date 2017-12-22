exports.run = (client, message, [mention, ...reason]) => {
	if (!message.member.hasPermission("BAN_MEMBERS"))
		return message.reply("You can't use this command.");

	if (message.mentions.members.size === 0)
		return message.reply("Please mention a user to ban");

	if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
		message.reply("Bot has insufficent permissions")
		console.log(`Cannot ban user because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	const banMember = message.mentions.members.first();
	if (!banMember.bannable) {
		message.reply(`Cannot ban ${banMember.user.username}, bot's rank is too low`)
		console.log(`Cannot ban ${banMember.user.username} because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	banMember.ban(reason.join(" ")).then(member => {
		message.reply(`Successfully banned ${member.user.username}`)
		console.log(`${member.user.username} at ${message.guild.name} was succesfully banned by ${message.author.username} at ${message.guild.name}`);
	});
}

exports.help = {
	name: "Ban",
	category: "Moderation",
	description: "Ban a member from the guild",
	usage: "\`ban [member(mention)] [reason]\`"
}