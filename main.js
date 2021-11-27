const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');

global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.config = require('./config');
client.commands = new Collection();

const events = readdirSync('./events/').filter(file => file.endsWith('.js'));
const commands = readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of events) {
  const event = require(`../events/${file}`);
  client.on(file.split('.')[0], event.bind(null, client));
  delete require.cache[require.resolve(`../events/${file}`)];
};

for (const file of commands) {
  const command = require(`../commands/${file}`);
  client.commands.set(command.name.toLowerCase(), command);
  delete require.cache[require.resolve(`../commands/${file}`)];
};

client.login(client.config.dsc.token);