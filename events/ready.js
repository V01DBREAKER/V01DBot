exports.run = (client) => {
	console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	let g = [];
	client.guilds.forEach(function(el){
    g.push(el.name);
		if (g.length == client.guilds.size) {
			console.log(`Guilds:  ${g.join(' | ')}`);
		}
  });
}
