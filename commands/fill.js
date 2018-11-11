const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	var grassS = '<:grass:365713205269495810> ';
	var randomNum100 = Math.ceil(Math.random() * 50);
	var grass = grassS.repeat(randomNum100);
	message.channel.send(`*filled ${randomNum100} blocks with grass_block* \n${grass}`)
	.then(msg => console.log(`Filled the chat with grass`));

}

exports.help = {
	name: "Fill",
	category: "Fun",
	description: "Fill discord with grass blocks",
	usage: "\`fill\`"
}
