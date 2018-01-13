const config = require("../config.json")

exports.run = (client, message, args) => {
  var usr = [];
  if (message.author.id != config.ownerID) {
    message.channel.send("", {
  	file: "./assets/everyone.gif"
  	});
    return;
  }

  botusers(client, message, function(botuser){
    var peeps = message.channel.members.size - botuser
    message.channel.members.forEach(function(el){
      if (el.user.bot == true) return;
      usr.push(`<@${el.id}>`);
      if (usr.length == peeps) {
        usr = usr.join(" ");
        message.channel.send("Hey Listen!!! @everyone")
        message.channel.send(usr)
      }
    });
  })
}

exports.help = {
	name: "TMP",
	category: "System",
	description: "TMP",
	usage: "\`tmp\`"
}

function botusers(client, message, callback) {
  let i = 0;
  var botuser = 0;
  message.channel.members.forEach(function(el){
    i++;
    if (el.user.bot == true) {
      botuser++;
      return;
    }
    if (i == message.channel.members.size) {
      callback(botuser)
    }
  });
}
