const { MessageEmbed } = require("discord.js")
const db = require('quick.db');

module.exports = {
    config: {
        name: "unban",
        description: "Unban a user from the guild!",
        usage: "[name | tag | mention | ID] <reason> (optional)",
        aliases: ["ub", "unbanish"],
    },
    run: async (bot, message, args) => {

       const e1 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **You Dont Have The Permissions To Unban Someone!**`)
       .setColor("#12abff")

       const e2 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **Please Enter A Name!**`)

       .setColor("#12abff")
       const e3 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **Please Provide A Valid Username, Tag Or ID Or The User Is Not Banned!**`)
      
       .setColor("#12abff")
       const e4 =  new MessageEmbed()
       .setDescription(`<a:729477543119552592:875237546370662460> **I Don't Have Permissions To Unban Someone!**`)
      
       .setColor("#12abff")
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(e1)

        if (!args[0]) return message.channel.send(e2)
      
        let bannedMemberInfo = await message.guild.fetchBans()

        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
        if (!bannedMember) return message.channel.send(e3)

        let reason = args.slice(1).join(" ")

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(e4)
        try {
            if (reason) {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed = new MessageEmbed()
                    .setColor("#12abff")
                    .setDescription(`<a:802803657820864522:875243426944270376> **${bannedMember.user.tag} has been unbanned for ${reason}**`)
                message.channel.send(sembed)
            } else {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed2 = new MessageEmbed()
                    .setColor("#12abff")
                    .setDescription(`<a:802803657820864522:875243426944270376> **${bannedMember.user.tag} has been unbanned**`)
                message.channel.send(sembed2)
            }
        } catch {
            
        }

        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;

        let embed = new MessageEmbed()
            .setColor("#12abff")
            .setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "unban")
            .addField("**Unbanned**", `${bannedMember.user.username}`)
            .addField("**ID**", `${bannedMember.user.id}`)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", `${reason}` || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
    }
}