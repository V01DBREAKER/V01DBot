const Discord = require('discord.js');
const { formatTime } = require('./utility')

const MAX_RESPONSE_MS = 60_000;

/**
 * Creates buttons for the menu
 * 
 * @param {number} pageNum - Page number
 * @param {number} itemNum - Total number of discs
 * @returns {Discord.ActionRowBuilder}
 */
function menuButtons(pageNum, itemNum) {
    // each page has 5 items
    const prev = new Discord.ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel('Prev')
        .setCustomId('prev')
    const next = new Discord.ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel('Next')
        .setCustomId('next');
    const page = new Discord.ButtonBuilder()
        .setEmoji('📄')
        .setStyle(Discord.ButtonStyle.Primary)
        .setCustomId('page')
        .setDisabled(true);
    if (pageNum < 2) {
        prev.setDisabled(true);
    }
    if (pageNum * 5 >= itemNum){
        next.setDisabled(true);
    }
    page.setLabel(`Page: ${pageNum}/${Math.ceil(itemNum/5)}`);
    return new Discord.ActionRowBuilder().addComponents(prev, next, page);
}

/**
 * Converts an array of discs into an array of embeds
 * 
 * @param {number} page 
 * @param {[Disc]} playlist 
 * @param {boolean} list - If it is a array of playlist discs
 * @returns {[Discord.Embed]}
 */
function menuEmbed(page, playlist, list){
    return playlist.map((disc, i) => ({
        title: `${(5*(page-1)) + i + 1}. ` + disc.title,
        description: list ? `By *${disc.author}*\n**Tracks:** ${disc.length}` : `By *${disc.author}*\n**Duration:** ${formatTime(disc.length)}`,
        thumbnail: {url: disc.thumbnail}
    })) 
}

/**
 * Builds a selector for the menu
 * 
 * @param {number} page - The page number
 * @param {[Disc]} playlist - The discs to choose frome
 * @param {boolean} multi - If multiple selections are allowed
 * @returns {Discord.ActionRowBuilder}
 */
function menuSelector(page, playlist, multi){
    return new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choose a disc!')
            .setMinValues(1)
            .setMaxValues(multi ? 5 : 1) // disable multiple choices if not multi
            .addOptions(playlist.map((disc, i) => 
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(`${(5*(page-1)) + i + 1}. ` + disc.title.slice(0, 25) + "...")
                    .setValue(`${(5*(page-1)) + i}`)
    )));
}

/**
 * Handles the menu options for the jukebox, displays 5 discs at a time.
 * 
 * @param {Discord.ChatInputCommandInteraction} interaction - The interaction that triggered the menu
 * @param {(page: number)=>[Disc]} getDiscs - Function to get the next page of discs
 * @param {number} length - Number of discs to display in menu
 * @param {string} msg - Message to display before menu
 * @param {boolean} select - Whether to enable disc selection
 * @param {boolean} [list=false] - Whether it is a playlist menu or track menu 
 * @returns {Discord.StringSelectMenuInteraction | null} - Will return the disc selected if available
 */
async function menu(interaction, getDiscs, length, msg, select, list = false){
    const discs = getDiscs(1);
    const content = "**" + length + "** *" + msg + "*";
    const components = [menuButtons(1, length)];
    if (select) components.unshift(menuSelector(1, discs, !list));
    const res = await interaction.editReply({content: content, embeds: menuEmbed(1, discs, list), components: components});

    /**
     * Handles responses to buttons for the menu
     * @param {Discord.InteractionResponse} response 
     * @param {number} page 
     * @returns {null | Discord.StringSelectMenuInteraction}
     */
    async function buttonReplier(response, page){
        const songMsg = "**" + length + "** *" + msg + "*";
        try {
            const confirmation = await response.awaitMessageComponent({ time: MAX_RESPONSE_MS });
            if (confirmation.customId === 'prev') {page -= 1}
            else if (confirmation.customId === 'next') {page += 1}
            else if (confirmation.customId === 'select') {return confirmation}
            const discs = getDiscs(page);
            const components = [menuButtons(page, length)];
            if (select) components.unshift(menuSelector(page, discs, list));
            const res = await confirmation.update({content: songMsg, embeds: menuEmbed(page, discs, list), components: components});
            return buttonReplier(res, page);
        } catch (e) { // when out of time update buttons
            const pageButton = new Discord.ButtonBuilder()
                .setEmoji('📄')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel(`Page: ${page}/${Math.ceil(length/5)}`)
                .setCustomId('page')
                .setDisabled(true);
            const buttons = new Discord.ActionRowBuilder()
                .addComponents(pageButton);
            const discs = getDiscs(page);
            await interaction.editReply({content: songMsg, embeds: menuEmbed(page, discs, list), components: [buttons] });
            return null;
        }
    }
    return buttonReplier(res, 1);
}

module.exports = {
    menu
}