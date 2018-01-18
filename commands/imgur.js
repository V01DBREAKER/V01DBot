const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const cheerio = require('cheerio');

exports.run = (client, message, args) => {
	if(args.length < 1) return message.reply("Please enter a search value.")
	var imgs = [];
  var search = args.toString();
	search = search.replace(/,/g, " ");
	search = search.replace(/ /g, "+");
	var url = `https://imgur.com/search?q=${search}`;
	request(url, function(err, response, body) {
		if(err) {
            console.log(err);
            return message.reply('Error getting Imgur search results.');
        }
		$ = cheerio.load(body);
		var results = $('span[class=sorting-text-align]').children('i').text();
		results = results.replace(/,/g, "");
		if(results < 5) {
			console.log(`No results found for ${search}.`);
			return message.reply("No results found.");
		} else {
			message.channel.send(`${results} results found.\nDisplaying 5 results.`);
			var Mresults = $('a[class=image-list-link]').children().map(function(i, el) {
				return $(this).attr('src');
			}).get().join(' ').replace(/\/\//g, "https://").split(" ").slice(1, 6);
			let x = 0;
			for(; x < 5; x++);
			{
				Mresults[x] = Mresults[x].replace('b.', '.');
			}
			Mresults.forEach(function(el,i) {
				message.channel.send(Mresults[i]);
			});
			console.log(`Sent imgur results to ${message.author.username} at ${message.guild.name}`);
		};
	});
}

exports.help = {
	name: "Imgur",
	category: "Search",
	description: "Search imgur for up to 5 of your favourite images.",
	usage: "\`imgur [search]\`"
}
