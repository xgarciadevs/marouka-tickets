const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'setup',
  execute(client, message) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('You need to have the **manage messages** permission to use this command ❌');

    const setupEmbed = new MessageEmbed()
      .setColor('PURPLE')
      .setDescription('**Click on the button below to create a ticket!**');

    const ticketButton = new MessageButton()
      .setEmoji('🔓')
      .setStyle('SUCCESS')
      .setLabel('Open a ticket')
      .setCustomId('createTicket')

    const row = new MessageActionRow().addComponents(ticketButton);
    message.delete();
    message.channel.send({ embeds: [setupEmbed], components: [row] });
  },
};
