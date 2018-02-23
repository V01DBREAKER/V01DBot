const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
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
