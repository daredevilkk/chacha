

module.exports = {
    name: 'messageCreate',
    

    async execute(message) {
        console.log("ROLE MANAGE LOADED");
        if (message.author.bot) return;

       const rankRoles = {
        lvl_1 : '1513721712401977404',
        lvl_2 : '1513721827795665048',
        lvl_3 : '1513721942568341616',
        dj    : '1513721432679383110',
        restict_bot : '1513721153728938194',
        drag  : '1513720929019101184',
        server_mute : '1513717751863181532',
        server_deafen : '1513720661187756153',
    }
       const fs = require('fs');
        
       const data = JSON.parse(
        fs.readFileSync('./events/data/user.json', 'utf8')
       );

       const userid = message.author.id;

       if(!data[userid]) return;

       const xp = data[userid].xp;

       const member = message.member;

       //remove
       const rolesToRemove =[
          rankRoles.lvl_1,
          rankRoles.lvl_2,
          rankRoles.lvl_3,
          rankRoles.dj,
          rankRoles.drag,
          rankRoles.server_deafen,
          rankRoles.server_mute,
    ];
       for (const roleId of rolesToRemove) {
        if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
    }
}
    const ranks = [
    { xp: 400, role: rankRoles.lvl_1 },
    { xp: 1000, role: rankRoles.lvl_2 },
    { xp: 3000, role: rankRoles.lvl_3 },
    { xp: 10000, role: rankRoles.drag },
    { xp: 12000, role: rankRoles.server_deafen },
    { xp: 15000, role: rankRoles.server_mute },
    { xp: 20000, role: rankRoles.dj },
];
 let roleToGive = rankRoles.lvl_1;

 for(const rank of ranks){
    if(xp>= rank.xp){
        roleToGive = rank.role;
       
    }
 } console.log("role start");
 await member.roles.add(roleToGive);
  console.log("role done");
}
     
};