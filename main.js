const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');

global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.config = require('./config');
client.commands = new Collection();

fs.readdirSync('./commands').forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  if (!command.aliases) return;
  command.aliases.forEach((alias) => {
    client.aliases.set(alias, command);
  });
});

fs.readdirSync('./events').forEach(file => {
  const event = require(`./events/${file}`);
  client.on(file.split('.')[0], event.bind(null, client));
});

client.login(client.config.dsc.token);