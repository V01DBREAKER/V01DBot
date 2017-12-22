exports.run = (client, message, [mention, ...reason]) => {
	if (!message.member.hasPermission("KICK_MEMBERS"))
		return message.reply("You can't use this command.");

	if (message.mentions.members.size === 0)
		return message.reply("Please mention a user to kick");

	if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
		message.reply("Bot has insufficent permissions")
		console.log(`Cannot kick user because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	const kickMember = message.mentions.members.first();
	if (!kickMember.kickable) {
		message.reply(`Cannot kick ${kickMember.user.username}, bot's rank is too low`)
		console.log(`Cannot kick ${kickMember.user.username} because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	kickMember.kick(reason.join(" ")).then(member => {
		message.reply(`Successfully kicked ${member.user.username}`)
		console.log(`${member.user.username} at ${message.guild.name} was succesfully kicked by ${message.author.username} at ${message.guild.name}`);
	});
}

exports.help = {
	name: "Kick",
	category: "Moderation",
	description: "Kick a member from the guild",
	usage: "\`kick [member(mention)] [reason]\`"
}