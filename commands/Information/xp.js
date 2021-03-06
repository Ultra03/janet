const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      requiredSettings: [],
      aliases: ['xpstats'],
      guarded: false,
      permissionLevel: 0,
      description: 'Views xp of self or member.',
      extendedHelp: '!xp [optional: <usertag | userid>',
      usage: '[user:user]',
    });
  }

  async run(msg, [user]) {
    if (!await msg.hasAtLeastPermissionLevel(5)) {
      if (!msg.guild.settings.channels.botspam) return;
      if(msg.channel.id != msg.guild.settings.channels.botspam) {
        return msg.send(`Command only allowed in <#${msg.guild.settings.channels.botspam}>`);
      }
    }
    if (!user) user = msg.author;

    const leaderboard = this.client.users.cache.sort((a,b) => {
      if (a.settings.xp > b.settings.xp) return -1;
      if (a.settings.xp < b.settings.xp) return 1;
      return 0;
    }).array();

    let rank = 0;
    leaderboard.some((u) => {
      rank++;
      return u.id === user.id;
    });

    const embed = new MessageEmbed()
      .setTitle('Level Statistics')
      .setColor('GREEN')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .addField('Member', `${user.tag} (<@${user.id}>)`)
      .addField('Level', user.settings.get('level'), true)
      .addField('XP', user.settings.get('xp'), true)
      .addField('Rank', `${rank} / ${leaderboard.length}`, true)
      .setFooter(user.id)
      .setTimestamp();
    msg.send(embed);
  }

  async init() {}

};
