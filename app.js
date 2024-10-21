const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const { acceptedGuilds, token, ownerId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// for music playing
client.music = new Collection();
for (const guild of acceptedGuilds) {
    client.music.set(guild, null)
}

// load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

//const commandFolder = fs.readdirSync(commandsPath);
//for (const folder of commandFolders) { 
	//const commandsPath = path.join(foldersPath, folder);
    
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// load each command in folder
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// client is loaded event
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// run commands
client.on(Events.InteractionCreate, async interaction => {
    // https://discord.js.org/docs/packages/discord.js/main/ChatInputCommandInteraction:Class
    if (!interaction.isChatInputCommand()) return;
    if (!acceptedGuilds.includes(interaction.guildId)) return;

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) return;
    if (command.isAdmin && interaction.member.id != ownerId) return;
    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);