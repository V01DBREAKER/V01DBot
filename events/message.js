const Discord = require("discord.js");
const fs = require('fs');
const config = require("../config.json");

exports.run = (client, message) => {
  client.user.setActivity(`${config.prefix}help to give you help!`, { type: 'LISTENING' })
  if (message.author.bot) return;
  if (message.channel.type == 'dm') {
    message.channel.send("\`Sorry but i don't take DMs.\`")
    return;
  }
  if (client.op.get(message.guild.id) == undefined) {
    client.op.set(message.guild.id, {'chat':1});
  };

  //mute command
  var muteList = client.op.get('muted');
  var mute, i = 0;
  muteList.forEach(function(el){
    i++;
    if (el[0] == message.author.id){
      if (el[1] == message.channel.id) {
        mute = true;
        return;
      };
    };
  });
  if (mute == true){
    message.delete(500)
    return false;
  }

  //slow command
  var slow = client.op.get('slow');
  var slowIf, l = 0;
  slow.forEach(function(el){
    if (el[0] == message.channel.id) {
      slowIf = true;
      return;
    }
    l++;
  });
  if (slowIf == true) {
    if (client.slowTalk.has(message.author.id)){
      message.delete(500);
      return false;
    }
    let slowTime = slow[l][1] * 1000;
    client.slowTalk.add(message.author.id);
    setTimeout(() => {
      client.slowTalk.delete(message.author.id);
    }, slowTime);
  }
  
  let prefixes = [config.prefix, client.op.get(message.guild.id)[2]];
  let prefix;
  if (prefixes[1] == undefined) {
    prefix = prefixes[0]
  } else {
    prefix = prefixes[1]
  }

  if (!message.content.startsWith(prefix)) {
    let reply = require(`../other/reply.js`);
    let diner = require('../other/diner.js');
    reply.run(client, message);
    diner.run(client, message);
    if (prefix == client.op.get(message.guild.id)[2] && message.content === "v!help") {
      message.reply(`Remember, you changed the prefix to ${prefix}`);
    }
    return;
  }

  //command caller
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    let commandFile = require(`../commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (err.code == 'MODULE_NOT_FOUND') return console.log(`Command ${command} not found`)
    console.log(err);
  }
}
