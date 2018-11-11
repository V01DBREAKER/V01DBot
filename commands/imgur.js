const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const cheerio = require('cheerio');
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	if(args.length < 1) {
		message.reply("Please enter a search value.");
		return;
	};
	var imgs = [];
  var search = args.toString();
	search = search.replace(/,/g, " ");
	search = search.replace(/ /g, "+");
	var url = `https://imgur.com/search?q=${search}`;
	request(url, function(err, response, body) {
		if(err) {
      console.log(err);
      message.reply('Error getting Imgur search results.');
			return;
    }
		$ = cheerio.load(body);
		var results = $('span[class=sorting-text-align]').children('i').text();
		results = results.replace(/,/g, "");
		if(results < 5) {
			console.log(`No results found for ${search}.`);
			message.reply("No results found.");
			return;
		} else {
			message.channel.send(`${results} results found.\nDisplaying 5 results.`);
			var Mresults = $('a[class=image-list-link]').children().map(function(i, el) {
				return $(this).attr('src');
			}).get().join(' ').replace(/\/\//g, "https://").split(" ").slice(1, 6);
			let x = 0;
			for(; x < 5; x++)
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
