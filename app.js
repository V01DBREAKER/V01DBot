const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const fs = require('fs');
const yt = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const cheerio = require('cheerio');
const path = require("path");
request = require('request');

const optionS = new EnmapLevel({name: "op"});
client.op = new Enmap({provider: optionS});

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.on("message", message => {
  client.user.setGame(`${config.prefix}help for help`);
  if (message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) {
    let reply = require(path.join(__dirname, "assets", "reply.js");
    reply.run(client, message);
    return;
  }

  // This is the best way to define args. Trust me.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
	if (err.code == 'MODULE_NOT_FOUND') return console.log(`Command ${command} not found`)
    console.log(err);
  }
});

client.login(config.token);
