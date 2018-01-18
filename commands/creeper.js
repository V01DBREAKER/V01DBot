const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
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
