require('dotenv').config();

const Eris = require('eris');
const logger = require('good-logger');
const axios = require('axios');

const inviteLink = `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot&permissions=67590`;
const bot = new Eris(process.env.TOKEN);

setInterval(() => {
	logger.info('Updating DBL stats');

	axios.post(`https://discordbotlist.com/api/bots/${process.env.CLIENT_ID}/stats`, {
		shard_id: 0,
		guilds: bot.guilds.size,
		users: bot.users.size,
	}, {
		headers: {
			Authorization: `Bot ${process.env.DBL_TOKEN}`,
		}
	}).catch(logger.err);
}, 120 * 1000);

bot.on('ready', () => {
	logger.info('Connected!');
});

bot.on('messageCreate', msg => {
	if (msg.content.includes(`<@${process.env.CLIENT_ID}>`)) {
		bot.createMessage(msg.channel.id, `add meeee everywhereeee <${inviteLink}>`);
	}
});

bot.on('guildMemberAdd', (guild, member) => {
	if (member.username.match(/[\d\w]+.[\d\w]{2,}\/.+/g)) {
		guild.banMember(member.id, 1, 'Appears to be spam').then(() => {
			logger.info(`Banned member: ${member.id} (${member.username}#${member.discriminator}) from ${guild.id} (${guild.name})`);
		}).catch(() => {
			logger.warn(`Could not ban member: ${member.id} (${member.username}#${member.discriminator}) from ${guild.id} (${guild.name})`);
		});
	}
});

bot.connect();