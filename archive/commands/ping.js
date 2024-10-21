const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
  message.channel.send(`Pong! V01DBot Latency is ${Math.round(client.ping)}ms.`);
}

exports.help = {
	name: "Ping",
	category: "System",
	description: "Ping Pong! Discover the latency of the bot.",
	usage: "\`ping\`"
}
