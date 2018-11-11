const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
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
