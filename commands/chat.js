const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
  message.reply("Enabling or Disabling chat bot is now at v!options");
  message.channel.send("usage:\`options [chat] [enable or disable]\`");
}

exports.help = {
	name: "Chat",
	category: "System",
	description: "Enabling and disabling chat bot relocated to v!options",
	usage: "\`options [chat] [enable or disable]\`"
}
