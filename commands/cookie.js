const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	if(args.length > 1) return
	message.reply(':cookie:')
	console.log(`Sent a cookie to ${message.author}`);
}

exports.help = {
	name: "Cookie",
	category: "Fun",
	description: "Send a cookie to the chat!",
	usage: "\`cookie\`"
}
