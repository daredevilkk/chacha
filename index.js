require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
    
});
const messageEvent = require('./events/roleName');
const interactionEvent = require('./events/info');
const joinEvent = require('./events/guildMemberAdd');
const newinfo = require('./events/nowinfo');
const leaderboard = require('./events/showLevel');
const rolemanage= require('./events/roleManage');
client.on(rolemanage.name, (...args)=>{
    rolemanage.execute(...args);
})
client.on(leaderboard.name, member => {
 leaderboard.execute(member);
});
client.on(newinfo.name, member => {
  newinfo.execute(member);
});
client.on(joinEvent.name, member => {
    joinEvent.execute(member);
});
client.on(messageEvent.name, (...args) => {
    messageEvent.execute(...args);
});

client.on(interactionEvent.name, (...args) => {
    interactionEvent.execute(...args);
});
client.once('ready', () => {
    console.log(`Chacha is online!`);

    setInterval(async () => {

    const guild = client.guilds.cache.first();

    await guild.members.fetch();

    guild.members.cache.forEach(member => {
        console.log(member.user.username);
    });

}, 60000);
});

client.on('messageCreate', message => {

    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('Pong!');
    }
    if (message.mentions.has(client.user)) {
    message.reply(`Hello ${message.author.username}! 👋`);
}
});

client.login(process.env.TOKEN);