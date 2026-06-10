require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

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

const joinEvent = require('./events/guildMemberAdd');
const newinfo = require('./events/nowinfo');
const leaderboard = require('./events/showLevel');
const rolemanage= require('./events/roleManage');
const linkApproval = require('./events/linkApproval');
const antiSpam = require('./events/antiSpam');


client.on('interactionCreate', async interaction => {
    console.log("LISTENER A");
    console.log("INTERACTION RECEIVED");
    if (!interaction.isChatInputCommand()) return;
    

    if (interaction.commandName === 'ping') {
        return interaction.reply('🏓 Pong!');
    }
    if (interaction.commandName === 'rank') {

    const fs = require('fs');

    const data = JSON.parse(
        fs.readFileSync('./events/data/user.json', 'utf8')
    );

    const userId = interaction.user.id;

    const users = Object.entries(data);

    users.sort((a, b) => b[1].xp - a[1].xp);

    const rank = users.findIndex(
        user => user[0] === userId
    ) + 1;

    const xp = data[userId]?.xp || 0;

    const embed = new EmbedBuilder()
        .setTitle('🏆 CHACHA RANK')
        .setColor('#3498db')
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
            { name: '👤 User', value: interaction.user.username, inline: true },
            { name: '🥇 Rank', value: `#${rank}`, inline: true },
            { name: '⭐ XP', value: `${xp}`, inline: true }
        )
        .setFooter({
            text: 'Keep chatting to earn XP! 🚀'
        });

    return interaction.reply({
        embeds: [embed]
    });
}
    if (interaction.commandName === 'top') {

    const fs = require('fs');

    const data = JSON.parse(
        fs.readFileSync('./events/data/user.json', 'utf8')
    );

    const users = Object.entries(data);

    users.sort((a, b) => b[1].xp - a[1].xp);

    let leaderboard = '';

    for (let i = 0; i < Math.min(users.length, 10); i++) {

        const user =
            await client.users.fetch(users[i][0]);

        const medal =
            i === 0 ? '🥇' :
            i === 1 ? '🥈' :
            i === 2 ? '🥉' : '🏅';

        leaderboard +=
            `${medal} ${user.username} — ${users[i][1].xp} XP\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle('🏆 CHACHA LEADERBOARD')
        .setColor('#FFD700')
        .setDescription(leaderboard);

    return interaction.reply({
        embeds: [embed]
    });
}
    
  if (interaction.commandName === 'info') {

    const target =
        interaction.options.getMember('user') ||
        interaction.member;

    const roles = target.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name)
        .join(', ');

    const embed = new EmbedBuilder()
        .setTitle('👤 MEMBER INFO')
        .setThumbnail(target.user.displayAvatarURL())
        .addFields(
            {
                name: 'Username',
                value: target.user.username
            },
            {
                name: 'Roles',
                value: roles || 'No Roles'
            },
            {
                name: 'Joined Server',
                value: target.joinedAt.toDateString()
            }
        )
        .setColor('#3498db');

    return interaction.reply({
        embeds: [embed]
    });
}

}); // CLOSES LISTENER A 

    

  


client.on(antiSpam.name, (...args) => {
    antiSpam.execute(...args);
});


client.on(linkApproval.name, (...args) => {
    linkApproval.execute(...args);
});
    


client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    const id = interaction.customId;

    if (
        id.startsWith('approve_') ||
        id.startsWith('reject_') ||
        id.startsWith('ch1_') ||
        id.startsWith('ch2_') ||
        id.startsWith('ch3_') ||
        id.startsWith('ch4_')
    ) {

        if (!interaction.member.roles.cache.has(CO_OWNER_ROLE_ID)) {
            return interaction.reply({
                content: 'Only Co-owner can do this.',
                ephemeral: true
            });
        }
    }

    // paste all your approve/reject/ch1/ch2/ch3/ch4 code here
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
        const channel = client.channels.cache.get(channelId);

        await channel.send(`🔗 Approved Link\n\n${link}`);

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

    

    if (message.content === '!ping') {
        return message.reply('Pong');
    }

    if (message.mentions.has(client.user)) {
        return message.reply(`Hello ${message.author.username}! 👋`);
    }
});
client.on(rolemanage.name, (...args)=>{
    rolemanage.execute(...args);
})
client.on(leaderboard.name, member => {
 leaderboard.execute(member);
});

client.on(joinEvent.name, member => {
    joinEvent.execute(member);
});
client.on(messageEvent.name, (...args) => {
    messageEvent.execute(...args);
});
client.on(newinfo.name, member => {
    newinfo.execute(member);
});

client.once('clientReady', () => {
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




client.login(process.env.TOKEN);/ /   r e d e p l o y  
 