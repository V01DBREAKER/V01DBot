exports.run = (client, message, args) => {
	if(args.length > 1) return
    message.channel.send(`Pong! V01DBot Latency is ${Math.round(client.ping)}ms.`);
}

exports.help = {
	name: "Ping",
	category: "System",
	description: "Ping Pong! Discover the latency of the bot.",
	usage: "\`ping\`"
}