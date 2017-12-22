exports.run = (client, message, args) => {
	if(args.length > 1) return
	message.reply('What the frick did you just fricking say about me, you little frick? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Qaeda, and I have over 300 confirmed kills. I am trained in guerrilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the frick out with precision the likes of which has never been seen before on this Earth, mark my fricking words. You think you can get away with saying that frick to me over the Internet? Think again, fricker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fricking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable frick off the face of the continent, you little frick. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fricking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you frick idiot. I will frick fury all over you and you will drown in it. You’re fricking dead, kiddo.')
	console.log(`Fricked the heck out of ${message.author.username} at ${message.guild.name}`);
}

exports.help = (client, message, args) => {
	message.channel.send({embed: {
		color: 3447003,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Frick",
		url: "http://v01dbreaker.comlu.com/V01DBot",
		fields: [{
				name: "Category",
				value: "Fun"
				},
				{
				name: "Description",
				value: "The navyseal copypasta at your fingertips, swearless."
				},	
				{
				name: "Usage",
				value: "\`frick\`"
				}
				],
		footer: {
			icon_url: client.user.avatarURL,
			text: "Created by V01DBREAKER"
		}
	}
	});
}

exports.help = {
	name: "Frick",
	category: "Fun",
	description: "The navyseal copypasta at your fingertips, swearless.",
	usage: "\`frick\`"
}