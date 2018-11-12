const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const rainbow = require("../other/rainbow.js")
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
  var option = client.op.get(message.guild.id)[scriptName];
	if (option != undefined && option == 0) return;
  if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
    message.reply("Bot has insufficent permissions");
    return;
  }
  if (!message.guild.roles.find("name", ".rainbow.")) {
    let r = message.guild.me.roles.last().position - 1;
    message.guild.createRole({
      name: '.rainbow.',
      position: r,
    }).then(message.channel.send("The Rainbows have been received, try this command again for a taste!"));
  } else {
    rainFlash(client, message);
  }

}

exports.help = {
	name: "Rainbow",
	category: "Fun",
	description: "Makes your name flash rainbows! Only works if your role is lower than the bot's",
	usage: "\`rainbow\`"
}

function rainFlash(client, message){
  let roleBow = message.guild.roles.find("name", ".rainbow.");
  message.member.addRole(roleBow);
  message.reply("Taste the ***RAINBOW!!!***")
  rainbow.run(message, roleBow.id)
  setTimeout(function(){message.member.removeRole(roleBow)}, 11000)
}
