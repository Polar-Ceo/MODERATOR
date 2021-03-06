const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
    config: {
        name: "mute",
        description: "Mutes a member in the discord!",
        usage: "[name | nickname | mention | ID] <reason> (optional)",
    },
    run: async (bot, message, args) => {

      const e1 =  new MessageEmbed()

       .setDescription(`<:733987631628550175:870949748604039189> **You dont have permmissions to mute someone!**`)     
       .setColor("#12abff")

       const e2 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **I don't have permissions to mute someone!**`)     
       .setColor("#12abff")

       const e3 =  new MessageEmbed()
       .setDescription(`**Please enter a user to be muted!**`)      
       .setColor("#12abff")

       const e4 =  new MessageEmbed()
       .setDescription(`<a:729477543119552592:875237546370662460> **Please enter a valid user to be muted!**`)      
       .setColor("#12abff")
  
       const e5 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **You cannot mute yourself!**`)    
       .setColor("#12abff")

       const e6 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **Cannot mute this user!**`)
       .setColor("#12abff")
       
       const e7 =  new MessageEmbed()
       .setDescription(`<:733987631628550175:870949748604039189> **Cannot mute bots!**`)
       .setColor("#12abff")

       const e8 =  new MessageEmbed()
       .setDescription(`<a:729477543119552592:875237546370662460> **User Is Already Muted!**`)
       .setColor("#12abff")

        try {
            if (!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send(e1)

            if (!message.guild.me.hasPermission("MUTE_MEMEBERS")) return message.channel.send(e2)

            if (!args[0]) return message.channel.send(e3)

            var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!mutee) return message.channel.send(e4);

            if (mutee === message.member) return message.channel.send(e5);
            if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send(e6);

            let reason = args.slice(1).join(" ");
            if (mutee.user.bot) return message.channel.send(e7)
            const userRoles = mutee.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r.id)

            let muterole;
            let dbmute = await db.fetch(`muterole_${message.guild.id}`);
            let muteerole = message.guild.roles.cache.find(r => r.name === "muted")

            if (!message.guild.roles.cache.has(dbmute)) {
                muterole = muteerole
            } else {
                muterole = message.guild.roles.cache.get(dbmute)
            }

            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                        data: {
                            name: "muted",
                            color: "#12abff",
                            permissions: []
                        }
                    })
                    message.guild.channels.cache.forEach(async (channel) => {
                        await channel.createOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                            SPEAK: false,
                            CONNECT: false,
                        })
                    })
                } catch (e) {
                    console.log(e);
                }
            };

            if (mutee.roles.cache.has(muterole.id)) return message.channel.send(e8)

            db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles)
          try {
            mutee.roles.set([muterole.id]).then(() => {
                mutee.send(`**Hello, You Have Been Muted In ${message.guild.name} for - ${reason || "No Reason"}`).catch(() => null)
            })
            } catch {
                 mutee.roles.set([muterole.id])                               
            }
                if (reason) {
                const sembed = new MessageEmbed()
                    .setColor("#12abff")
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`<a:802803657820864522:875243426944270376> ${mutee.user.username} was successfully muted for ${reason}`)
                message.channel.send(sembed);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor("#12abff")
                    .setDescription(`${mutee.user.username} was successfully muted`)
                message.channel.send(sembed2);
                }
            
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (!channel) return;

            let embed = new MessageEmbed()
                .setColor('#12abff')
                .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .addField("**Moderation**", "mute")
                .addField("**Mutee**", mutee.user.username)
                .addField("**Moderator**", message.author.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", message.createdAt.toLocaleString())
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setTimestamp()

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
        } catch {
            return;
        }
    }
}