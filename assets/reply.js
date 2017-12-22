const Discord = require("discord.js");
const config = require("../config.json")

var food = ['pasta', 'burger']

exports.run = (client, message) => {
  const msg = message.content.toLowerCase();
  const args = msg.split(/ +/g);

  if (msg === 'hi' || msg === 'hey' || msg === 'hoi' || msg === 'hello') {
    message.reply(`Heyo what is up!\nWelcome to ${message.guild.name}\'s Diner!\nWhat would you like today sir/madam?\nWe have ${food[0]} or a ${food[1]} on special today.`)
  }
  if (msg === food[0]) {
    message.channel.send("Chef, we have a pasta order at table 4")
    message.reply("Well, imma make a the pasta for you today! \`A Lord Pos Pos Quote\`")
    message.channel.send("**Sizzle**, *Sizzle*")
    message.channel.send("No pasta is complete without wine!\n*Splosh*")
    message.reply("All done sir, enjoy your meal.\nCareful, it's hot!")
    message.channel.send("\`Psst, if you\'re finished eating, call the waiter or chef up!\`")
  }
  if (msg === food[1]) {
    message.reply("Well i see, i burger...\nNo probs, coming right up.")
    message.channel.send("Woah we get to see Chef V01D cook today - Crowd \`Anime References - Food Wars\`")
    message.reply("Here's the burger, and you can't have one of my meals without wine!")
    message.channel.send("Aren't we on a budget Chef? - Staff \`More Food Wars References\`")
    message.reply("But this burger gotta be accompanied with some wine!\nDig in good sir/madame")
    message.channel.send("\`Psst, if you\'re finished eating, call the waiter or chef up!\`")
  }
  if (msg == 'waiter' || msg == 'waiter!') {
    message.reply("Ah sir/madame, i see you've finished the meal, i'll bring your bill to you")
    message.channel.send(`***Bill***\n.\n.\nTotal Cost: $15.50`)
    message.reply("That will be $15.50\nThankyou sir/madame.\nHave a nice day, come back next time!")
  }
  if (msg == 'chef' || msg == 'chef!') {
    message.reply("Ah sir/madame, i see you've finished the meal, hopefully you've enjoyed it.\nDid you like the wine? Don't worry it was on the house.")
    message.channel.send(`***Bill***\n.\n.\nTotal Cost: $15.50`)
    message.reply("That will be $15.50\nThankyou sir/madame.\nIt wasn't much! \`More Food Wars References\`")
    message.channel.send("Chef, use the diner's catchphrase, not your own!")
  }
  if (msg == 'gtg' || msg == 'bye') {
    message.reply("Thankyou come again! - Apu")
  }
  if (msg == 'brb' || msg == 'i\'ll be back') {
    message.reply("See you around kid - Han Solo")
  }
  if (msg == 'omg' || msg == 'oh my god') {
    message.reply("Don't use the lord's name in vain!")
  }
  if (msg == 'lol') {
    message.reply("Are you really laughing though?")
  }
  if (msg == 'ik') {
    message.reply("You know, saying \`ik\` instead of \`I know\` makes it sound like you don't actually know.")
  }
}
