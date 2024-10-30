const Discord = require("discord.js");
const config = require("../config.json")
const Enmap = require('enmap');

exports.run = (client, message) => {
  const talk = client.talk;

  let opS = client.op.get(message.guild.id);
  if (opS[0] == 0) return;

  const diner = message.author.id;
  const ser = message.guild.id;
  const msg = message.content.toLowerCase();
  const args = msg.split(/ +/g);

  var bin = Math.round(Math.random());
  if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

  if (msg === 'hi' || msg === 'hey' || msg === 'hoi' || msg === 'hello') {
    message.reply(`Heyo what is up!\nWelcome to ${message.guild.name}\'s Diner!\nWhat would you like today sir/madam?`);
    message.channel.send("***Menu*** \n Pizza\n Burger\n Pasta\n*Free Wine with any Purchase*");
    message.reply('\`Psst, if you don\'t want a meal, just say no thankyou\`');
    talk.set(diner, "1");
  }
  if (msg === 'pasta') {
      let op = talk.get(diner);
    if (op != 1) return;
    message.channel.send("Chef, we have a pasta order at table 4");
    message.reply("Well, imma make a the pasta for you today! \`A Lord Pos Pos Quote\`");
    message.channel.send("**Sizzle**, *Sizzle*");
    message.channel.send("No pasta is complete without wine!\n*Splosh*");
    message.reply("All done sir, enjoy your meal.\nCareful, it's hot!");
    message.channel.send("\`Psst, if you\'re finished eating, call the waiter or chef up!\`");
    talk.set(diner, "2");
  }
  if (msg === 'burger') {
    let op = talk.get(diner);
    if (op != 1) return;
    message.reply("Well i see, i burger...\nNo probs, coming right up.");
    message.channel.send("Woah we get to see Chef V01D cook today - Crowd \`Anime References - Food Wars\`");
    message.reply("Here's the burger, and you can't have one of my meals without wine!");
    message.channel.send("Aren't we on a budget Chef? - Staff \`More Food Wars References\`");
    message.reply("But this burger gotta be accompanied with some wine!\nDig in good sir/madame");
    message.channel.send("\`Psst, if you\'re finished eating, call the waiter or chef up!\`");
    talk.set(diner, "2");
  }
  if (msg === 'pizza') {
    let op = talk.get(diner);
    if (op != 1) return;
    message.reply("Sorry but since our pizza menu is still under construction, there\’s only margarita pizza, hope you don’t mind");
    message.channel.send("Chef, we have a pizza order at table 4");
    message.reply("Spinning the pizza now!");
    message.channel.send("**Splat!**");
    message.channel.send("Oops, no one will notice that it hit the ceiling. It\’ll just add to the flavour!");
    message.channel.send("*Sizzle, pop, sizzle*");
    message.reply("All done sir, enjoy your meal \nCareful, it\'s hot!");
    message.channel.send("\`Psst, if you\'re finished eating, call the waiter or chef up!\`");
    talk.set(diner, "2");
  }
  if (msg === 'no' || msg === 'no thankyou' || msg === 'no thanks' || msg === 'no thank you' || msg === 'no thx') {
    let op = talk.get(diner);
    if (op == 1) {
      message.reply("Would you like a drink instead, sir/madame?");
      message.channel.send("Whisky is liquid sunshine. \`- George Bernard Shaw\`");
      message.reply("We have Whisky, water or juice");
      message.reply("\`Psst, if you don't want a drink just say so!\`");
      talk.set(diner, "3");
    } else if (op == 3) {
      message.reply("Why are you here if you don't want anything thing from our diner?\nOh you're waiting for friends, sorry...\nWell just say hi when your friends get here!");
      talk.set(diner, "0");
    }
  }
  if (msg == 'whisky') {
    message.reply("Sure thing mate, don't drink too much!");
    message.channel.send("\`Psst, if you\'re finished drinking, call the waiter or chef up!\`");
    talk.set(diner, "4");
  }
  if (msg == 'juice') {
    message.reply("We mainly serve this to little kids, but sure...");
    message.channel.send("\`Psst, if you\'re finished drinking, call the waiter or chef up!\`");
    talk.set(diner, "5");
  }
  if (msg == 'water') {
    message.reply("Ah yes, plain old water, the basis for any drink...\nAre you sure you don't want any flavour with that?\nNo? Alright");
    message.channel.send("\`Psst, if you\'re finished drinking, call the waiter or chef up!\`");
    talk.set(diner, "6");
  }
  if (msg == 'waiter' || msg == 'waiter!') {
    let op = talk.get(diner);
    if (op == 2) {
      message.reply("Ah sir/madame, i see you've finished the meal, i'll bring your bill to you");
      message.channel.send(`***Bill***\n.\n.\nTotal Cost: $15`);
      message.reply("That will be $15\nThankyou sir/madame.\nHave a nice day, come back next time!");
      talk.set(diner, "0");
    }
    if (op == 4) {
      message.reply("That's 4 dollars, for that whisky.\nHave a nice day, don't drink and drive!");
      talk.set(diner, "0");
     }
    if (op == 5) {
      message.reply("Enjoyed the juice? Its 2 dollars.\nHave a nice day kiddo!");
      talk.set(diner, "0");
      }
    if (op == 6) {
      message.reply("Well you came for water during peak hour. *sigh*\nSorry, but i'll have to charge you a dollar service fee.\nMy boss is cheap...");
      talk.set(diner, "0");
    }
  }
  if (msg == 'chef' || msg == 'chef!') {
    let op = talk.get(diner);
    if (op == 2) {
      message.reply("Ah sir/madame, i see you've finished the meal, hopefully you've enjoyed it.\nDid you like the wine? Don't worry it was on the house.");
      message.reply("That will be $15\nThankyou sir/madame.\nIt wasn't much! \`More Food Wars References\`");
      message.channel.send("Chef, use the diner's catchphrase, not your own!");
      talk.set(diner, "0");
    }
    if (op == 4) {
      message.reply("That's 4 dollars, for that whisky.\nThat's my family home brewed whisky, the crunchy bits add flavour!.");
    }
    if (op == 5) {
      message.reply("Enjoyed the juice? Its 2 dollars.\nSee you around kiddo. \`- Han Solo\`");
      talk.set(diner, "0");
    }
    if (op == 6) {
      message.reply("Well you came for water during peak hour. I'll have to charge you as a service fee.\nWe're in debt right now...");
      talk.set(diner, "0");
    }
  }
}