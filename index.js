const Discord = require('discord.js');
const bot = new Discord.Client({
    fetchAllMembers: true
});
const token = require("./token.json");
const fs = require("fs");
const bdd = require("./bdd.json");
const config = require ("./config.json");
const BattleMetrics = require("battlemetricsapi");
const axios = require('axios');
const { default: Axios } = require('axios');


bot.on('ready', async () =>{
    /****************************************************
    ********************** BOT OK ***********************
    ****************************************************/
        console.log("le bot est operationnel");
        bot.user.setStatus("online");
});




bot.on('ready', () => {
    /****************************************************
    *******************STATUS ACTIVITY ******************
    ****************************************************/
    const statuses = [
        'coalition-francophone.fr',
        'Polarized',
        'Splata',
        'Alexopiko',
        'Atenio',
        'Andreas Honnet',
        'Flavien',
        'Menubestof',
        'Peiper',
        'Poris'
    ]
    let i = 0
    setInterval(() => {
        bot.user.setActivity(statuses[i], {type: 'WATCHING'})
        i = ++i % statuses.length
    }, 1e4)
})



bot.on('guildMemberAdd', member => {
    /****************************************************
    **************** MESSAGE BIENVENUE ******************
    ****************************************************/
     member.guild.channels.cache.get(config.greeting.channel).send(new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle(`Bienvenue sur le serveur. Nous sommes désormais ${member.guild.memberCount} ! 😀`)
        .setAuthor('CoalFR BOT', 'https://cdn.icon-icons.com/icons2/2098/PNG/512/download_icon_128877.png')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields({
         name: 'Welcome',
         value: `${member} If you are a team representative, do not hesitate to report to the organization to have the role. 😉`,
         inline: true
        },)
        .setTimestamp()
        .setFooter('Crée avec amour par Alexopiko', 'https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png'))
});
   
bot.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Un départ sur le serveur ! ')
        .setAuthor('CoalFR BOT', 'https://cdn.icon-icons.com/icons2/2098/PNG/512/share_icon_128757.png')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields({
        name: 'Vers l\'infini et ...',
        value: 'Dommage, un membre de moins.. 😢',
        inline: true
        },)
        .setTimestamp()
        .setFooter('Crée avec amour par Alexopiko', 'https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png'))
});


bot.on("message", message => {
    /****************************************************
    ****************** PURGE FUNCTION *******************
    ****************************************************/
    if(message.content.startsWith("!clear")){
    message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){
            
            let args = message.content.trim().split(/ +/g);

            if(args[1]){

                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <=99){

                    message.channel.bulkDelete(args[1])   
                    message.channel.send(`Vous avez suppimé ${args[1]} messages 😊`)    
                    
                }          
            }
        }
    }

})



bot.on('message', message => {
    /****************************************************
    ****************** STATS SERVEUR ********************
    ****************************************************/
    if(message.content.startsWith("!stati")){
    message.delete();
        let totalmembers = message.guild.members.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalrole = message.guild.roles.cache.get('822076032403636275').members.map(member => member.user.tag).length;

        const EmbedStats = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Statistiques')
            .setURL('https://coalition-francophone.fr/')
            .setAuthor('Mon Bot discord', 'https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png')
            .setDescription('Voici les statistiques du serveur')
            .setThumbnail('https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png')
            .addFields({
                name: 'Nombre de membres total',
                value: totalmembers,
                inline: true
            }, {
                name: 'Nombres de bots sur le serveur : ',
                value: totalbots,
                inline: true
            }, {
                name: 'Nombre de CoalFR : ',
                value: totalrole,
                inline: true
            }, )
            .setTimestamp()
            .setFooter('Crée avec amour par Alexopiko', 'https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png');

        message.channel.send(EmbedStats);
    }
})

BattleMetrics.login({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjY0YzNiOTU5NjM1NjZiMDIiLCJpYXQiOjE2MTc3ODI4MjYsIm5iZiI6MTYxNzc4MjgyNiwiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjo0MDA5NDkifQ.JecyJ6YUpCnnEluCXlvPf8AP1p0zYco19uJEnZjCyVk'
})
/*******************************************************
********************** SERVER PS ***********************
********************************************************/
BattleMetrics.getServerInfoById("11155869").then(res => {
    console.log(res)
})


bot.on('message', message => {
   if(message.content.startsWith("!o")){
    message.delete();
        let onlines = BattleMetrics.getServerInfoById("11155869")
        
        BattleMetrics.getServerInfoById("11155869").then(res => {
            
            const EmbedStats = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Serveur Post-Scriptum')
            .setURL('https://coalition-francophone.fr/')
            .setDescription('Voici les statistiques du serveur de jeu')
            .setThumbnail('https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png')
            .addFields({
                name: 'Nom :',
                value: `😃 ${res[0]["Nom"]}`,
                inline: false
            }, {
                name: 'Nombre de joueurs sur le serveur :',
                value: `${res[0]["Joueurs"]}/${res[0]["JoueursMax"]}`,
                inline: true      
            }, )
            .setTimestamp()
            .setFooter('Crée avec amour par Alexopiko', 'https://coalition-francophone.fr/wp-content/uploads/2021/03/Coalv1.png');

        message.channel.send(EmbedStats);
    
        }) 
        }
        
})
/******************************************************/





/******************************************************/


/******************************************************DIVERS ZONE FUNCTION************************************************************************/

function Savebdd() {
     /***************************************************
    ******************** SAVE BDD ***********************
    ****************************************************/
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue");
    });
}


bot.login(process.env.token);




