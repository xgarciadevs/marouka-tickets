const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int) => {
  const req = int.customId.split('_')[0];
  client.emit('ticketsLogs', req, int.guild, int.member.user);

  switch (req) {
    case 'createTicket': {
      const selectMenu = new MessageSelectMenu()
        .setCustomId('newTicket')
        .setPlaceholder('Choose a reason for the ticket')
        .addOptions([
          {
            emoji: '🎟',
            label: 'Support',
            description: 'Ask for help from a staff member.',
            value: 'newTicket_Support'
          },
          {
            emoji: '🤝',
            label: 'Partner',
            description: 'Talk with a staff member about a partnership.',
            value: 'newTicket_Partnership'
          },
          {
            emoji: '❓',
            label: 'Other',
            description: 'Get help for another reason not listed.',
            value: 'newTicket_Other'
          },
        ]);

      const row = new MessageActionRow().addComponents(selectMenu);
      return int.reply({ content: 'Why will you be making this ticket?', components: [row], ephemeral: true });
    }

    case 'newTicket': {
      const reason = int.values[0].split('_')[1];
      const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

      if (!channel) {
        await int.guild.channels.create(`ticket-${int.member.id}`, {
          type: 'GUILD_TEXT',
          topic: `Ticket created by ${int.member.user.username} | Reason: ${reason ? ` (${reason})` : ''} | Date: ${new Date(Date.now()).toLocaleString()}`,
          permissionOverwrites: [
            {
              id: int.guild.id,
              deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
              id: int.member.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
              id: client.user.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }
          ]
        });

        const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

        const ticketEmbed = new MessageEmbed()
          .setColor('GREEN')
          .setDescription(`Welcome **${int.member.user.username}**, thanks for opening a ticket! One of our support team members will be with you shortly. To close the ticket, click the button below. Careful though, there is no confirmation!`);

        const closeButton = new MessageButton()
          .setStyle('DANGER')
          .setLabel('Close ticket')
          .setCustomId(`closeTicket_${int.member.id}`);

        const row = new MessageActionRow().addComponents(closeButton);
        await channel.send({ content: '|| <@&899438099665408000> ||', embeds: [ticketEmbed], components: [row] });
        return int.update({ content: `Your ticket was created! Visit it here: <#${channel.id}>\n|| <@${int.member.id}> ||`, components: [], ephemeral: true });
      } else {
        return int.update({ content: `You already have an open ticket <#${channel.id}>`, components: [], ephemeral: true });
      }
    }

    case 'closeTicket': {
      const channel = int.guild.channels.cache.get(int.channelId);

      await channel.edit({
        permissionOverwrites: [
          {
            id: int.guild.id,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          },
          {
            id: int.customId.split('_')[1],
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          },
          {
            id: client.user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          }
        ]
      });

      const ticketEmbed = new MessageEmbed()
        .setColor('RED')
        .setAuthor(`${int.member.user.username} has closed the ticket`)
        .setDescription('Use the buttons below to either reopen the ticket, save the ticket, or delete the ticket.');

      const reopenButton = new MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Reopen ticket')
        .setCustomId(`reopenTicket_${int.customId.split('_')[1]}`);

      const saveButton = new MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Save ticket')
        .setCustomId(`saveTicket_${int.customId.split('_')[1]}`);

      const deleteButton = new MessageButton()
        .setStyle('DANGER')
        .setLabel('Delete ticket')
        .setCustomId('deleteTicket');

      const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);
      return int.reply({ embeds: [ticketEmbed], components: [row] });
    }

    case 'reopenTicket': {
      const channel = int.guild.channels.cache.get(int.channelId);

      await channel.edit({
        permissionOverwrites: [
          {
            id: int.guild.id,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          },
          {
            id: int.customId.split('_')[1],
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          },
          {
            id: client.user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          }
        ]
      });

      const ticketEmbed = new MessageEmbed()
        .setAuthor(`Ticket was reopened`)
        .setColor('GREEN')
        .setDescription(`Welcome **${int.member.user.username}**, thanks for opening a ticket! One of our support team members will be with you shortly. To close the ticket, click the button below. Careful though, there is no confirmation!`);

      const closeButton = new MessageButton()
        .setStyle('DANGER')
        .setLabel('Close this ticket')
        .setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

      const row = new MessageActionRow().addComponents(closeButton);

      return int.reply({ embeds: [ticketEmbed], components: [row] });
    }

    case 'deleteTicket': {
      const channel = int.guild.channels.cache.get(int.channelId);
      return channel.delete();
    }

    case 'saveTicket': {
      const channel = int.guild.channels.cache.get(int.channelId);

      await channel.messages.fetch().then(async msg => {
        let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
          const date = new Date(m.createdTimestamp).toLocaleString();
          const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket owner)' : ''}`;

          return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
        }).reverse().join('\n');

        if (messages.length < 1) messages = 'There are no messages in this ticket... strange';
        const ticketID = Date.now();
        const stream = await createWriteStream(`./data/${ticketID}.txt`);

        stream.once('open', () => {
          stream.write(`User ticket ${int.customId.split('_')[1]} (channel #${channel.name})\n\n`);
          stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);
          stream.end();
        });
        stream.on('finish', () => int.reply({ files: [`./data/${ticketID}.txt`] }));
      });
    }
  }
};