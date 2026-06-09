const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const CO_OWNER_ROLE_ID = '1254480825487982774';
const APPROVAL_CHANNEL_ID = '1513660561437495486';

const LINKS_CHANNEL_ID1 = '1513663478349697234'; // links
const LINKS_CHANNEL_ID2 = '1513663658687987864'; // crack-sites
const LINKS_CHANNEL_ID3 = '1513663865412522106'; // emulator
const LINKS_CHANNEL_ID4 = '1513663926192050346'; // codes

module.exports = {
    name: 'messageCreate',

    async execute(message) {

        if (message.author.bot) return;

        if (!message.content.startsWith('!push ')) return;

        const link = message.content.split(' ')[1];

        if (
            !link.startsWith('http://') &&
            !link.startsWith('https://')
        ) {
            return message.reply('Invalid link!');
        }

        const approvalChannel =
            message.guild.channels.cache.get(APPROVAL_CHANNEL_ID);

        if (!approvalChannel) {
            return message.reply('Approval channel not found.');
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`approve_${message.author.id}_${link}`)
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`reject_${message.author.id}_${link}`)
                .setLabel('Reject')
                .setStyle(ButtonStyle.Danger)
        );

        await approvalChannel.send({
            content:
                `🔗 Link Request\n\n` +
                `User: ${message.author.username}\n` +
                `Link: ${link}`,
            components: [row]
        });

        await message.reply('Link submitted for approval.');
    }
};