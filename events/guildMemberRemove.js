exports.run = (client, member) => {
	if (member.guild.id !== "365712309865152524") return;
	console.log(`User "${member.user.username}" has left "${member.guild.name}"` );
	member.guild.channels.get("366763100441018368").send(`"${member.user.username}" has left this server.\nBye! Hope you enjoyed your stay and comeback again!`);
}