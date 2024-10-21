const Discord = require("discord.js");
const config = require("../config.json")

exports.run = (client, message) => {
  const talk = client.talk
  let opS = client.op.get(message.guild.id);
  if (opS[0] == 0) return;

  const msg = message.content.toLowerCase();
  const args = msg.split(/ +/g);

  var bin = Math.round(Math.random());
  if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

  if (msg == 'im broke' || msg == 'i\'m broke') {
    message.reply("*Psst*  Don\'t say that out loud! The waiter might hear!");
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
  if (msg.includes('lol')) {
    let lol = ["Are you really laughing though?", "\"LAUGH OUT LOAD! HAHA SO FUNNY\" - MilesFM"]
    message.reply(lol[Math.floor(Math.random()*lol.length)]);
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
  if (msg.startsWith('kys')) {
    message.reply("I would prefer an honourable death by seppuku then die by a faceless internet coward's insults.");
  }
  if (msg.includes('good bot')) {
    message.reply("Aww, thanks! Oh you weren't talking to me...");
  }
  if (msg.includes('bad bot')) {
    message.reply("What did i do? Was it my multiple remarks about your breath?");
  }
  /*if (msg == 'no' || msg == 'yes') {
    let op = talk.get(diner);
    if (op != 0 && msg == 'no') return;
    message.reply("I don't think that was a yes or no question...");
  } */
  if (msg == 'it was') {
    message.reply("It was? Oh my bad...");
  }
  if (msg == 'maybe') {
    message.reply("Do you mean maybe-yes or maybe-no?");
  }
  if (msg == 'maybe-yes' || msg == 'maybe yes') {
    message.reply("Alright, I guess there's a 75% chance you'll do it then!");
  }
  if (msg == 'maybe-no' || msg == 'maybe no') {
    message.reply("Oh, really you don't believe it that much, only 25%?");
  }
  if (msg == 'dam') {
    message.reply('Ooh i know a good dam joke. \"Oh no, we\'ve got a damn hole! Geddit, a dam hole?\"');
  }
  if (msg == 'damn') {
    message.reply('Ooh, i know a good joke abo-- Oh wait wrong dam...');
  }
  if (msg.includes('yay')) {
    message.reply('YAY! :tada::tada: Wait, what are we celebrating?');
  }
  if (msg == 'shutup bot' || msg == 'shut up bot') {
    message.reply("Why don't you do back to your work and ignore me instead?");
  }
  if (msg == 'tru') {
    message.reply("You forgot the \'e\'");
  }
  if (msg == 'im lazy' || msg.startsWith('lazy')) {
    message.reply('Me too thanks');
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
  if (msg.includes("rip") || msg.includes('r.i.p')) {
    let rip = ["Rest in pepperonis!", "\"Rest in spaghetti never forgetti\" - No★Joe", "Press F to pay respects\n***F***"]
    message.reply(rip[Math.floor(Math.random()*rip.length)]);
  }
  if (msg == 'idk') {
    message.reply('I don\'t know either, nobody knows... Maybe we\'re all just pawns on a chess board, maybe we\'re destined for grateness, who knows... Lol that was cheesy. Geddit? Cheese, \'grateness\'!')
  }
  if (msg.startsWith('grated cheese')) {
    message.reply('I like pawns on the barbie board better...')
  }
  if (msg.includes('egg') && message.author.id == '245663367900037121' && msg != 'egg') {
    message.reply('That better not be an egg pun Mosh!')
  }
  if (msg.startsWith('meesa')) {
    message.reply('Meesa no like Jar Jar Binks...')
  }
  if (msg == 'what is this' || msg == 'what is this?') {
    message.reply('Madness it is!')
  }
  if (msg == 'shut up' || msg == 'shutup') {
    message.reply('*Ziiiiiip*. Mhhmmhhhhhh! \n 🤐 \n *Ziiiiiip*. Is that better?')
  }
}
