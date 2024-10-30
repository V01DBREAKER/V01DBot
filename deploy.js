// script used to deploy slash commands to discord
const { REST, Routes } = require('discord.js');
const { clientId, acceptedGuilds, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const adminCommands = [];
const commandsPath = path.join(__dirname, 'commands');

//const commandFolders = fs.readdirSync(foldersPath);
//for (const folder of commandFolders) {
	//const commandsPath = path.join(foldersPath, folder);

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command.isAdmin) {
        adminCommands.push(command.data.toJSON());
    } else {
        commands.push(command.data.toJSON());
		/*if (command.aliases) {
			for (const alias of command.aliases){
				const aliasData = command.data
				aliasData.setName(alias)
				commands.push(aliasData.toJSON());
			}
		}*/
    }
}


const rest = new REST().setToken(token);
// deploy commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        console.log(`Started refreshing admin (/) commands.`);
        const adminData = await rest.put(
			Routes.applicationGuildCommands(clientId, acceptedGuilds[0]),
			{ body: adminCommands },
		);
        console.log(`Successfully reloaded ${adminData.length} admin (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();