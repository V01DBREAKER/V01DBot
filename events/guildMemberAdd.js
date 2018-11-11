exports.run = (client, member) => {
	if (member.guild.id !== "365712309865152524") return;
	console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
	member.guild.channels.get("366763100441018368").send(`"${member.user.username}" has joined this server.\nWelcome to the V01DBot server, where you can see me test new ideas!`);
	member.setRoles(['392938464422658048']);
}
