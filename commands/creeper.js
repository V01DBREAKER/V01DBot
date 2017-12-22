exports.run = (client, message, args) => {
	if(args.length > 0) return
	message.channel.send("Run Its A Creeper!!!", {
	file: "./assets/hugecreeper.png"
	});
}

exports.help = {
	name: "Creeper",
	category: "Fun",
	description: "Send a creeper to blow up a discord channel.",
	usage: "\`creeper\`"
}