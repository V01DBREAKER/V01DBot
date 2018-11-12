const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

var possibleResponses = [
	"It is certain.",
	"It is decidedly so.",
	"Without a doubt.",
	"Yes - definitely.",
	"You may rely on it.",
	"As I see it, yes.",
	"Most likely.",
	"Outlook good.",
	"Yes.",
	"Signs point to yes.",
	"Reply hazy, try again",
	"Ask again later.",
	"Better not tell you now.",
	"Cannot predict now.",
	"Concentrate and ask again.",
	"Don't count on it.",
	"My reply is no.",
	"My sources say no.",
	"Outlook not so good.",
	"Very doubtful."
  ];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id)[scriptName];
	if (option != undefined && option == 0) return;
	//inspired by kaylabot (thx kaylanime :), you too mosh!)
	let res = Math.floor(Math.random() * possibleResponses.length)
	if (args.length < 1) return message.reply("Please ask a question.");
	let embed = new Discord.RichEmbed()
	  .setTimestamp()
	  .setColor([91,203,237])
	  .setTitle("🎱 Magical 8 Ball 🎱")
	  .setDescription("Let all your questions answered...")
	  .addField(`${args.slice(1).join(" ")}`, `${possibleResponses[res]}`)
	
	message.channel.send({embed:embed})
}

exports.help = {
	name: "8 Ball",
	category: "Fun",
	description: "Your questions. Answered. (Maybe)",
	usage: "\`8ball <question>\`"
}
