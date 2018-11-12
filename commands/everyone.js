const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
  var option = client.op.get(message.guild.id)[scriptName];
	if (option != undefined && option == 0) return;
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
