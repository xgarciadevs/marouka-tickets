const { MessageEmbed } = require('discord.js');

module.exports = (client, type, guild, user) => {
  switch (type) {
    case 'newTicket': {
      let newTicket = new MessageEmbed()
        .setTitle('Ticket Created')
        .setColor('GREEN')
        .setDescription(`**${user.username}** created a ticket`)

      return client.guilds.cache.get('899435249191239730').channels.cache.get('914053598588063754').send({ embeds: [newTicket] })
    }

    case 'closeTicket': {
      let newTicket = new MessageEmbed()
        .setTitle('Ticket Closed')
        .setColor('RED')
        .setDescription(`**${user.username}** closed a ticket`)

      return client.guilds.cache.get('899435249191239730').channels.cache.get('914053598588063754').send({ embeds: [newTicket] })
    }

    case 'reopenTicket': {
      let newTicket = new MessageEmbed()
        .setTitle('Ticket Reopened')
        .setColor('YELLOW')
        .setDescription(`**${user.username}** reopened a ticket`)

      return client.guilds.cache.get('899435249191239730').channels.cache.get('914053598588063754').send({ embeds: [newTicket] })
    }

    case 'deleteTicket': {
      let newTicket = new MessageEmbed()
        .setTitle('Ticket Deleted')
        .setColor('DARK_RED')
        .setDescription(`**${user.username}** deleted a ticket`)

      return client.guilds.cache.get('899435249191239730').channels.cache.get('914053598588063754').send({ embeds: [newTicket] })
    }

    case 'saveTicket': {
      let newTicket = new MessageEmbed()
        .setTitle('Ticket Saved')
        .setColor('BLUE')
        .setDescription(`**${user.username}** saved a ticket`)

      return client.guilds.cache.get('899435249191239730').channels.cache.get('914053598588063754').send({ embeds: [newTicket] })
    }
  }
};