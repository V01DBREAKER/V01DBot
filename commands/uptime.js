exports.run = (client, message, args) => {
	if(args.length > 1) return
	var time = ((client.uptime / 1000) / 60) / 60;
	time = time.toPrecision(1);
    message.channel.send(`I have been online for ${time} hour(s)`)
	console.log(`Uptime! ${message.author.username} at ${message.guild.name}`)
}

exports.help = {
	name: "Uptime",
	category: "System",
	description: "See how long the bot has been running for.",
	usage: "\`uptime\`"
}