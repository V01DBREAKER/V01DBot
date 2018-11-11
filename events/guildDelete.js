const fs = require("fs");

exports.run = (client, guild) => {
	console.log(`${guild.name}:${guild.id} was deleted or left, deleting all data now...`)
	let guildOp = client.op.get(guild.id)
	if (guildOp != undefined){
		client.op.delete(guild.id);
		console.log("Data deleted...")
	} else {
		console.log("No data found...")
	}

}
