const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'setup',
  execute(client, message) {
    if (message.author.id !== '528637169544331291') return message.reply('Lol, only the owner can run this command');

    const setupEmbed = new MessageEmbed()
      .setTitle('<:ticket:914724126655135794> Create a Ticket')
      .setColor('PURPLE')
      .setDescription('To create a ticket, click on the button below!');

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
