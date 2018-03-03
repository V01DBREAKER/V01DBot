const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const rainbow = require("../assets/rainbow.js")

exports.run = (client, message, args) => {
  if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
    message.reply("Bot has insufficent permissions");
    return;
  }
  if (!message.guild.roles.find("name", ".rainbow.")) {
    let r = message.guild.roles.size - 1;
    message.guild.createRole({
      name: '.rainbow.',
      position: r,
    })
    .then(rainFlash(client, message));
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
