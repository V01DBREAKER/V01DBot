const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
  var usr = [];
  if (message.author.id != config.ownerID) {
    message.channel.send("", {
  	file: "./assets/everyone.gif"
  	});
    return;
  }
  message.channel.members.forEach(function(el){
    usr.push(`<@${el.id}>`);
    if (usr.length == message.channel.members.size) {
      usr = usr.join(" ");
      message.channel.send("Hey Listen!!! @everyone");
      message.channel.send(usr);
    }
  });
}

exports.help = {
	name: "everyone",
	category: "Fun",
	description: "Don't you hate it when someone mentions everyone...",
	usage: "\`everyone\`"
}
