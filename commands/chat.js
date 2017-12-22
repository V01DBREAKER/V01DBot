exports.run = (client, message, args) => {
  let op = client.op.get(message.guild.id);
  if (op == 1) {
    client.op.set(message.guild.id, 0);
    message.reply("Bot chat disabled.")
  } else {
    client.op.set(message.guild.id, 1);
    message.reply("Bot chat enabled.")
  }
}

exports.help = {
	name: "Chat",
	category: "System",
	description: "Disable or enable bot chat function; Default = Disabled",
	usage: "\`chat\`"
}
