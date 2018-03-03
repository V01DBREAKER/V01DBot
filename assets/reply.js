const Discord = require("discord.js");
const config = require("../config.json")
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

const talkS = new EnmapLevel({name: "talk"});
const talk = new Enmap({provider: talkS});

exports.run = (client, message) => {
  let opS = client.op.get(message.guild.id);
  if (opS == 0) return;

  const diner = message.author.id;
  const ser = message.guild.id;
  const msg = message.content.toLowerCase();
  const args = msg.split(/ +/g);

  if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

  if (msg === 'hi' || msg === 'hey' || msg === 'hoi' || msg === 'hello') {
    message.reply(`Heyo what is up!\nWelcome to ${message.guild.name}\'s Diner!\nWhat would you like today sir/madam?\nWe have pasta or a burger on special today.`);
    message.reply('\`Psst, if you don\'t want a meal, just say no thankyou\`')
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
  if (msg === 'no' || msg === 'no thankyou' || msg === 'no thanks' || msg === 'no thank you') {
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
      message.channel.send(`***Bill***\n.\n.\nTotal Cost: $15.50`);
      message.reply("That will be $15.50\nThankyou sir/madame.\nHave a nice day, come back next time!");
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
      message.reply("That will be $15.50\nThankyou sir/madame.\nIt wasn't much! \`More Food Wars References\`");
      message.channel.send("Chef, use the diner's catchphrase, not your own!");
      talk.set(diner, "0");
    }
    if (op == 4) {
      message.reply("That's 4 dollars, for that whisky.\nThat's my family home brewed whisky, the crunchy bits add flavour!.");
      talk.set(diner, "0");
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
  if (msg == 'gtg' || msg == 'bye') {
    message.reply("Thankyou come again! - Apu");
  }
  if (msg == 'brb' || msg == 'i\'ll be back') {
    message.reply("Are you back yet?");
  }
  if (msg == 'omg' || msg == 'oh my god') {
    message.reply("Don't use the lord's name in vain!");
  }
  if (msg == 'lol') {
    message.reply("Are you really laughing though?");
  }
  if (msg == 'ik') {
    message.reply("You know, saying \`ik\` instead of \`I know\` makes it sound like you don't actually know.");
  }
  if (msg == 'np') {
    message.reply("Does that mean nope or no problem?");
  }
  if (msg == 'imao' || msg == 'lmao') {
    message.reply("Oh no! Your butt just fell off!");
  }
  if (msg == 'ikr') {
    message.reply("Sorry but i don't know what being right is, please explain.");
  }
  if (msg == 'kys' || msg == 'kys bot') {
    message.reply("I would prefer an honourable death by seppuku then die by a faceless internet coward's insults.");
  }
  if (msg == 'good bot') {
    message.reply("Aww, thanks! Oh you weren't talking to me...");
  }
  if (msg == 'bad bot') {
    message.reply("What did i do? Was it my multiple remarks about your breath?");
  }
  if (msg == 'no' || msg == 'yes') {
    message.reply("I don't think that was a yes or no question...");
  }
  if (msg == 'it was') {
    message.reply("It was? Oh my bad...");
  }
  if (msg == 'maybe') {
    message.reply("Do you mean maybe-yes or maybe-no?");
  }
  if (msg == 'dam') {
    message.reply('Ooh i know a good dam joke. \"Oh no, we\'ve got a damn hole! Geddit, a dam hole?\"');
  }
  if (msg == 'damn') {
    message.reply('Ooh, i know a good joke abo-- Oh wait wrong dam...');
  }
  if (msg == 'yay') {
    message.reply('YAY! :tada::tada: Wait, what are we celebrating?');
  }
  if (msg == 'shutup bot') {
    message.reply("Why don't you do back to your work and ignore me instead?");
  }
  if (msg == 'tru') {
    message.reply("You forgot the \'e\'");
  }
  if (msg == 'im lazy' || msg.startsWith('lazy')) {
    message.reply('Welcome to the LAZY CLUB111');
    message.reply('Whoops couldn\'t be bothered holding shift...');
  }
  if (msg == 'xd') {
    message.reply('Giggle Giggle');
  }
  if (msg == 'punish bot') {
    message.reply(`Ow! That hurt, that behaviour is not tolerated at ${message.guild.name} server, ${message.guild.id.slice(0, 4)}.`);
  }
  if (msg == 'fyi') {
    message.reply('I already know everything, don\'t bother.');
  }
  if (msg == 'hw' || msg.startsWith('homework')) {
    message.reply('If you don\'t do your homework, that\'ll be a synergetic!');
  }
}
