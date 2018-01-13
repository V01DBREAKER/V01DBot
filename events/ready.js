exports.run = (client) => {
	console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	console.log("Guilds:")
	client.guilds.forEach(function(el){
    console.log(el.name);
  })
}
