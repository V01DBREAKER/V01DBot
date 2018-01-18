const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	message.channel.send(`Tick Tock! :clock3: ${new Date()}`)
	.then(msg => console.log(`Sent time and date to ${msg.author}`));
}

exports.help = {
	name: "Date",
	category: "Search",
	description: "Display the current time and date.\n(AEST time)",
	usage: "\`date\`"
}
