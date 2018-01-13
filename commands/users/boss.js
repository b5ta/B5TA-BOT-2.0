const { inspect } = require("util");

exports.run = (client, message, args) => {
  if (args[0]) {

    let boss = client.bosses.get(args[0]) || client.bosses.get(client.bossaliases.get(args[0]));
    client.logger.log(boss);
    if(client.bosses.has(boss.info.filename)){
      message.channel.send({
        embed: {
          title: boss.info.name,
          color: 0x38fe4f,
          thumbnail: {
            url: boss.info.imageurl
          },
          fields: [
            { name: 'Description', value: boss.info.description},
            { name: 'Combat Style', value: boss.info.combatinfo },
            { name: 'Resources', value: boss.info.website }
          ]
        }}
      )
    }
  }
  else {
    // Show list of avaliable bosses to check

    message.reply(noBoss(client, message), {code: "asciidoc", split: { char: "\u200b" }});
    
  }
};

function noBoss(client, message)
{
  let msg;
  const settings = message.server ? client.settings.get(message.server.id) : client.config.defaultSettings;

  // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
  const myCommands = client.bosses;
  // Here we have to get the command names only, and we use that array to get the longest name.
  // This make the Boss commands "aligned" in the msg.
  const commandNames = myCommands.keyArray();
  const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
  let currentCategory = "";
  msg = `= **Boss Command List** =\n\n[Use ${settings.prefix}Boss <BosssName> for details]\n`;
  const sorted = myCommands.array().sort((p, c) => p.info.category > c.info.category ? 1 :  p.info.name > c.info.name && p.info.category === c.info.category ? 1 : -1 );
  sorted.forEach( c => {
    const cat = c.info.category.toProperCase();
    if (currentCategory !== cat && c.info.enabled == "true") {
      msg += `\u200b\n== ${cat} ==\n`;
      currentCategory = cat;
    }
    msg += `${settings.prefix}boss ${c.info.name}${" ".repeat(longest - c.info.filename.length)}\n`;
  });

  return msg;
};

exports.conf = {
  enabled: true,
  serverOnly: false,
  aliases: ["boss", "boos", "bosses", "bosss"],
  permLevel: "user"
};

exports.help = {
  name: "boss",
  category: "System",
  description: "Displays Boss Tactic for a given Boss.",
  usage: "boss [boss name]"
};
