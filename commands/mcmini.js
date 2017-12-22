exports.run = (client, message, args) => {
	const Discord = require("discord.js");
	var skin;
	var size;
	var border;
	if(args.length < 1) {
		message.reply('Please enter a username.');
	} else {
		if (args[1] == undefined) {
			skin = "classic";
		} else if (args[1] == "tall" || args[1] == "classic" || args[1] == "face" || args[1] == "round" || args[1] == "default") {
			skin = args[1]
		} else {
			message.reply("Type unknown...");
			return;
		};
		if (args[2] == undefined) {
			size = "80";
		} else if (args[2] == "20" || args[2] == "40" || args[2] == "60" || args[2] == "80" || args[2] == "90" || args[2] == "100") {
			size = args[2]
		} else {
			message.reply("Size unknown...");
			return;
		};
		if (args[3] == undefined) {
			border = "2";
		} else if (args[3] == "1" || args[3] == "2" || args[3] == "3" || args[3] == "4") {
			border = args[3];
		} else {
			message.reply("Border size unknown...")
			return;
		}
		const embed = new Discord.RichEmbed()
			.setTitle(args[0])
			.setAuthor(client.user.username, client.user.avatarURL)
			.setColor(0x00AE86)
			.setDescription("Generated Using www.minecraftskinavatar.com")
			.setFooter("Created by V01DBREAKER", client.user.avatarURL)
			.setImage(`http://avatar.yourminecraftservers.com/avatar/source/minecraft/background/trnsp/notFound/steve/figure/${skin}/figureSize/${size}/borderSize/${border}/borderColor/%23000000/canvasSize/256/${args[0]}.png`)
			.setThumbnail(`https://www.minecraftskinstealer.com/face.php?u=${args[0]}`)
			.setTimestamp()
			.setURL(`http://minecraftskinavatar.com/en/customize?id=${args[0]}&source=minecraft`)
			message.channel.send({embed});
			console.log(`Sent ${message.author.username} at ${message.guild.name} Minecraft user avatar ${args[0]}`);
		};
}

exports.help = {
	name: "McMini",
	category: "Search",
	description: "Search for a Minecraft user's Minime",
	usage: "\`mcmini [username] type:[tall/classic/face/round/default] size:[20/40/60/80/90/100] border:[1/2/3/4]\`"
}