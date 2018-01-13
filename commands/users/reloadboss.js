exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
    if (!args || args.length < 1) return message.reply("Must provide a command to reload. Derp.");
  
    let response = await client.unloadBoss(args[0]);
    if (response) return message.reply(`Error Unloading: ${response}`);
  
    response = client.loadBoss(args[0]);
    if (response) return message.reply(`Error Loading: ${response}`);
  
    message.reply(`The boss \`${args[0]}\` has been reloaded`);
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Bot Admin"
  };
  
  exports.help = {
    name: "reloadboss",
    category: "System",
    description: "Reloads a boss that\"s been modified.",
    usage: "reloadboss [command]"
  };