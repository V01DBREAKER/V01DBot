const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	if(message.author.id !== config.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

exports.help = {
	name: "Eval",
	category: "System",
	description: "Evaluate Javascript, Owner ONLY!",
	usage: "\`eval [code]\`"
}
