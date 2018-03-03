const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
  let op = client.op.get(message.guild.id);
  if (!message.member.hasPermission("MANAGE_GUILD")) {
    message.reply("You need the MANAGE_GUILD permission to enable chat bot...");
    return;
  }
  if (op == 0) {
    client.op.set(message.guild.id, 1);
    message.reply("Bot chat enabled.");
  } else {
    client.op.set(message.guild.id, 0);
    message.reply("Bot chat disabled.");
  }
}

exports.help = {
	name: "Chat",
	category: "System",
	description: "Disable or enable bot chat function; Default = Disabled",
	usage: "\`chat\`"
}
