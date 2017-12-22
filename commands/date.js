exports.run = (client, message, args) => {
	if(args.length > 1) return
	message.channel.send(`Tick Tock! :clock3: ${new Date()}`)
	.then(msg => console.log(`Sent time and date to ${msg.author}`))
}

exports.help = {
	name: "Date",
	category: "Search",
	description: "Display the current time and date.\n(AEST time)",
	usage: "\`date\`"
}