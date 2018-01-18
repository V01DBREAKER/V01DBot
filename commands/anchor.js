const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
  if (message.author.id != config.ownerID) return;
fs.writeFile("./assets/anchor.json", `{\n\"guild\": \"${message.guild.id}",\n\"channel\": \"${message.channel.id}\"}`, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Bot has been anchored, ready for manual messaging!");
});
}

exports.help = {
	name: "Anchor",
	category: "System",
	description: "Anchors manual messaging to the channel",
	usage: "\`anchor\`"
}
