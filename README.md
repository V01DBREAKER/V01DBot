# V01DBot

A Discord Bot for personal use, 
Based on: https://discordjs.guide/creating-your-bot

Archived version runs on discord.js v11.5.1
Which was based on a guide that i can no longer find online...

## How to use:

Install the dependencies: `npm install`

Write a config.json file:
```json
{
    "token": "BOT_TOKEN",
    "clientId": "BOT_ID",
    "acceptedGuilds": ["GUILD_ID", "GUILD_ID_2"],
    "ownerId": "OWNER_ID"
}
```
Register the slash commands: `npm run deploy` \
Run the bot: `npm run app` \
(Can run the following two for the first time using `npm run main`)