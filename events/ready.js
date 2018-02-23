const fs = require("fs");

exports.run = (client) => {
	console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);

	let g = [];
	client.guilds.forEach(function(el){
    g.push(el.name);
		if (g.length == client.guilds.size) {
			console.log(`Guilds:  ${g.join(' | ')}`);
		}
  });

	fs.readdir("./commands/", (err, files) => {
			if (err) return console.error(err);
			let i = 0;
			var cmd = {};
			files.forEach(file => {
				if (!file.endsWith(".js")) return;
				let command = require(`../commands/${file}`);
				cmd[i] = [command.help.name, command.help.category, command.help.description, command.help.usage];
				i++;
				if (files.length == i + 1){
					var json = JSON.stringify(cmd);
					fs.writeFile('../../../../../var/www/v01dbreaker.zapto.org/public_html/V01DBot/cmdDetail.json', json, (err) => {
  					if (err) throw err;
  					console.log('The command list has been updated!');
					});
				};
			});
		});
}
