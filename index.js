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
const CO_OWNER_ROLE_ID = '1254480825487982774';

const LINKS_CHANNEL_ID1 = '1513663478349697234';
const LINKS_CHANNEL_ID2 = '1513663658687987864';
const LINKS_CHANNEL_ID3 = '1513663865412522106';
const LINKS_CHANNEL_ID4 = '1513663926192050346';
const messageEvent = require('./events/roleName');
const interactionEvent = require('./events/info');
const joinEvent = require('./events/guildMemberAdd');
const newinfo = require('./events/nowinfo');
const leaderboard = require('./events/showLevel');
const rolemanage= require('./events/roleManage');
const linkApproval = require('./events/linkApproval');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

client.on(linkApproval.name, (...args) => {
    linkApproval.execute(...args);
});
client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    if (
        !interaction.member.roles.cache.has(CO_OWNER_ROLE_ID)
    ) {
        return interaction.reply({
            content: 'Only Co-owner can do this.',
            ephemeral: true
        });
    }

    const id = interaction.customId;

    if (id.startsWith('approve_')) {

        const parts = id.split('_');
        const link = parts.slice(2).join('_');

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(`ch1_${link}`)
                .setLabel('Links')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`ch2_${link}`)
                .setLabel('Crack Sites')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`ch3_${link}`)
                .setLabel('Emulator')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`ch4_${link}`)
                .setLabel('Codes')
                .setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({
            content: 'Select destination channel:',
            components: [row],
            ephemeral: true
        });
    }

    if (id.startsWith('reject_')) {

        return interaction.update({
            content: '❌ Link Rejected',
            components: []
        });
    }

    let channelId = null;
    let link = '';

    if (id.startsWith('ch1_')) {
        channelId = LINKS_CHANNEL_ID1;
        link = id.replace('ch1_', '');
    }

    if (id.startsWith('ch2_')) {
        channelId = LINKS_CHANNEL_ID2;
        link = id.replace('ch2_', '');
    }

    if (id.startsWith('ch3_')) {
        channelId = LINKS_CHANNEL_ID3;
        link = id.replace('ch3_', '');
    }

    if (id.startsWith('ch4_')) {
        channelId = LINKS_CHANNEL_ID4;
        link = id.replace('ch4_', '');
    }

    if (channelId) {

        const channel =
            client.channels.cache.get(channelId);

        await channel.send(
            `🔗 Approved Link\n\n${link}`
        );

        await interaction.update({
            content: '✅ Link Posted',
            components: []
        });
    }
});
const rankRoles = {
    lvl_1 : '1513721712401977404',
    lvl_2 : '1513721827795665048',
    lvl_3 : '1513721942568341616',
    dj    : '1513721432679383110',
    drag  : '1513720929019101184',
    server_mute : '1513717751863181532',
    server_deafen : '1513720661187756153',
};
client.on('messageCreate', async message => {

    if (message.author.bot) return;

    const uploadChannelId = '1513658297037750415';

    if (message.channel.id === uploadChannelId) {

        if (message.attachments.size === 0) {
            await message.delete();
            return;
        }
    }

    if (message.content === '!ping') {
        message.reply('Pong!');
    }

});
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
    if (!guild) return;

    await guild.members.fetch();

 for (const member of guild.members.cache.values()) {
    const fs = require('fs');

const data = JSON.parse(
    fs.readFileSync('./events/data/user.json', 'utf8')
);

const userid = member.id;

if (!data[userid]) {
    console.log("NOT FOUND:", member.user.username);
    continue;
}

const xp = data[userid].xp;

console.log(member.user.username, xp);
console.log("PROCESSING:", member.user.username);
console.log("USER ID:", member.id);
    if(member.user.bot) continue;

   


 

    // your role logic here
    
console.log("BEFORE RANKS:", member.user.username);
  const ranks = [
    { xp: 0, role: rankRoles.lvl_1 },
    { xp: 1000, role: rankRoles.lvl_2 },
    { xp: 3000, role: rankRoles.lvl_3 },
    { xp: 10000, role: rankRoles.drag },
    { xp: 12000, role: rankRoles.server_deafen },
    { xp: 15000, role: rankRoles.server_mute },
    { xp: 20000, role: rankRoles.dj },
];


 let roleToGive = rankRoles.lvl_1;
for (const rank of ranks) {
    if (xp >= rank.xp) {
        roleToGive = rank.role;
    }
}
console.log("TRYING:", member.user.username, roleToGive);
try {
    console.log("TRYING:", member.user.username, roleToGive);

await member.roles.add(roleToGive);

console.log("SUCCESS:", member.user.username);
}
catch(err) {
    console.log("FAILED:", member.user.username);
    console.log(err);
}
 }
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