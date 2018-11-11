const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	if(args.length < 1) return message.reply("Please enter IP Address to search");
	var mcargs = args[0].split(":");
	var mcIP = mcargs[0]; // Your MC server IP
	var mcPort = mcargs[1]; // Your MC server port
	if (mcPort == undefined) {
		mcPort = 25565;
	}
    var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
    request(url, function(err, response, body) {
        if(err) {
            console.log(err);
            return message.reply('Error getting Minecraft server status...');
        }
        body = JSON.parse(body);
        var status = '*Minecraft server is currently offline*';
        if(body.online) {
            status = '**Minecraft** server is **online**  -  ';
            if(body.players.now) {
                status += '**' + body.players.now + '** people are playing!';
            } else {
                status += '*Nobody is playing!*';
            }
        }
        message.reply(status);
		console.log(`Sent ${message.author.username} at ${message.guild.name} status of ${mcIP}:${mcPort}`);
        });
}

exports.help = {
	name: "McServer",
	category: "Search",
	description: "Search for the status of a minecraft server.",
	usage: "\`mcserver [ip:port]\`"
}
