const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	message.channel.send(`Tick Tock! :clock3: ${new Date()}`)
	.then(msg => console.log(`Sent time and date to ${msg.author}`));
}

exports.help = {
	name: "Date",
	category: "Search",
	description: "Display the current time and date.\n(AEST time)",
	usage: "\`date\`"
}
