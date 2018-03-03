const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const hsltorgb = require("hsl-to-hex");

exports.run = (message, roleR) => {
  let i = 0;
  var intRain = setInterval(function(){
    role = message.guild.roles.get(roleR);
    var colour = hsltorgb(i, 100, 50);
    role.edit({color:colour})
    i = i + 50;
  }, 250);
  setTimeout(function(){clearInterval(intRain)}, 10000)
}
