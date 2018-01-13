// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require('discord.js');
const bot =  new Discord.Client();
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const pg = require("pg");
//const dbclient = new pgdatabase();

//DB Connection String
const conString = "postgres://B5TAAdmin:B5TA@localhost/B5TADB";


bot.setMaxListeners(500);
bot.config = require("./config.js");
bot.logger = require("./util/Logger");
bot.commands = new Enmap();
bot.aliases = new Enmap();
bot.bosses = new Enmap();
bot.bossaliases = new Enmap();
bot.database = require("pg");
bot.dbConnectionString = conString;

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./util/functions.js")(bot);

bot.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

const init = async () => {
  const cmdFiles = await readdir("./commands/");
  bot.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = bot.loadCommand(f);
    if (response) console.log(response);
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  bot.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    // This line is awesome by the way. Just sayin'.
    bot.on(eventName, event.bind(null, bot));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  // Generate a cache of client permissions for pretty perms
  bot.levelCache = {};

  for (let i = 0; i < bot.config.permLevels.length; i++) {
    const thisLevel = bot.config.permLevels[i];
    bot.levelCache[thisLevel.name] = thisLevel.level;
  }

  const bossFiles = await readdir("./commands/PVM/");
  bot.logger.log(`Loading a total of ${bossFiles.length} boss files.`);
  bossFiles.forEach(bs => {
    if (!bs.endsWith(".js")) return;
    const response = bot.loadBoss(bs);
    if (response) console.log(response);
  });

  bot.login(bot.config.token);
};
/*Configuration Change Section*/
// Allows the proper user to change some configuration settings like Pre-fix
bot.on('message',(message) =>{
  if (!message.content.startsWith(bot.config.prefix) || message.author.bot) return;

  if(message.content.startsWith(bot.config.prefix + "prefix")) {
    // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    // change the configuration in memory
    bot.config.prefix = newPrefix;

    // Now we have to save the file.
    fs.writeFile("./config.json", JSON.stringify(config), (err) => bot.logger.log(console.error));
  }
});
/*Boss guides*/
// All bosses guides commands start with !boss (bossname)
// !boss will display a list of all the bosses
bot.on('message', (message) =>{
  if (message.content == '!boss'){
    message.channel.send('Specify which boss with boss-bossname: \n\n'+

                          '__**Low-Level Bosses**__\n'+
                          '!boss-chaos - Chaos Elemental\n'+
                          '!boss-dag - Dagannoth Kings\n'+
                          '!boss-mole - Giant Mole\n'+
                          '!boss-kq - Kalphite Queen \n'+
                          '!boss-ekq - Exiled Kalphite Queen\n'+
                          '!boss-kbd - King Black Dragon\n'+
                          '!boss-barrows - The Barrows Brothers\n'+
                          '!boss-jad - TzTok-Jad\n\n'+

                          '__**God Wars Dungeon**__\n'+
                          '!boss-kree - Kree’arra (Armadyl)\n'+
                          '!boss-graar - General Graardor (Bandos)\n'+
                          '!boss-zil - Commander Zilyana (Saradomin)\n'+
                          '!boss-kril - K’ril Tsutsaroth (Zamorak)\n'+
                          '!boss-nex - Nex (Zaros)\n\n'+

                          // '__**Medium-Level Bosses**__\n'+
                          // 'Corporeal Beast: boss-corp\n'+
                          // 'Har-aken: boss-aken\n'+
                          // 'Legiones: boss-legiones\n'+
                          // 'Queen Black Dragon: boss-qbd\n'+
                          // 'Kalphite King: boss-kk\n\n'+

                          '__**God Wars Dungeon 2**__\n'+
                          '!boss-greg - Gregorovic (Sliske): \n'+
                          '!boss-helwyr - Helwyr (Seren): \n'+
                          '!boss-twins - Twin Furies (Zamorak): \n'+
                          '!boss-vinny - Vindicta & Gorvek (Zaros): \n\n'

                          // '__**High-Level Bosses**__\n'+
                          // 'Araxxor: boss-rax\n'+
                          // 'Barrows, Rise of the Six: boss-rots\n'+
                          // 'Telos: boss-telos\n'+
                          // 'Vorago: boss-vorago\n\n'+
                          //
                          // '__**Raids**__\n'+
                          // 'Beastmaster: boss-bm\n'+
                          // 'Yakamaru: boss-yaka\n'
                        );
      }
    });

////////////////////////////////////////////////////////////////////////////////////////////////
//Boss Library
///////////////////
/*Chaos Elemental*/
bot.on('message', (message) =>{
  if (message.content == '!boss-chaos'){
    message.channel.send('__**Chaos Elemental**__\n'+
                          'The Chaos Elemental dwells in the members-only section of the Wilderness, just west of the Rogues Castle.' +
                          ' This area is moderately easy to access from the deep Wilderness teleport lever in Ardougne or Edgeville.'+
                          ' A Wilderness Obelisk can randomly teleport players southeast of the Rogues Castle.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Chaos_Elemental/Strategies>\n\n' +

                          '__Preffered Combat Style__: Range\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Demon slayer circlet > Royal dragonhide coif\n'+
                          'Saradomins murmur > Amulet of glory\n'+
                          'Demon slayer torso > Royal dragonhide body\n'+
                          'Demon slayer skirt > Royal dragonhide chaps\n'+
                          'Royal spiky vambraces\n'+
                          'Turoth boots\n'+
                          'Max cape > Skill cape\n\n'+

                          '__*2h Weapon*__\n'+
                          'Crystal bow/Royal crossbow > Black salamander\n');

  }

});

///////////////////
/*Dagannoth Kings*/
bot.on('message', (message) =>{
  if (message.content == '!boss-dag'){
    message.channel.send('__**Dagannoth Kings**__\n'+
                          'The Dagannoth Kings are a group of three dagannoths that live deep in the cave on Waterbirth Island.' +
                          ' They are each level 303, and also represent the combat triangle.'+
                          ' Each of them uses a different combat style, and is weak against the type that defeats them on the combat triangle, and immune to all others.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Dagannoth_Kings/Strategies>\n\n' +

                          '__Preffered Combat Style__: Magic/Range Hybrid\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Seasingers hood/Death lotus hood > Virtus mask/Pernix cowl > Ganodermic visor/Armadyl helmet\n'+
                          'Amulet of souls > Amulet of fury\n'+
                          'Sea singers robe top/Death lotus chestplate > Virtus robe top/Pernix body > Ganodermic poncho/Armadyl chestplate\n'+
                          'Sea singer robe/Death lotus chaps > Virtus robe/Pernix chaps > Ganodermic leggings/Armadyl chainskirt\n'+
                          'Automaton gloves > Dominion tower gloves	> Nex gloves\n'+
                          'Fremennik sea boots 4 > Glacor boots > Nex boots\n'+
                          'Max cape > Skill cape\n\n' +

                          '__*2h Weapon*__\n'+
                          'Noxious staff/Noxious longbow >	Chaotic staff/Zaryte bow >	Armadyl battlestaff/Royal crossbow\n'+
                          '__*Dual Wield*__\n'+
                          'Seismic set/Ascension crossbow set> Virtus wand/Death lotus dart > Abyssal wand/Chaotic crossbow');
  }
});

/////////////////
/*Giant Mole*/
bot.on('message', (message) =>{
if (message.content == '!boss-mole'){
message.channel.send('__**Giant Mole**__\n'+
                      'The Giant mole is found in Falador Mole Lair below Falador Park.'+
                      ' She is designed to be an introductory boss for low-mid level players around 60 combat level.'+
                      ' While the mole is not very strong, the special attacks can potentially kill unprepared players.'+
                      ' It is one of the lowest levelled bosses to drop elite clue scrolls making this a very popular monster for players.\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/Giant_mole/Strategies>\n\n'+

                      '__Preferred Combat Style__: Magic\n\n'+

                      '__**Gear Setup**__:\n'+
                      'More Effective >  Less Effective \n\n'+

                      '__*Armour*__\n'+
                      'Ganodermic Visor/Hood of Subjugation/Ahrim\'s Hood\n'+
                      'Arcane Stream Necklace/Saradomin\'s Hiss/Amulet of Fury/Dragon Rider Amulet/Amulet of Glory\n'+
                      'Ganodermic Poncho/Garb of Subjugation/Ahrim\'s Robe Top\n'+
                      'Ganodermic Leggings/Gown of Subjugation/Ahrim\'s Robe Skirt\n'+
                      'Spellcaster Gloves/Culinaromancer\'s Gloves 10/Ganodermic Gloves\n'+
                      'Ragefire Boots/Ganodermic Boots\n'+
                      'Max Cape/Skill Cape/Obsidian cape\n\n'+

                      '__*2h Weapons*__\n'+
                      'Noxious Staff>Chaotic Staff>Armadyl Battlestaff\n'+
                      '__*Dual Wielded Weapons*__\n'+
                      'Virtus Wand & Book/Abyssal Wand & Orb/Wand of Treachery & Grifolic Orb'
                    );
}
});

///////////////////
/*Kalphite Queen*/
bot.on('message', (message) =>{
  if (message.content == '!boss-kq'){
    message.channel.send('__**Kalphite Queen**__\n'+
                          'The entrance to the Kalphite hive is due west of Shantay Pass.' +
                          ' New visitors to the hive will require a rope to climb down the hive.'+
                          ' A second rope will also be required for entrance into the queen\'s room. '+
                          ' You\'ll want two attack styles: Melee for first form and Magic or Ranged for second form.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Kalphite_Queen/Strategies>\n\n'+

                          '__Preffered Combat Style__: Melee/Range Hybrid\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Warpriest helm > Tetsu helm/Pernix cowl > Bandos helm/Armadyl helmet\n'+
                          'Amulet of souls > Amulet of fury\n'+
                          'Warpriest cuirass > Tetsu platebody/Pernix body > Bandos platebody/Armadyl chestplate\n'+
                          'Warpriest greaves > Tetsu platelegs/Pernix chaps > Bandos tassets/Armadyl chainskirt\n'+
                          'Warpriest gauntlets \n'+
                          'Warpriest boots \n'+
                          'Max cape > Skill cape\n\n'+

                          '__*Dual Wield*__\n'+
                          'Drygore weaponry & Ascension crossbow > Blade of Nymphora/Avaryss & Shadow glaive\n'+
                          '__*2h Weapon*__\n'+
                          'Nox Scythe & Nox bow > Dragon rider lance & Royal crossbow');

  }
});

///////////////////
/*Exiled Kalphite Queen*/
bot.on('message', (message) =>{
  if (message.content == '!boss-ekq'){
    message.channel.send('__**Exiled Kalphite Queen**__\n'+
                          'The Exiled Kalphite Queen is a second version of the Kalphite Queen that is found in the Exiled Kalphite Hive, where the mighty Kalphite King lives.' +
                          ' This Hive is found just north of Menaphos. Players should be aware that the Exiled Kalphite Queen is significantly more difficult to fight than its normal counterpart.'+
                          ' Her stats and life points are higher than those of the regular Queen,'+
                          ' but the significant difference lies in the aggressive minions that spawn in the room, which can stack heavy damage over time.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Kalphite_Queen/Strategies>\n\n' +

                          '__Preffered Combat Style__: Melee/Range Hybrid\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Warpriest helm > Tetsu helm/Pernix cowl > Bandos helm/Armadyl helmet\n'+
                          'Amulet of souls > Amulet of fury\n'+
                          'Warpriest cuirass > Tetsu platebody/Pernix body > Bandos platebody/Armadyl chestplate\n'+
                          'Warpriest greaves > Tetsu platelegs/Pernix chaps > Bandos tassets/Armadyl chainskirt\n'+
                          'Warpriest gauntlets \n'+
                          'Warpriest boots \n'+
                          'Max cape > Skill cape\n\n'+

                          '__*Dual Wield*__\n'+
                          'Drygore weaponry & Ascension crossbow > Blade of Nymphora/Avaryss & Shadow glaive\n'+
                          '__*2h Weapon*__\n'+
                          'Nox Scythe & Nox bow > Dragon rider lance & Royal crossbow');
  }
});

///////////////////
/*King Black Dragon*/
bot.on('message', (message) =>{
if (message.content == '!boss-kbd'){
message.channel.send('__**King Black Dragon**__\n'+
                      'The King Black Dragon (or KBD) is one of the stronger dragons in RuneScape and should not be underestimated.'+
                      ' It drops various sought-after items, such as Hard / Elite clue scrolls, dragon rider boots and gloves, King Black Dragon heads and the elusive draconic visage.'+
                      ' Players with low combat-related levels should avoid fighting the King Black Dragon.'+
                      ' You can access KBD by activating the artifact North of the Edgeville Monastery'+
                      ' If you don\'t have super anti-fires use an anti-dragon shield and an anti-fire with a one handed weapon\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/King_Black_Dragon/Strategies>\n\n'+

                      '__Preferred Combat Style__: Range\n\n'+

                      '__**Gear Setup**__:\n'+
                      'More Effective >  Less Effective \n\n'+

                      '__*Armour*__\n'+
                      'Serenic Mask > Pernix Cowl > Armadyl Helmet\n'+
                      'Amulet of Souls > Amulet of Fury > Saradomin\'s Murmor\n'+
                      'Sirenic Hauberk > Pernix Body > Armadyl Chestplate\n'+
                      'Sirenic Chaps > Death Lotus Chaps > Pernix Chaps > Armadyl Chainskirt\n'+
                      'Ascension Grips > Pernix Gloves > Armadyl Gloves\n'+
                      'Flarefrost Boots > Pernix Boots > Armadyl Boots\n'+
                      'Max Cape > Skill Cape > Obsidian cape\n\n'+

                      '__*2h Weapons*__\n'+
                      'Noxious Bow > Zaryte Bow > RCB\n'+
                      '__*Dual Wielded Weapons*__\n'+
                      'Ascension Crossbows > Glaives > Armadyl Crossbows\n');
}
});

///////////////////
/*Barrows Brothers*/
bot.on('message', (message) =>{
  if (message.content == '!boss-barrows'){
    message.channel.send('__**Barrows Brothers**__\n'+
                          'The Barrows brothers are a collection of powerful wights controlled by the Mahjarrat Sliske.' +
                          ' They are named after the tumuli in which they are buried, found in southern Morytania.'+
                          ' They are fought as bosses during the Barrows and Barrows: Rise of the Six minigames.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Barrows/Strategies>\n\n' +

                          '__Preffered Combat Style__: Magic\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Warpriest helm > Dragon Rider helm > Akrisae\'s hood\n'+
                          'Dragon Rider amulet > Amulet of fury\n'+
                          'Ganodermic poncho > Garb of subjugation > Grifolic poncho\n'+
                          'Ganodermic leggings > Gown of subjugation > Grifolic leggings\n'+
                          'Culinaromancer\'s gloves 10 > Superior Dragon Rider gloves \n'+
                          'Silverhawk boots > Superior Dragon Rider boots \n'+
                          'Max cape > Skill cape\n\n'+

                          '__*2h Weapon*__\n'+
                          'Armadyl battlestaff > Staff of lights > Polypore staff\n'+
                          '__*Dual Wield*__\n'+
                          'Seismic wand >	Wand of the Cywir elders > Seasinger kiba > Virtus wand');
  }
});

///////////////////
/*TzTok-Jad*/
bot.on('message', (message) =>{
  if (message.content == '!boss-jad'){
    message.channel.send('__**TzTok-Jad**__\n'+
                          'TzTok-Jad is the final boss of and most powerful TzHaar creature in the TzHaar Fight Cave, appearing at wave 63.' +
                          ' To add to the challenge, players must fight TzTok-Jad on their own, without the use of Summoning creatures or a dwarf multicannon for assistance.'+
                          ' Players must also fight 271 other monsters before fighting him, resulting in a high usage of food, potions, ammunition, prayer, etc.\n\n'+

                          ' For a strategy guide visit <http://runescape.wikia.com/wiki/TzHaar_Fight_Cave/Strategies>\n\n' +

                          '__Preffered Combat Style__: Range\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Obsidian helm > Pernix Cowl > Armadyl Helmet\n'+
                          'Amulet of souls > Blood Amulet of fury\n'+
                          'Obsidian platebody > Pernix Body > Armadyl Chestplate\n'+
                          'Obsidian platelegs > Pernix chaps > Armadyl Chainskirt\n'+
                          'Obsidian gloves > Pernix Gloves > Armadyl Gloves \n'+
                          'Obsidian boots > Pernix Boots > Armadyl Boots \n'+
                          'Max cape > Skill cape\n\n'+

                          '__*2h Weapon*__\n'+
                          'Nox > Obliteration > Darkbow\n'+
                          '__*Dual Wield*__\n'+
                          'Ascensions crossbows >	Shadow glaives > vengful kiteshield(switch)');
  }
});

///////////////////     GWD1 BOSSES       ///////////////////////////////////////
/*Kree'arra*/
bot.on('message', (message)=>{
if (message.content == '!boss-kree'){
message.channel.send('__**Kree\'arra**__\n'+
                      'Kree\'arra is the Armadyl general in the God Wars Dungeon.\n'+
                      'He has moderate range and mage defence and players can kill it according to their recommended style.'+
                      ' Kree is located in the southwest corner of GWD1, to get to Kree you must have level 70 range \(cannot be boosted\)\n\n'+

                      'Remember: You can only attack Kree wit range or magic.\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/Kree%27arra/Strategies>\n\n'+

                      '__Preferred Combat Style__: Range\n\n'+

                      '__**Gear Setup**__:\n'+
                      'More Effective >  Less Effective \n\n'+

                      '__*Armour*__\n'+
                      'Sirenic Mask > Pernix Cowl > Armadyl Helmet\n'+
                      'Amulet of Souls > Farsight Blood Necklace > Farsight Sniper Necklace\n'+
                      'Sirenic Hauberk > Pernix Body > Armadyl Chestplate\n'+
                      'Sirenic Chaps > Pernix Chaps > Armadyl Chainskirt\n'+
                      'Swift Gloves  >Pernix Gloves > Armadyl Gloves\n'+
                      'Pernix Boots > Glaiven Boots > Armadyl Boots\n'+
                      'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                      '__*2h Weapon*__\n'+
                      'Nox bow > Royal crossbow > Black salamander\n'+
                      '__*Dual Wield*__\n'+
                      'Ascensions Crossbows > Shadow glaives > ')
}
});

///////////////////
/*Commander Zilyana*/
bot.on('message', (message)=>{
if (message.content == '!boss-zil'){
message.channel.send('__**Commander Zilyana**__\n'+
                      'Commander Zilyana is the commander of Saradomin\'s forces in the God Wars Dungeon\n'+
                      'She shares the same combat level but has different amounts of life points and max hits as the other God Wars generals.\n'+
                      'She has very high life points, only surpassed by Kree\'arra and Nex.\n'+
                      'Commander Zilyana is located in the southeastern section of GWD1, you must have 70 agility to reach her \(cannot be boosted)\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/Commander_Zilyana/Strategies>\n\n'+

                      '__Preferred Combat Style__: Magic\n\n'+

                      '__Gear Setup__:\n'+
                      'More Effective > Less Effective\n\n'+

                      '__*Armour*__\n'+
                      'Tectonic Mask>Superior Seasinger\'s Hood>Virtus Mask\n'+
                      'Amulet of Souls>Arcane Stream Necklace>Dragon Rider Amulet\n'+
                      'Tectonic Robe Top>Superior Seasinger\'s Robe Top>Virtus Robe Top\n'+
                      'Tectonic Robe Bottom>Superior Seasinger\'s Robe Bottom>Virtus Robe Legs\n'+
                      'Celestial Handwraps>Static Gloves>Spellcaster Gloves\n'+
                      'Ragefire Boots>Virtus Boots>Boots of Subjugation\n'+
                      'Max Cape>Skill Cape>Obsidian Cape\n\n'+

                      '__*2h Weapons*__\n'+
                      'Noxious Staff>Staff of Darkness>Attuned Crystal Staff\n'+
                      '__*Dual Wielded Weapons*__\n'+
                      'Seismic Wand & Singularity>Seasinger Kiba & Makigai>Attuned Crystal Wand & Orb\n')
}
});

///////////////////
/*General Graardor*/
bot.on('message', (message)=>{
if (message.content == '!boss-graar'){
message.channel.send('__**General Graardor**__\n'+
                      'General Graardor is one of the most popular of the five God Wars Dungeon bosses to kill, as he is arguably one of the easiest.\n'+
                      'To enter Bandos\'s Stronghold, players must have at least 70 Strength \(cannot be boosted) and a hammer \(tool belt works).\n'+
                      'Bandos\'s Stronghold is located in the northwest corner of the God Wars Dungeon.\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/General_Graardor/Strategies>\n\n'+

                      '__Preferred Combat Style__: Magic\n\n'+

                      '__Gear Setup__:\n'+
                      'More Effective > Less Effective\n\n'+

                      '__*Armour*__\n'+
                      'Tectonic Mask>Superior Seasinger\'s Hood>Anima Core Helm of Seren\n'+
                      'Amulet of Souls>Blood Arcane Stream Necklace> Saradomin\'s Hiss\n'+
                      'Tectonic Robe top>Superior Seasinger\'s Robe Top>Anima Core Body of Seren\n'+
                      'Tectonic Robe Bottom>Superior Seasinger\'s Robe Bottom>Anima Core Legs Seren\n'+
                      'Spellcaster Gloves>Virtus Gloves>Static Gloves\n'+
                      'Ragefire Boots>Virtus Boots>Boots of Subjugation\n'+
                      'Max Cape>Skill Cape>Obsidian Cape\n\n'+

                      '__*2h Weapons*__\n'+
                      'Noxious Staff>Staff of Darkness>Attuned Crystal Staff\n'+
                      '__*Dual Wielded Weapons*__\n'+
                      'Seismic Wand & Singularity>Seasinger Kiba & Makigai>Attuned Crystal Wand & Orb')
  }
});

///////////////////
/*K'ril Tsutsaroth*/
bot.on('message', (message)=>{
if (message.content == '!boss-kril'){
message.channel.send('__**K\'ril Tsutsaroth**__\n'+
                      'K\'ril Tsutsaroth is level 650 with 55,000 life points. He has three different attacks.\n'+
                      'His melee attack does 1200+ damage; his typeless attack does over 5000+ damage and drains prayer, and his magic attack does 1100+ damage.\n'+
                      'Once inside the dungeon, the player must run north and jump across the bridge.\n\n'+

                      'Remember: Antipoisons\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/K%27ril_Tsutsaroth/Strategies>\n\n'+

                      '__Preferred Combat Style__: Magic\n\n'+

                      '__Gear Setup__:\n'+
                      'More Effective > Less Effective\n\n'+

                      '__*Armour*__\n'+
                      'Tectonic Mask>Superior Seasinger\'s Hood>Anima Core Helm of Seren\n'+
                      'Amulet of Souls>Blood Arcane Stream Necklace> Saradomin\'s Hiss\n'+
                      'Tectonic Robe top>Superior Seasinger\'s Robe Top>Anima Core Body of Seren\n'+
                      'Tectonic Robe Bottom>Superior Seasinger\'s Robe Bottom>Anima Core Legs Seren\n'+
                      'Spellcaster Gloves>Virtus Gloves>Static Gloves\n'+
                      'Ragefire Boots>Virtus Boots>Boots of Subjugation\n'+
                      'Max Cape>Skill Cape>Obsidian Cape\n\n'+

                      '__*2h Weapons*__\n'+
                      'Noxious Staff>Staff of Darkness>Attuned Crystal Staff\n'+
                      '__*Dual Wielded Weapons*__\n'+
                      'Seismic Wand & Singularity>Seasinger Kiba & Makigai>Attuned Crystal Wand & Orb')
  }
});

///////////////////        GWD2 DUNGEON BOSSES     ///////////////////////////////////////////
/*Vindicta*/
bot.on('message', (message)=>{
if (message.content == '!boss-vinny'){
message.channel.send('__**Vindicta**__\n'+
                      'Vindicta is located in the southwest area of The Heart.\n'+
                      'To enter her chamber, the player must get 40 Zarosian killcount, and have 80 Attack.'+
                      ' Players can easily get killcount by visiting nodes that Zarosian groups are attacking or simply kill the ones inside the fortress area.\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/Vindicta/Strategies>\n\n'+

                      'For more on this boss enter the command **boss-vinny more**\n\n'+

                      '__Preferred Combat Style__: Melee\n\n'+

                      '__**Gear Setup**__:\n'+
                      'More Effective >  Less Effective \n\n'+

                      '__*Armour*__\n'+
                      'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                      'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                      'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                      'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                      'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                      'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                      'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                      '__*2h Weapon*__\n'+
                      'Noxious scythe >	Dragon Rider lance >	Attuned crystal halberd >	Chaotic maul\n'+
                      '__*Dual Wield*__\n'+
                      'Drygore weaponry >	Tetsu katana >	Blade of Nymora/Avaryss >	Attuned crystal dagger\n'
                    );
}
});
bot.on('message', (message)=>{
  if (message.content == '!boss-vinny more'){
    message.author.send('__**Vindicta (more)**__\n\n'+

                        '__**PHASE 1**__\n'+
                        'Players should be able to recover the lost health through Soul Split; just remember to flick back to protect/deflect melee to avoid taking large hits.\n'+
                        'After several attacks into the battle, Vindicta will call on Gorvek to unleash dragonfire on her target.'+
                        ' This will deal rapid magic damage of up to 1000 per tick.\n'+
                        'This ability is signified when Vindicta raises her swords into the air. Simply run out of the way of the wall; however, the direction is completely random, so be prepared to take some damage.\n\n'+

                        '__Vindicta\'s attack pattern is as follows:__\n\n'+

                        '**At the start of the fight**\n'+
                        '-Does 2 auto-attacks\n'+
                        '-Hurricane\n\n'+

                        '**Rest of phase 1**\n'+
                        'Does 2 auto-attacks\n'+
                        '-(team only) Does 1 auto-attack\n'+
                        '-(team only) Ranged attack\n'+
                        '-(team only) Does 1 auto-attack\n'+
                        '-Dragonfire wall\n'+
                        '-Does 3 auto-attacks\n'+
                        '-Hurricane\n'+
                        '-Repeat\n\n'+

                        'Once Vindicta falls at half health, phase 2 begins.\n\n'+

                        '__**PHASE 2**__\n'+
                        'If using melee, do not use Assault and/or Destroy while she is mounting him as she gains increased collision size and will move all over the place, cancelling them out.\n'+
                        'Wait a few seconds for Vindicta to settle and come to you before attacking her.\n\n'+

                        '__Vindicta will follow a set attack pattern during this phase__:\n'+
                        '-Melee attack\n'+
                        '-Ranged attack\n'+
                        '-Melee attack\n'+
                        '-Dragonfire attack(aka purple vape #doyouevenvapebro)\n'+
                        '-Repeats\n\n'
                        );

  message.author.send('__Preferred Combat Style__: Melee\n\n'+

                      '__**Gear Setup**__:\n'+
                      'More Effective >  Less Effective \n\n'+

                      '__*Armour*__\n'+
                      'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                      'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                      'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                      'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                      'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                      'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                      'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                      '__*2h Weapon*__\n'+
                      'Noxious scythe >	Dragon Rider lance >	Attuned crystal halberd >	Chaotic maul\n'+
                      '__*Dual Wield*__\n'+
                      'Drygore weaponry >	Tetsu katana >	Blade of Nymora/Avaryss >	Attuned crystal dagger\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/Vindicta/Strategies>'
                      );
}
});

////////////////////////////
/*Gregorovic*/
bot.on('message', (message)=>{
  if (message.content == '!boss-greg'){
    message.channel.send('__**Gregorovic**__\n'+
                          'Gregorovic is the general of Sliske\'s army located northeastern area in The Heart, which requires 80 Prayer to enter.\n'+
                          'To enter his chamber, players must kill 40 Sliskean monsters.'+
                          ' Players can easily gain killcount by visiting Sliske\'s Necropolis or by visiting nodes that Sliskean forces are attacking.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Gregorovic/Strategies>\n\n'+

                          'For more on this boss enter the command **boss-greg more**\n\n'+

                          '__Preferred Combat Style__: Melee\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >  Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                          'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                          'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                          'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                          'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                          'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                          'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                          '__*2h Weapon*__(recommended)\n'+
                          'Noxious scythe >	Dragon Rider lance >	Attuned crystal halberd >	Chaotic maul\n'+
                          '__*Dual Wield*__\n'+
                          'Drygore weaponry >	Tetsu katana >	Blade of Nymora/Avaryss >	Attuned crystal dagger\n'
                        );
  }
});
bot.on('message', (message)=>{
  if (message.content == '!boss-greg more'){
    message.author.send('__**Gregorovic (more)**__\n\n'+

                        '__**KEY NOTES**__\n'+
                        'Gregorovic, like all the other generals in the Heart, has 200,000 lifepoints. However, he is considered the hardest general because of his accurate and high-damage attacks.\n'+
                        'Gregorovic is capable of poisoning the player in quick intervals with his attacks, though the poison only lasts for about 20 seconds.\n'+
                        'Antipoisons do work, but because the poison piles up quickly, its effects will not last that long. It is recommended to have the venomblood perk. '+
                        'Gregorovic uses normal melee and ranged attacks; he swings his glaives up close for melee and throws them with ranged.\n\n'+


                        '__Gregorvic\'s attack pattern is as follows:__\n\n'+

                        '-3 auto-attacks\n'+
                        '-Trick Knife (3x)\n'+
                        '-3 auto-attacks\n'+
                        '-Summon spirit\n'+
                        '-3 auto-attacks\n'+
                        '-Glaive throw\n'+
                        '-Repeat\n\n'+

                        '__**Trick knife**__\n'+
                        'This will hit three times in total and will bounce between players, even if they are in the lobby area. It will also bounce between shadows if any are present.\n'+
                        'Protect/Deflect Ranged with Devotion or Debilitate are recommended to reduce the damage from this attack, as the knives have 100% accuracy and can hit up to 2300 damage.\n'+
                        'This attack can be melee damage if player is within melee range of Greg.\n\n'+

                        '__**Summon Spirit**__\n'+
                        'Three more attacks after the knife throw, Gregorovic will say "RISE, CHILD!".\n'+
                        'This will summon a Spirit of rage, Spirit of delirium or Spirit of mania from the respective masks depending on where he was when he summoned them.'+
                        'Each spirit will give a different effects to Gregorovic if they touch him without being distracted, to distract the spirit simply attack it.\n\n'+

                        '__**Glaive Throw**__\n'+
                        'Gregorovic will toss both of his glaives into the air. Shadows will appear throughout the arena in a scattered formation.\n'+
                        'After two seconds, daggers and knives will fall from the ceiling and deal up to 1,700 magic damage onto the player if they did not move away from any shadowed spots.'


                      );
  message.author.send('When Gregorovic reaches 140,000 and 60,000 life points, he will summon 2 or three shadows, respectively, onto the field.\n'+
                      'These shadows, just like the spirits, only have 3,000 life points. Their spawn location is completely random as they spawn all over the arena.\n'+
                      'While the shadows are alive, Gregorovic can swap places with the shadow copies, which can interrupt abilities if far away and can allow him to throw melee attacks on the player if a shadow is next to them.\n\n'+

                      '__Preferred Combat Style__: Melee\n\n'+

                      '__**Gear Setup**__:\n'+
                      'More Effective >  Less Effective \n\n'+

                      '__*Armour*__\n'+
                      'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                      'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                      'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                      'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                      'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                      'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                      'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                      '__*2h Weapon*__(recommended)\n'+
                      'Noxious scythe >	Dragon Rider lance >	Attuned crystal halberd >	Chaotic maul\n'+
                      '__*Dual Wield*__\n'+
                      'Drygore weaponry >	Tetsu katana >	Blade of Nymora/Avaryss >	Attuned crystal dagger\n\n'+

                      'For a strategy guide visit <http://runescape.wikia.com/wiki/Gregorovic/Strategies>'
                    );
  }
});

////////////////////////////
/*Twin Furies*/
bot.on('message', (message)=>{
  if (message.content == '!boss-twins'){
    message.channel.send('__**Twin Furies**__\n'+
                          'The Twin Furies are located at the north-western corner of The Heart. To enter their chamber,'+
                          ' the player must gain 40 Zamorakian kill count, and have 80 Ranged.\n'+
                          'Switching between protect/deflect melee and soul split is reccomended when fighting twins.'+
                          ' Twin Furies share their health, so a combined total of 200,000 damage on one or both will kill them both even if'+
                          ' they have more life points than the health bar on the top suggests.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Twin_Furies/Strategies>\n\n'+

                          'For more on this boss enter the command **boss-twins more**\n\n'+

                          '__Preferred Combat Style__: Melee(highly recommended)\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >  Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                          'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                          'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                          'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                          'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                          'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                          'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                          '__*2h Weapon*__(recommended)\n'+
                          'Noxious scythe >	Dragon Rider lance >	Attuned crystal halberd >	Chaotic maul\n'+
                          '__*Dual Wield*__\n'+
                          'Drygore weaponry >	Tetsu katana >	Blade of Nymora/Avaryss >	Attuned crystal dagger\n'
                      );
  }
});
bot.on('message', (message)=>{
  if (message.content == '!boss-twins more'){
    message.author.send('__**Twin Furies(more)**__\n'+
                          'The Twin Furies are perhaps the easiest of the four generals to most players, as proper use of halberd mechanics, '+
                          'Soul Split and either the Vampyrism aura or scrimshaw allows a player to stay in the instance for the whole duration without having to bank. '+
                          'Using just Soul Split alone will not be enough to recover lost health from their attacks.\n\n'+

                          '__**The Twin Furies use 3 abilities during the fight against the player:**__\n\n'+

                          '__Wall Charge__- Avaryss will jump onto the walls and fly in a straight line, covering a 3x3 area in front of her. She will yell out a random quote before charging. '+
                          'Players who get caught in the charge are knocked into the wall and are dealt with up to 2000 melee damage. Using protect melee here will reduce damage. '+
                          '**Avaryss always follows the set pattern of north to south, west to east, south to north and finally east to west.**\n\n'+

                          '__Ceiling collapse__- Nymora will stand in one of the 4x4 tiles, saying "We will purge them all!" in the process. '+
                          'After a few seconds, she will fly up, becoming unattackable while attacking the ceiling. Stalactites will fall down and deal ranged damage of up to 1000 every three ticks. '+
                          'To avoid taking damage stand right next to or under Nymora as the stalactites do not fall on her location.\n\n'
                          );
    message.author.send('__Channeled Bomb__- Avaryss and Nymora will fly to the centre of the room, and ring of fire will appear in the outer area, dealing up to 2500 damage every few ticks the player(s) are in it. '+
                        'They will channel their powers to create a portal of energy which sends out fire bolts at the player for up to 350 damage per tick. '+
                        'During this process, they will not attack the player and will suffer a **2x damage multiplier** on them.\n'+
                        '__**IMPORTANT**__\n'+
                        'A blue bar will also appear over their heads and will change to orange over time. Once the bar is completely orange, the portal explodes and deals up to 4500 damage to players in its radius. '+
                        'Just a few seconds before the explosion, the outer ring of fire will dissipate leaving just enough time to run away from the explosion.\n\n'+

                        '__The Twin Furies use this attacking pattern:__\n'+
                        'Wall charge\n'+
                        '-Several auto-attacks\n'+
                        '-Ceiling collapse\n'+
                        '-Several auto-attacks\n'+
                        '-Channelled bomb\n'+
                        '-Several auto-attacks\n'+
                        '-Repeat\n\n'+

                        '__Preferred Combat Style__: Melee(highly recommended)\n\n'+

                        '__**Gear Setup**__:\n'+
                        'More Effective >  Less Effective \n\n'+

                        '__*Armour*__\n'+
                        'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                          'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                        'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                        'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                        'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                        'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                        'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                        '__*2h Weapon*__(recommended)\n'+
                        'Noxious scythe >	Dragon Rider lance >	Attuned crystal halberd >	Chaotic maul\n'+
                        '__*Dual Wield*__\n'+
                        'Drygore weaponry >	Tetsu katana >	Blade of Nymora/Avaryss >	Attuned crystal dagger\n\n'+

                        'For a strategy guide visit <http://runescape.wikia.com/wiki/Twin_Furies/Strategies>'
                      );
}
});
//////////////////////////////
// Helwyr
bot.on('message', (message)=>{
  if (message.content == '!boss-helwyr'){
    message.channel.send('__**Helwyr**__\n'+
                          'Helwyr is located in the southeast area of The Heart. To enter his chamber, the player must get 40 Serenist kill count, and have 80 magic.\n'+
                          'As soon as Helwyr spawns, be prepared to use Surge or Escape, as he will immediately grow three random mushrooms in the chamber.'+
                          ' Helwyr does his abilities in after sequence of 3 auto attacks. Pray Protect/Deflect Melee throughout the fight.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Helwyr/Strategies>\n\n'+

                          'For more on this boss enter the command **boss-helwyr more**\n\n'+

                          '__Preferred Combat Style__: Magic(recommended)\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >  Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Tectonic mask >	Virtus mask >	Anima Core helm of Seren >	Superior seasinger\'s hood\n'+
                          'Amulet of souls	Reaper necklace	Arcane blood necklace	Saradomin\'s hiss\n'+
                          'Tectonic robe top >	Virtus robe top >	Anima Core body of Seren >	Superior seasinger\'s robe top\n'+
                          'Tectonic robe bottom >	Virtus robe legs >	Anima Core legs of Seren >	Superior seasinger\'s robe bottom\n'+
                          'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                          'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                          'Completionist cape >	TokHaar-Kal-Mej >	Max cape > Skill cape\n\n'+

                          '__*2h Weapon*__(recommended)\n'+
                          'Noxious staff >	Camel staff / Staff of darkness >	Attuned crystal staff >	Chaotic staff\n'+
                          '__*Dual Wield*__\n'+
                          'Seismic wand/singularity >	Seasinger kiba/makigai >	Wand of the Cywir elders/Virtus book >	Attuned crystal wand/orb\n'
                      );
  }
});
bot.on('message', (message)=>{
  if (message.content == '!boss-helwyr more'){
    message.author.send('__**Helwyrs(more)**__\n'+
                        'Helwyr only uses melee attacks which hit up to 1200, unlike the other generals which have multiple combat styles at their disposal. '+
                        'Start off the kill by attacking Helwyr, getting out of the way of any active mushrooms. Continue attacking him until he performs his cleave attack; '+
                        'simply run out of the way to avoid taking damage. '+
                        'If you are low on health, this cleave attack can be resonanced; the cleave attack will always hit (and hit hard).\n\n'+

                        'After three more attacks, Helwyr will use his enrage attack; this can be easily mitigated with Debilitate (after which you move away from him) or Devotion to fully block his damage while attacking him. '+
                        'Use Freedom after his enrage attack ends to clear off the bleed he placed on you.\n\n'+

                        '__He has 4 abilities he will use during the fight:__\n\n'+

                        '-"YOU. WILL. BLEED!" - Helwyr stands upright and slashes at the area in front of him in a cone radius. '+
                        'Players caught in the clawed area will be hit for up to 3000 damage and start taking a bleed of 50. This can be avoided by quickly running right or left of him.\n\n'+

                        '-"You cannot escape me. Aaaargh!"__ - Helwyr leaps over to a nearby player and starts clawing around him. '+
                        'This will deal rapid melee damage of up to 1800 every two ticks and bleed the player for 50. '+
                        'The best way to combat this ise using Devotion negating all melee damage. Once this ability is over use freedom to clear bleeds.\n\n'+

                        '-"Nature, lend me your aid!" - Players should note that Helwyr\'s chamber is littered with mushrooms which align in a 5x5 area. '+
                        'When Helwyr does this, three of the mushrooms will be enlarged and puff out green gas. '+
                        'Players caught in the gas will be dealt with rapid hits of up to 250 every tick and if the player stands too long in them, will be bound for several seconds.\n\n'+

                        '-Howl - Helwyr howls, summoning two Cywir Alphas. They only have 3,000 lifepoints but should be killed anyways to prevent them from sniping resonance heals from Helwyr\'s bleed attack.'
                        )
    message.author.send('\n__**Helwyr follows the set attack pattern:**__\n'+
                        '-"Nature, lend me your aid!" (Grows gas-puffing mushrooms)\n'+
                        '-Does 3 auto-attacks\n'+
                        '-"You. Will. BLEED!" cleave attack\n'+
                        '-Does 3 auto-attacks\n'+
                        '-"You cannot escape me. Aaaargh!" spinning attack\n'+
                        '-Does 3 auto-attacks\n'+
                        '-Spawns Cywir Alphas\n'+
                        '-Does 3 auto-attacks\n'+
                        '-Repeats above sequence\n\n'+

                        '__Preferred Combat Style__: Magic(recommended)\n\n'+

                        '__**Gear Setup**__:\n'+
                        'More Effective >  Less Effective \n\n'+

                        '__*Armour*__\n'+
                        'Tectonic mask >	Virtus mask >	Anima Core helm of Seren >	Superior seasinger\'s hood\n'+
                        'Amulet of souls	Reaper necklace	Arcane blood necklace	Saradomin\'s hiss\n'+
                        'Tectonic robe top >	Virtus robe top >	Anima Core body of Seren >	Superior seasinger\'s robe top\n'+
                        'Tectonic robe bottom >	Virtus robe legs >	Anima Core legs of Seren >	Superior seasinger\'s robe bottom\n'+
                        'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                        'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                        'Completionist cape >	TokHaar-Kal-Mej >	Max cape > Skill cape\n\n'+

                        '__*2h Weapon*__(recommended)\n'+
                        'Noxious staff >	Camel staff / Staff of darkness >	Attuned crystal staff >	Chaotic staff\n'+
                        '__*Dual Wield*__\n'+
                        'Seismic wand/singularity >	Seasinger kiba/makigai >	Wand of the Cywir elders/Virtus book >	Attuned crystal wand/orb\n\n'+

                        'For a strategy guide visit <http://runescape.wikia.com/wiki/Helwyr/Strategies>'
                        )
  }
});

//////////  MEDIUM_LEVEL_BOSSES   /////////////////////////////////
//Corporeal_Beast
bot.on('message', (message)=>{
  if (message.content == '!boss-corp'){
    message.channel.send('__**Corporeal Beast**__\n'+
                          'The Corporeal Beast is the physical incarnation of the Spirit Beast, and is a very powerful boss monster,'+
                          ' and requires completion of the quest Summer\'s End to fight.\n'+
                          'After completing the quest Summer\'s End you can use the games neckalace to tele you to his caves.'+
                          '  Its most noteworthy defensive attribute is that it has 50% damage reduction against all non-spear weapons;'+
                          ' attacks from most other sources, including poison, only deal half damage.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Corporeal_Beast/Strategies>\n\n'+

                          'For more on this boss enter the command **boss-corp more**\n\n'+

                          '__Preffered Combat Style__: Melee\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >  Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                          'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                          'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                          'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                          'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                          'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                          'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                          '__*2h Weapon*__(recommended)\n'+
                          'Superior Vesta\'s spear > Mizuyari >	Choatic spear >	Sun spear >	Zamorakian spear'
                        );
  }
});
bot.on('message', (message)=>{
  if (message.content == '!boss-corp more'){
    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setImage('https://www.runehq.com/image/specialreports/corpbeasthunting/actionbar.png')
    message.author.send('__**Corporeal Beast (more)**__\n\n'+

                        'The Corporeal Beast is unique in that its armour will reduce incoming attacks by 50%, apart from spears which do full damage. '+
                        'It will also devour any familiars apart from the clan avatar, healing from them if the Beast has taken any damage.\n\n'+

                        '__**ATTACKS**__\n\n'+

                        '-Melee attack: A swipe or lunge at the player. Hits 3000 maximum.\n\n'+

                        '-Magic attack\n'+
                        '   -Hard hitting: A large magical orb. Hits around 5000 maximum.\n'+
                        '   -Stat drain: A small, faint looking white orb. Should it hit more than 0, it will drain one of these stats: Magic, Summoning or Prayer.\n'+
                        '   -Multi-split: It is very similar to the Beast\'s attacks in Summer\'s End. This attack can be avoided by simply moving out of the way.\n\n'+

                        '-Dark core: The Beast summons a Dark energy core. '+
                        'If you\'re within a 3x3 radius (the tile the core is on and 1 tile in any direction), it will deal rapid damage (from 150-600) to any nearby players,'+
                        ' sending this damage into health for the Beast and also draining prayer points from the players who are hit by the core.\n\n'+

                        '__**STRATEGIES**__\n\n'+

                        'When killing the Beast, players must note that all non-spear weapons will deal only 50% damage.'+
                        ' Therefore, the most popular weapons to use are the Mizuyari, and the chaotic and Zamorakian spears.'+
                        ' The Vesta\'s spear can be used since its charges in combat has increased significantly and if upgraded it is the best in slot weapon for Corporeal Beast.\n\n'+

                        '**Protect/Deflect Magic prayer should be used**\n\n'+

                        'When using a melee setup, hold Hurricane, Quake, and Cleave for when the core spawns.\n'+
                        'Since these three abilities can hit the square under you, it is possible to kill the core without diverting attention from the Beast.\n\n'+

                        'Here is and example actionbar' ,{ embed });


    message.author.send('__Preffered Combat Style__: Melee\n\n'+

                        '__**Gear Setup**__:\n'+
                        'More Effective >  Less Effective \n\n'+

                        '__*Armour*__\n'+
                        'Malevolent helm	> Torva full helm	> Anima Core helm of Zaros >Superior tetsu helm\n'+
                        'Amulet of souls >	Reaper necklace >	Brawler\'s blood necklace >	Saradomin\'s whisper\n'+
                        'Malevolent cuirass >	Torva platebody >	Anima Core Body of Zaros >	Superior tetsu body\n'+
                        'Malevolent greaves >	Torva platelegs >	Anima Core Legs of Zaros >	Superior tetsu platelegs\n'+
                        'Goliath gloves >	Razorback gauntlets >	Torva gloves >	Pneumatic gloves\n'+
                        'Emberkeen boots >	Torva boots >	Steadfast boots >	Bandos boots\n'+
                        'Max Cape > Skill Cape > Obsidian Cape\n\n'+

                        '__*2h Weapon*__(recommended)\n'+
                        'Superior Vesta\'s spear > Mizuyari >	Choatic spear >	Sun spear >	Zamorakian spear'
                      );

  }
});

bot.on('message', (message)=>{
  if (message.content == '!boss-aken'){
    message.channel.send('__**Har-aken**__\n'+
                          'Har-Aken is the final boss of the Fight Kiln combat minigame, encountered on wave 37 of the minigame. '+
                          'Entering the Fight Kiln requires having done The Elder Kiln, as well as a one-time payment of a fire cape. '+
                          'It\'s a tougher and improved sequel to the TzHaar Fight Cave minigame, and is extremely difficult to complete for the average player. '+
                          'It is highly recommended to watch a tutorial video before attempting this boss.\n\n'+

                          'There are many TokHaar-Ket-Dills which require you to break there armour with a pickaxe. '+
                          'The Tokkul-Zo ring is also reccomended as it increases the dammage dealt to TzHaar, Fire or Obsidian creatures by 10%.\n\n'+

                          'For a strategy guide visit <http://runescape.wikia.com/wiki/Fight_Kiln>\n\n'+

                          'For a boss guide video watch <https://www.youtube.com/watch?v=g1KWJUv5nG4&t=564s>\n\n'+

                          'For more on this boss enter the command **boss-aken more**\n\n'+

                          '__Preffered Combat Style__: Range\n'+
                          '(can be done in any combat style)\n\n'+

                          '__**Gear Setup**__:\n'+
                          'More Effective >   Less Effective \n\n'+

                          '__*Armour*__\n'+
                          'Obsidian helm > Pernix Cowl > Armadyl Helmet\n'+
                          'Amulet of souls > Blood Amulet of fury\n'+
                          'Obsidian platebody > Pernix Body > Armadyl Chestplate\n'+
                          'Obsidian platelegs > Pernix chaps > Armadyl Chainskirt\n'+
                          'Obsidian gloves > Pernix Gloves > Armadyl Gloves \n'+
                          'Obsidian boots > Pernix Boots > Armadyl Boots \n'+
                          'Max cape > Skill cape\n\n'+

                          '__*2h Weapon*__\n'+
                          'Nox > Obliteration > Darkbow\n'+
                          '__*Dual Wield*__\n'+
                          'Ascensions crossbows >	Shadow glaives > vengful kiteshield(switch)'
                        );
  }
});
bot.on('message', (message)=>{
  if (message.content == '!boss-aken more'){
    message.author.send('__**Har-aken (more)**__\n\n'+

                        '(Note: These values are for optimal survivability rates. It is entirely possible to complete the Fight Kiln without any of these skills.)\n\n'+

                        '92/95 or 70 Prayer (for Soul Split and Turmoil/Torment/Anguish, or for Piety/Rigour/Augury)\n'+
                        '80+ Attack, Defence, Strength, Constitution, Ranged, and Magic\n'+
                        '96+ Herblore (for overloads)\n'+
                        '96 or 67 Summoning (for Pack Yak or War tortoise)\n'+
                        '85+ Smithing for obsidian armour (can be boosted or assisted)\n\n'+

                        '**INVENTORY**\n\n'+

                        '__For high level players__:\n\n'+

                        '-Equipment for multiple styles\n'+
                        '   -1 melee weapon (used in tandem with a pickaxe on the tool belt,\n'+
                        '   of rune quality or higher to break the armour of the many TokHaar-Ket-Dills),\n'+
                        '   dreadnips, or a steel titan. Dreadnips and steel titans are very effective against the TokHaar-Ket-Dill.\n'+
                        '-2 Supreme overload potion or 2 Overload flasks (if you do not have overloads, replace them with 2 Super warmaster\'s potions)\n'+
                        '-2 Prayer renewal flasks\n'+
                        '   -Alternatively, 2 Super prayer renewal potion\n'+
                        '   -Alternatively, instead of 2 overload and 2 prayer renewals, 2 Holy overload potions\n'+
                        '-2 Saradomin brew flasks/2 Super saradomin brew flasks/Summer pies/Rocktails*\n'+
                        '-4 Super restore flasks\n'+
                        '-1 Adrenaline potion\n'+
                        '-1 Weapon poison++\n'+
                        '-Enhanced excalibur (free passive healing that does not require any adrenaline - it shares its cooldown with Rejuvenate and Guthix\'s blessing)\n'+
                        '-Ring of vigour\n'+
                        '-Water Surge runes\n\n'+

                        '__For lower levels/if using lower-end gear__:\n\n'+

                        '-Equipment for all combat styles (on average this takes 8 inventory spaces)\n'+
                        '   -1 melee weapon (used in tandem with a pickaxe on the tool belt, of rune quality or higher to break the armour of the many TokHaar-Ket-Dills)\n'+
                        '-2 Super warmaster\'s potions\n'+
                        '-2 prayer renewal flasks\n'+
                        '-4 saradomin brew flasks\n'+
                        '-6 super restore flasks\n'+
                        '-4 Summer pies or Rocktails (more or less, depending on what gear you\'re carrying)\n'+
                        '-Water wave runes\n\n');

    message.author.send('**BEAST OF BURDEN INVENTORY**\n\n'+

                        'If using a pack yak:\n\n'+

                        '   -20+ Summer pies or Rocktails (For higher levels little food is actually needed)\n'+
                        '   -4 Super restore flasks\n'+
                        '   -1 Unicorn stallion pouch (if beast of burden runs out)\n'+
                        '   -100 Healing aura scrolls\n\n'+

                        'If using a war tortoise:\n\n'+

                        '    -12 Summer pies or Rocktails\n'+
                        '    -4 super restores\n'+
                        '    -2 extra pouches\n'+
                        '    -If bringing a healing familiar, replace 2 Summer pies with the healing familiar and a decent number of scrolls.\n\n'+

                        'Using combat familiars like steel titan can be brought as well.\n\n');

    message.author.send('**ABILITIES**\n\n'+

                        'The last three abilities will require the use of a shield so remember to bring one.\n\n'+

                        'The Resonance ability should be used as often as possible to help heal the damage. (very risky but if you use res then disable prayers against '+
                        'Jad it will heal you massive health)\n'+
                        'The Regenerate ability should be used at the end of every wave so try to keep your adrenaline high at the end of a wave.\n'+
                        'The Rejuvenate ability restores 40% of life points and all stats to their base levels. This ability may eliminate the need for food.\n'+
                        '(If using Rejuvenate, do not take off the shield for the full 10 seconds it takes to heal you or else the ability will not give its full effect.)\n\n'

                      );

  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  WEEEWOOOO COMMAND
bot.on('message', (message) =>{
 if (message.content == bot.config.prefix + 'weewoo'){
   message.channel.send('WEEEEE!!!!!WOOOOOOOO!!!!!!!');
 }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Clue Scroll messages*/
bot.on('message', (message) =>{
  if (message.content == '!cluescroll'){
    message.channel.send('Link to Strategy Guide: <http://runescape.wikia.com/wiki/Treasure_Trails#Types_of_clues>');
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////                         INVTENTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Invention index command*/
bot.on('message', (message) =>{
  if (message.content == '!invention'){
    message.channel.send('__Specifiy__\n\n'+

                          '!perks\n'+
                          '!augmentors\n'+
                          '!siphons\n'+
                          '!invention guide'
                          );
  }
});
bot.on('message', (message) =>{
  if (message.content == '!inv'){
    message.channel.send('__Specifiy__\n\n'+

                          '!perks\n'+
                          '!augmentors\n'+
                          '!siphons\n'+
                          '!invention guide'
                          );
  }
});

/////////////////////////////////////////////////////
///     perks
bot.on('message', (message) =>{
  if (message.content == '!perks'){
    message.channel.send('__Specifiy__\n\n'+

                          '!weapon perks\n'+
                          '!armour perks\n'+
                          '!tool perks\n'+
                          '!all perks');
  }
});

bot.on('message', (message) =>{
  if (message.content == '!perks all'){
    message.channel.send(''
                          );
  }
});


/*Augmentor tutorial*/
bot.on('message', (message) =>{
  if (message.content == '!augmentor'){
    message.channel.send('__**Augmentor**__\n'+
                          'An augmentor is a device used in the Invention skill to create augmented items. '+
                          'Weapons can be augmented at level 2, body armour and shields at level 16, tools at level 22, and leg armour at level 45.\n\n'+

                          '__**MATERIALS TO DISSASEMBLE**__\n'+
                          '-Pouches (check ge for best price/comp ratio)\n'+
                          '-Slayer rings\n'+
                          '-Battlestaves\n'+
                          '-Unstrung maple bows (or better)\n'+
                          '-2h swords (mithril or better)\n\n'+

                          '__**Slayer rings**__\n'+
                          'Slayer rings can be crafted with the purchase of the ability to do so from a slayer master. Once this ability is purchased, '+
                          'use an enchanted gem with a gold bar at a furnace to craft a slayer ring. Gold bars, magic shortbows, and maple logs are purchasable from G/E. '+
                          'You can purchase 600 enchanted gems every 24 hours from 2 slayer masters (300 from the slayer master in Taverly, 300 from any other slayer master). '

    );
  }
});

bot.on('message', (message) =>{
  if (message.content == '!augmentors'){
    message.channel.send('__**Augmentor**__\n'+
                          'An augmentor is a device used in the Invention skill to create augmented items. '+
                          'Weapons can be augmented at level 2, body armour and shields at level 16, tools at level 22, and leg armour at level 45.\n\n'+

                          '__**MATERIALS TO DISSASEMBLE**__\n'+
                          '-Pouches (check ge for best price/comp ratio)\n'+
                          '-Slayer rings\n'+
                          '-Battlestaves\n'+
                          '-Unstrung maple bows (or better)\n'+
                          '-2h swords (mithril or better)\n\n'+

                          '__**Slayer rings**__\n'+
                          'Slayer rings can be crafted with the purchase of the ability to do so from a slayer master. Once this ability is purchased, '+
                          'use an enchanted gem with a gold bar at a furnace to craft a slayer ring. Gold bars, magic shortbows, and maple logs are purchasable from G/E. '+
                          'You can purchase 600 enchanted gems every 24 hours from 2 slayer masters (300 from the slayer master in Taverly, 300 from any other slayer master). '

    );
  }
});

/*Siphons tutorial*/
bot.on('message', (message) =>{
  if (message.content == '!siphons'){
    message.channel.send('__**Siphons**__\n'+
                          'The equipment siphon is a device that can be created using Invention. '+
                          'Players need level 27 Invention and 200 inspiration to discover the equipment siphon and must discover the Equipment dissolver first.\n\n'+

                          '__**MATERIALS TO DISSASEMBLE**__\n'+
                          '-Maple logs\n'+
                          '-Magic shortbows(u)\n'+
                          '-Slayer rings\n\n'+

                          '__**Slayer rings**__\n'+
                          'Slayer rings can be crafted with the purchase of the ability to do so from a slayer master. Once this ability is purchased, '+
                          'use an enchanted gem with a gold bar at a furnace to craft a slayer ring. Gold bars, magic shortbows, and maple logs are purchasable from G/E. '+
                          'You can purchase 600 enchanted gems every 24 hours from 2 slayer masters (300 from the slayer master in Taverly, 300 from any other slayer master). '

                          );
  }
});
bot.on('message', (message) =>{
  if (message.content == '!siphon'){
    message.channel.send('__**Siphons**__\n'+
                          'The equipment siphon is a device that can be created using Invention.'+
                          ' Players need level 27 Invention and 200 inspiration to discover the equipment siphon and must discover the Equipment dissolver first.\n\n'+

                          '__**MATERIALS TO DISSASEMBLE**__\n'+
                          '-Maple logs\n'+
                          '-Magic shortbows(u)\n'+
                          '-Slayer rings\n\n'+

                          '__**Slayer rings**__\n'+
                          'Slayer rings can be crafted with the purchase of the ability to do so from a slayer master. Once this ability is purchased, '+
                          'use an enchanted gem with a gold bar at a furnace to craft a slayer ring. Gold bars, magic shortbows, and maple logs are purchasable from G/E. '+
                          'You can purchase 600 enchanted gems every 24 hours from 2 slayer masters (300 from the slayer master in Taverly, 300 from any other slayer master). '

                          );
  }
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          Herblore Recipes
//***********************************************************************************************************
//
// /*POTION_NAME Recipe*/
//  bot.on('message', (message) =>{
//    if (message.content == '!POTION_NAME'){
//     message.channel.send('__**POTION_NAME Recipe**__\n'+
//                          'POTION_RECIPE.\n'+
//                          'Req Herb Lvl: #.')
//    }
//  });
//
/*Overload Recipe*/
//ovl, ovls, and overload are excepted
bot.on('message', (message) =>{
  if (message.content == '!ovl'){
    message.channel.send('__**Overload Recipe**__\n'+
                          'Irit & Eye of newt > Super attack & Avantoe > Extreme attack\n'+
                          'Kwuarm & Limpwurt root> Super strength & Dwarf weed > Extreme strength\n'+
                          'Cantadine & White Berries > Super defence & Lantadyme > Extreme defence\n'+
                          'Dwarfweed & Wine of zammy > Super ranging & 5 Grenwall spikes > Extreme range\n'+
                          'Lantadyme & Patato cactus > Super magic & Ground mud runes > Extreme magic\n'+
                          'Extreme strength & Extreme attack & Extreme defence & Extreme range & Extreme magic > Overload')

  }
});
//aliases
bot.on('message', (message) =>{
  if (message.content == '!ovls'){
    message.channel.send('__**Overload Recipe**__\n'+
                          'Irit & Eye of newt > Super attack & Avantoe > Extreme attack\n'+
                          'Kwuarm & Limpwurt root> Super strength & Dwarf weed > Extreme strength\n'+
                          'Cantadine & White Berries > Super defence & Lantadyme > Extreme defence\n'+
                          'Dwarfweed & Wine of zammy > Super ranging & 5 Grenwall spikes > Extreme range\n'+
                          'Lantadyme & Patato cactus > Super magic & Ground mud runes > Extreme magic\n'+
                          'Extreme strength & Extreme attack & Extreme defence & Extreme range & Extreme magic > Overload')

  }
});
//aliases
bot.on('message', (message) =>{
  if (message.content == '!overload'){
    message.channel.send('__**Overload Recipe**__\n'+
                          'Irit & Eye of newt > Super attack & Avantoe > Extreme attack\n'+
                          'Kwuarm & Limpwurt root> Super strength & Dwarf weed > Extreme strength\n'+
                          'Cantadine & White Berries > Super defence & Lantadyme > Extreme defence\n'+
                          'Dwarfweed & Wine of zammy > Super ranging & 5 Grenwall spikes > Extreme range\n'+
                          'Lantadyme & Patato cactus > Super magic & Ground mud runes > Extreme magic\n'+
                          'Extreme strength & Extreme attack & Extreme defence & Extreme range & Extreme magic > Overload')

  }
});

/*Attack potion Recipe*/
 bot.on('message', (message) =>{
   if (message.content == '!attack'){
    message.channel.send('__**Attack Potion Recipe**__\n'+
                         'Guam & Eye of Newt.\n'+
                         'Req Herb Lvl: 1.')
   }
 });

 /*Ranging potion Recipe*/
  bot.on('message', (message) =>{
    if (message.content == '!ranging'){
     message.channel.send('__**Ranging Potion Recipe**__\n'+
                          'Guam & Redberrys.\n'+
                          'Req Herb Lvl: 3.')
    }
  });

/*Prayer restore recipe*/
bot.on('message', (message) =>{
  if (message.content == '!prayer restore'){
    message.channel.send('__**Prayer Restore Recipe**__\n'+
                        'Rannar & Snape grass.\n'+
                        'Req Herb Lvl: 38.')
  }
});

/*Anti-fire potion recipe*/
bot.on('message', (message) =>{
  if (message.content == '!anti-fire'){
    message.channel.send('__**Anti-fire Recipe**__\n'+
                          'Lantadyme & Ground blue dragon scale.\n'+
                          'Req Herb Lvl: 69.')
  }
});

/*Super Anti-fire potion recipe*/
bot.on('message', (message) =>{
  if (message.content == '!super anti-fire'){
    message.channel.send('__**Super Anti-fire Recipe**__\n'+
                          'Anti-fire & Desert pheonix feather.\n'+
                          'Req Herb Lvl: 85.')
  }
});

/*Super Restore potion recipe*/
bot.on('message', (message) =>{
  if (message.content == '!super restore'){
    message.channel.send('__**Super Restore Recipe**__\n'+
                          'Snapdragon & Red spider eggs.\n'+
                          'Req Herb Lvl: 63.')
  }
});


/*Super attack Recipe*/
bot.on('message', (message) =>{
    if (message.content == '!super attack'){
      message.channel.send('__**Super Attack Recipe**__\n'+
                            'Irit & Eye of newt.\n'+
                            'Req Herb Lvl: 45.')
  }
});

/*Super strength Recipe*/
bot.on('message', (message) =>{
  if (message.content == '!super strength'){
    message.channel.send('__**Super Strength Recipe**__\n'+
                          'Kwuarm & Limpwurt root.\n'+
                          'Req Herb Lvl: 55.')
  }
});

/*Super defence Recipe*/
bot.on('message', (message) =>{
  if (message.content == '!super defence'){
    message.channel.send('__**Super Strength Recipe**__\n'+
                          'Cantadine & White Berries.\n'+
                          'Req Herb Lvl: 66.')
  }
});

/*Super ranging Recipe*/
bot.on('message', (message) =>{
  if (message.content == '!super ranging'){
    message.channel.send('__**Super Ranging Recipe**__\n'+
                          'Dwarfweed & Wine of zammy.\n'+
                          'Req Herb Lvl: 72.')
  }
});
/*Super ranging Alias*/
bot.on('message', (message) =>{
  if (message.content == '!super range'){
    message.channel.send('__**Super Ranging Recipe**__\n'+
                          'Dwarfweed & Wine of zammy.\n'+
                          'Req Herb Lvl: 72.')
  }
});

/*Super Magic Recipe*/
bot.on('message', (message) =>{
  if (message.content == '!super magic'){
    message.channel.send('__**Super Magic Recipe**__\n'+
                          'Lantadyme & Patato cactus.\n'+
                          'Req Herb Lvl: 76.')
  }
});


//////////////////////////////////////////////////////////////////////////////////////
// '**ACTIONBAR COMMANDS** //
//
bot.on('message', (message)=>{
  if (message.content == '!actionbar'){
    message.channel.send('Please specify\n\n'+
                          '!actionbar magic dualwield\n'+
                          '!actionbar magic 2h\n'+
                          '!actionbar range dualwield\n'+
                          '!actionbar range 2h\n'+
                          '!actionbar melee dualwield\n'+
                          '!actionbar melee 2h\n'
                        )
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar tank'){
    message.channel.sendFile('./images/dualwieldmelee.jpg')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar magic dualwield'){
    message.channel.sendFile('./images/dualwieldmage.jpg')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar magic 2h'){
    message.channel.sendFile('./images/2hmage.jpg')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar range dualwield'){
    message.channel.sendFile('./images/dualwieldrange.jpg')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar range 2h'){
    message.channel.sendFile('./images/2hrange.jpg')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar melee dualwield'){
    message.channel.sendFile('./images/dualwieldmelee.jpg')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!actionbar melee 2h'){
    message.channel.sendFile('./images/2hmelee.jpg')
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////     ABILITY BOT 3 TIERED ABILITY SEARCH          /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /*ABILITY_NAME ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!ABILITY_NAME'){
//     message.channel.send({embed: {
//                             color: 8421504,
//                             thumbnail:{ url:'ABILITY_ICON_LINK'} ,
//                             author: {
//                             name: 'Defence',
//                             icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
//                             },
//                             fields: [
//                             {
//                             name: 'ABILITY_NAME',
//                             value: 'Members: Yes	Level: 91	Type: Ultimate	Cooldown: 300	Equipment: None.'
//                             }],
//                             image:{ url:'ABILITY_DETAILS_LINK'}
//                           }
//                         }
//                       );
//   }
// });


/* !abilities COMMAND */
bot.on('message', (message)=>{
  if (message.content == '!abilities'){
    message.channel.send('**Please specify which abilities:**\n\n'+

                          '!abilities magic\n'+
                          '!abilities range\n'+
                          '!abilities attack\n'+
                          '!abilities strength\n'+
                          '!abilities defence\n'+
                          '!abilities constitution')
  }
});


///////////////////////////////////////////
/*  CONSTITUTION ABILITIES  (still missing storm shards, guthix blessing, shatter, and reprisal.)*/
bot.on('message', (message)=>{
  if (message.content == '!abilities constitution'){
    message.channel.send('**Please Specify which abitity**:\n\n'+

                          '!ice asylum\n'+
                          '!incite\n'+
                          '!onslaught\n'+
                          '!regenerate\n'+
                          '!sacrifice\n'+
                          '!siphon ability\n'+
                          '!transfigure\n'+
                          '!tuskas wrath\n'+
                          '!special attack\n\n'+

                          '!abilities constitution all')
  }
});
bot.on('message', (message)=>{
  if (message.content == '!abilities constitution all'){
    message.channel.send({embed: {
                        color: 3447003,
                        author: {
                        name: 'Constitution Abilities',
                        icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                        },
                        title: 'This is an overview of all constitution abilities',
                        description: 'For more information on each ability use the name of the ability as the command.\n'+
                                      'ex. !ice asylum',
                        fields: [
                        {
                        name: 'Ice Asylum',
                        value: 'Members: Yes	Level: 91	Type: Ultimate	Cooldown: 300	Equipment: None.'
                        },
                        {
                        name: 'Guthix\'s Blessing',
                        value: 'Members: Yes	Level: 85	Type: Ultimate	Cooldown: 300	Equipment: None.'
                        },
                        {
                        name: 'Incite',
                        value: 'Members: Yes	Level: 24	Type: Basic	Cooldown: 0	Equipment: Any.'
                        },
                        {
                        name: 'Onslaught',
                        value: 'Members: Yes	Level: 90	Type: Ultimate	Cooldown: 120	Equipment: Any weapon.'
                        },
                        {
                        name: 'Regenerate',
                        value: 'Members: Yes	Level: 10	Type: Basic	Cooldown: 0	Equipment: Any.'
                        },
                        {
                        name: 'Reprisal',
                        value: 'Members: Yes	Level: 85	Type: Threshold	Cooldown: 60	Equipment: None.'
                        },
                        {
                        name: 'Sacrifice',
                        value: 'Members: No	Level: 10	Type: Basic	Cooldown: 30	Equipment: None.'
                        },
                        {
                        name: 'Shatter',
                        value: 'Members: Yes	Level: 70	Type: Threshold	Cooldown: 120	Equipment: Any.'
                        },
                        {
                        name: 'Siphon',
                        value: 'Members: No	Level: 20	Type: Basic	Cooldown: 60	Equipment: Any.'
                        },
                        {
                        name: 'Storm Shards',
                        value: 'Members: Yes	Level: 70	Type: Basic	Cooldown: 30	Equipment: Any weapon.'
                        },
                        {
                        name: 'Transfigure',
                        value: 'Members: No	Level: 10	Type: Ultimate	Cooldown: 180	Equipment: None.'
                        },
                        {
                        name: 'Tuska\'s Wrath',
                        value: 'Members: Yes	Level: 50	Type: Basic	Cooldown: 120 or 15 Equipment: None.'
                        },
                        {
                        name: 'Weapon Special attack',
                        value: 'Members: Yes	Level: 10	Type: Special	Cooldown: 0	Equipment: Special attacks.'
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                        icon_url: bot.user.avatarURL,
                        text: '© B5TA BOT'
                        }
                        }
                        });
  }
});

//INDIVIDUAL ABILITIES//(still missing storm shards, guthix blessing, shatter, and reprisal.)
/*ice asylum ability*/
bot.on('message', (message)=>{
  if (message.content == '!ice asylum'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/__lISDeQ3mrD6B2PDTJQd8Fy42fiu4iEx2TzZ44aG0AAIxoFYiTFc85pa2TV1Oi-u_bSUf267H7lRfW4WARhuaTqg6DHnBiWABXYw6k5jWlIevd0I1XCl3iY_2WbASQIB-OvjFXYWy8nLG9-B2Ld4rushXWlAqV1JaLVOuX1KzsSQ62W29WPnHd9mBNiBcxKVIh_HXFF36W8PmDTkMxStK5nkwVVzvzKzkfZerBoU7wke0WtOp9YpvMsd_fm3jVkb1up7E-TlSkN0xXCtUGOtklggR8ImpPZ_cKFKdUHyQwyi5ScLtJf04ffpF5C0CIIcJLTRxug0ZVCDnMsss4-KSlSeCWcm4OWrVVU9VRav627GK1tMnn6InDfSlw0TkZw4B61rq-q-NPWZ0TD6mjhG5SXGtqgQP4c47chNuf1BXczL3D-O8yAT_ouvubFc_WLI0oWRv-9ss9_kGsF9sKaGEglZmQzUFYwL1khVMufwcQVuKNsGmDShW9QoO1VDWIGUUVaJFvtVt0RMKfVTrkuxM7ZrZSM0TQD2rlr-2d-iRXQxf1R7drihlFRW26pRikqvaFoQ0jZbBEPUxOOsCXz8UTovj9bZIV0HHT6SaX_KDtTvs04TR-V=w33-h34-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Ice Asylum',
                            value: 'Members: Yes	Level: 91	Type: Ultimate	Cooldown: 300	Equipment: None.\n'+
                            'This ability is learned by reading the Codex Ultimatus, which is obtained by talking to the archaeological expert after completing The Dig Site quest.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/BD0P0uMC6phf92M5Hb_6ixPnQD3i-BzB_j6QpjDVDkp0Ol23WYv87uVQsAAvvv1jPGO7i2ZadrVpNHpZzjqRef0pzJhsB-lFm6tIxNXcOCU7cc2SkwrxvANkJDeo1ud4pWj1_jWFRSkBaASRwCBiB_BwToaWaPS8cHH5xiPnjV6zbwuvfickox4dZ7kcm7idddsgxc_YoDeyOMPS1KIGH13lvWDpccdw4hoWAw5oTBjhvcKrgN0Yp6PDwD2dsU33PhvPEbFx7V3Sqaz7rZzIRCuy0jYvVfCWoYWhnkjeKhHI0FsRKMReIGrdX-Zbv6hwsjirKsvVKtBwPRaf8JfLAU6YwKxpCk5C6bK7XDQz9QvkGYndaRtEoEe6EzS-u21zVIB0zQjiYZ5fqhAeB3mX9YcrENimqbYetYi79bFD9y6vL0MdI_g2qbCO87FHoauzNfgOAuHVDWMaEcSj6Or_Uaq3ZOOEL7t-8q3gAfjmg8yOsFYpe_zym79nAmJ7K6WhQ2N_6ZZwRvH00Qv918uPH8K8QrnNhZNRiuFtrWzX_UfWY2ZMy65CNmCaYlw5MAcaFRkL1h-TQdC-oPxboUFfYM6nhbYd8Q4MYPQYgD_4ayTLhldwMZBC=w256-h234-no'}
                          }
                        }
                      );
  }
});


/*incite ability*/
bot.on('message', (message)=>{
  if (message.content == '!incite'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/JIMC4flOqsHYNOtySidLs3RIkM1J3Mp6ZlK91U_g1HYAJe_7GtcEDfWuLna8kXQWDW8GYnvZejs1Sf4GakMUoB8SSlU5MqkX8Yb64qMXWwVTtZa6KV88eVUHk6_nptxhBh6an9j1Lp_HoHaQHM1Ycrqv-Q__MVPHm7MukVghPl6ZVJ0zS-5uUjEG_MHxggciiVV0F04jyKNEDuBAVeYi4QOQwsAhXsbdcKscv1xarEJvnJ341J-wTwIcYrbj67yeD8dWV1BW-h0LZR50Q-jugKoDg5ckRHkQOhftySlRm52utFBS39qISdx4hTcaVWo0EQEdOHEF9BNn28EDUi3O4xv1-Ei2lwRi0gfqRIqDy0koWehatbJd80A7FSyYGQhCCIg05kuEpwl_h1L3g51HK1QrzW9IoJgjjgsTSkZikGr21CKWiMF6GPIy6k01v6QwY_cBSnzIyDSlK6A6oTXgKnp5UxjdsaNiy9Fvvj4IaU42mez4Y5n0mpvnz1tZcXypc7BWXRtkKzVZ_74wYeHe2oFrKBAB9tbdw3-p1JJFflrQWAzgj_5QmR8ynt7ffXX0f8uzXlIeytt1a-h-jpcOBRTkUzUOpKC9_LVhGNKSbvQ9eBWddZ_6=w37-h32-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Incite',
                            value: 'Members: Yes	Level: 24	Type: Basic	Cooldown: 0	Equipment: Any.'

                            }],
                            image:{ url:'https://lh3.googleusercontent.com/s_d-GnrXnsObJE1WpgSANXiCLWAGSfYpuibh74pSgmXtZG-1fm4Kpjk3hUU9D2CnmVc90-E1YEqUrpEoE48TZr8tIQd2pzCT8o-d_Ts3-MjIzXrhUAmCBtb-z9s6TbVC1_ske3rVyVFTAoydRJCz8OUEzPN-7oFAxQoX0MYqBm0H8Kx2CjLzFznI7PTWM1tEi2PAbEA6Weufko9CsIK0YUsmjbcXkc4gX_kfCVPSvzsPmJvmgwFBbf5LVfvnlYAcfqU9wShGvgxgQUpeyUbbfbdXlb90PY7ICQx4OdKKG9swb8r11ZtUjurKieiAO19s_LVWi4_4STMvyN60TzEdNmi6TJ96a2Gd71iGRuFDQBk32xm9zppxNgnqQVHRcXr0R-euHeH9CpMq4WU_NiDXo9Ls0tuqxC2f0Eni4Oje1QSQalv6v_W8Zmxh5XiIFlVktQjhY--icBZ0Lzgb-wPUPXLVtjaI6uEclnTlHLUj_iuXIxT4cXNot-FA7Ikce5YIB3tmU18wvpHW3lHY7vCiilBzu8VVss-6TNq3X7Ap0zKLw_gQIdykK3S77Wq_pfCIX-AMpRZJ3fBXZ9f9KKWqHs1UJPxdtAvaniohSUwoQAzIIrJlI1-R=w251-h173-no'}
                          }
                        }
                      );
  }
});

/*onslaught ability*/
bot.on('message', (message)=>{
  if (message.content == '!onslaught'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/Dwb7nynvJQcBFsYiSAD4mIrYrcL1i7NZE786D9H7VOxl8hhXQNND1JhAMco9Ed67v_gedvs30GUaP-CYIcCPgbOCFkZJhZH97go3PKVjC0MDyiplv7VKd7Fqwh01-gCmWAS-87ualCEd2kz-y-5JYk-jHKUFLdBHaRMg0xk37MzBIwRZSOljc5csXAj_aA2ETDCl8vhHp09Dq5NaQIKvTAbo6h-vE54pMx78aE8o2HP7Vs9geP0B0valrfAuURzV0kue224vb3qySMeY2qB0VUbi90kZUNMd8qAB-O5-ASOBpIEdQNSk-GhUOEERbvDTFGtr85K0wJs_ywVlnkOjtJQuFlXc8WoVw1owFHvKDvdeN9pvi9t7xYLuSnRIRxqaQVl2ujLgQ5vT1rEuWooZgrqec2F5IRh5pRgN8ReoWQs6d0iyCZAa3S-vghxwonnLzoKBVQ5ESOeSBSHlPgzablH_jCph01_ak7q5u1QGbGpWsRzLnuempgzTERqWsRqzfSuQZ7ao1JuITv6WmSCy5vT9pJ0Q45AXrwWc2u1ICdGl5ny_mRyZbT6aglfNgUOtpOLPIQUUNbPTob9csrbCGttlJ-SscjeG3_PtoUS4-B0eVElSHXjR=w34-h33-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Onslaught',
                            value: 'Members: Yes	Level: 90	Type: Ultimate	Cooldown: 120	Equipment: Any weapon.\n'+
                            'Onslaught is a channelled ability, unlocked through Raids from either the untradeable Onslaught Ability Codex, or the tradeable Mazcab ability codex. As a Mazcab ability, Onslaught has a damage cap of 30,000 per hit.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/HvvN14pW6K5ggv-jkEWTpmUQR-gEHTMstBUDZKuIBF3PbESBqeIu0Vpfxw2nUr74adbGvEjKBwPF06le8n3tY6OreIQS6ezX6howMxHxIzbYuiabbmKbTAUUB7F85_NYiuD6BqEl9gJ_I_kPd1LlYZTcfaQJii-3-qmWpxUtJlZu_sFXmJ_4xu3oUmpC97uYALY6E5glGTjv8N8cjNwWUwmdtcmMEJ91A9g4dkfjO6Ik9D3i_Nrj1YQ9OxP2dwbIz1LO_nuWpXmj3R-ec9vh6UB60zI-z09Xs_KCtoECcXnbxTQhUO987jU1A9-ho0jjhP5audWEb0tg19VHKNAlNNyTLxtFouM7tbAoLGLSggUw7aji6JqyVBZQgIwsmECWihUajX1R-W0iKIXEqkV3G0oQAj0eH2jEoGCQIcsOBDDafX6PizwXGLVhQ9eqckBHvd5j8AKzfvWWf4H9DcVJ4VmsgZFtk5NtXifpUXdlpc2a7lgFn_59pUiUe9mLpC2lY9Vhpyft-FZrhVhijuwdwuGo_Qwmj7bDaSS8Wr5eOiZeQN-B3SmIp00QabEejfU_RpYZQJOZPbEmbZKcLONyq98CEbyYkOBo-pwMeIu829Lpdo--vg-1=w254-h232-no'}
                          }
                        }
                      );
  }
});

/*regenerate ability*/
bot.on('message', (message)=>{
  if (message.content == '!regenerate'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/NPIQWyjFDbl0zzOReRRNorVLZP1xnmSXfQRWjdIEB05Z-VLceJ9iNceV1llTj4F-SbXCZhfTFFjx4siEYZFTFvHIuzqbY_QT0TqDPLVrGT3JHnTwAQic7lWjeiA5eB7DJpPrc1vwdmXMiZK-4oj-b1KmdTHqKV1pUFd4NIzqYtq80H1bTeJbEmRwSJyCnhkjMbyo_xIH_vv6NevHKLQu4qUaHF4gD24QBV_UPQEvud9vORDWHVRLCwkD2iFROhYlLfap55pWUbtULyUBKQRp92zK-xjCgGe-OFlBa7Gfio_kwS1wCnGKFja_1wVgeNXm0V5wrNlg9oqsE5x2IbXDhlHj2kBhqsisqHPeVSSUbCwliBEbGc68iWVaeJs1QQc3UYg1HUu-Fbawcsuj7-Dnwi2AAT0COwDNKKnka7PF1IN4wztedSQyS42uQraXskhp68ZBJlDm78poQOe-7dmkfVDbsPy2xU_fbyYp8zyGs_VDcx2NCohhDeh6RBENkiaWSfegb5MaNbB7SIuByhkzS6N5rJYPYgP-8B99OSjdp7Qcme70dP3F-VWa4L560oHoIvaulu6d_C11yxRmSoHsrHJxPydSE6Y2eUiUluTOWlvs-jNScl6U=s34-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Regenerate',
                            value: 'Members: Yes	Level: 10	Type: Basic	Cooldown: 0	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/ONYZ-kRa3-08Mdb4y6o6QqsriK8mTGgD0wkxl-aft42Hbx-jDrDaY3GvcqNsMZpAW44KRirJAdSRUi8f3zjwAFcy9zepTBQnZnzoZiMM-MsxIUzWfSXuh9xUayAZiqv89nHj_FxMTjh8J5mL18haRzDlGn_O_iqKeABGQ3_ssk9DNgGta54F4dC3UhQY8NNAYLreuvDxcGX7OQ6xoUQAx0xR0TfpJvLE8gQwDS9wjdHW8zJwCelPwn31_q5dvxqYEndtAF9otdGt53BKJGxgs_q3o2tzXif66-EXSLiOfqNKwGQuVBFz2DK1O5LEdfkjbu6tUwVn-qJTCLxhtPTtmDnUCnq_TVCS7yNjvAJkwNG8dWhDTrNu-r9LMowpi1YzOGsdaF7M2b4Y-9ogPh3dTcJZ5GhHFQIyqzUqtYT6C0SC_4AalQkwL4I3YIpZMkpeCqLxZlIywYGtMwSQ_fp1SgOa2vnCute0v1RvTbiRk-dggiLxroj6ze-w61hQEmHp-S31tr08K08Ul9nG_oPj7EElQZZR9bOYcS3-RGieARAGuUgMPRUm_5Jg2PbebZShxtIS_7q_wzTRHNUDfp6u6yklv5OKKcbUdyjKJmCHm3redxd-0O0J=w255-h182-no'}
                          }
                        }
                      );
  }
});

/*sacrifice ability*/
bot.on('message', (message)=>{
  if (message.content == '!sacrifice'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/5ONDWzEJd57hhkqahy9gasHAX4W6ja0jOBKnfgxrVIujenwyBBCGf7YqZYZy354l3YmDO7qmLPWATENGLfSv6X8maVwW6tajYLJsOzwdPF2QU3etfnbLf5OAoP5_-V7hEbqE7H8SAjlcmuRXPQrCGt5xC1Dhr1RRy51J9iUaOBD1ntXQur41cMb4DI5tv4biNLn5KijHZlgSAyT_mmr5RvpPMUj-VkJ1upNLVyUvXs_p5-8sCyI16piNPLNGLled1zWySnMC7iBqBC5Na-svb3ZaekQyZUgLeKq1ZSO6b2TQUQ1_0w_7e-gcozHTUFksz4fZZ7dQI6H-jKQ1VzLrGg-b8veHDIJASqKqL0FqnLpWIj1ZJbNFQB0Syp2SgGw4Ko9DCLcA0h5Cs-SVQHrqdEibEc5QsssLt_cMM4dbJ9prHwgHwkScKlLZSbMHa0Rja-lnDqqZFtl-cVWithj0kx0unu_1E_npmn6vfh3yMZ6SqxfQ7q-TjssXvbsm2UzEaUOhA5FE0e_A0xJXh44adv5a7_5691dzEK3ymfyBrAFoEe6tB27AVUKTUhusGVB3M31FpmFlnNWeR1R-fM-Yiua34-e_CE82m_h1eQCgzNgwcb6SnlOh=w32-h31-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Sacrifice',
                            value: 'Members: No	Level: 10	Type: Basic	Cooldown: 30	Equipment: None.\n'+
                            'This ability can be obtained as a rare drop from General Graardor and Kree\'arra. It is also obtainable from their bodyguards.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/5y4pPcFRPYwgAYDCWUeJIwpebL2n7xHQK6Rb77Paz7fq5xzN0arpqWXs9lPZda0jeR2-SBp2Rd1nPaQSxLa7A3o1hmhIejFzGbp1sTNYdTjXBSzP3c0-F8YdkQIixjn10EmHPCJv3bgHcCBdMLJAV7q-wkNTzas8Ule3cNIE2wcBt3OuSdSyglSDy4YIpflge_n6K_Y8S4I0VRuk5zHyVm7P7yRSsBf3QpEyRpsqytadZ0K-aPbKsKj_XjAVoMc4y_aZ_NcOa7FNrbnGFTosrdoK4oGtYEzH2c10PcTEIntbVoWxaIEengkQJInCHVKs8iViXEWZTDl8VJG-9Edfm6bCIbmSRUqqmdnSsuR1VaojnHbL5cFfIv7MWN3FTb3WVCWiyCkm1Fgedf41GhBu5iKWQ5C3SZWv4GCkD3VkvZKaNPP1azC3cZZ5tuOKKYaIQ4UhlX932hBj7KbHt-iH14vvtnpcW9zmwSLVPHAaA6UFC8scsZEmUa55q0yGkgLnCp69SmiK-vfJeAym59RndKXYjzobaElohYYf94yYe7AdJJjaHiIs-PjSWwrrsdywvPQKwNbgYtTGW6Y_i6FHYWyRbYjSwQtS3F_3cYDRafXgnZoqMncU=w255-h170-no'}
                          }
                        }
                      );
  }
});

/*siphon ability*/
bot.on('message', (message)=>{
  if (message.content == '!siphon ability'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/nW0VJXGP84AY2pzRRcbf7XO79GHOZzzfZXboMWj_KeIyjbuy8e3OkZq5mumHWgyshbhbpugQAeh20F05s2nkw5lTvxVQvLk-vHYgYQFJe8wJc08WARTKhj3bEBIn2OOeJdMTywF8diLp6_j6UaNHpLKMjjXt8b-d8kWzj_VxIRbgOJTjb88MbMm-k8c6DJvmYbiQMQx8PVDTZanvRWwVcXspyfyyXIL2lv7Q0aTDusNFqickgoD2VgQEv-EstKsBEhq2RmKK6PldXowFQ3LK2ph-8PX_BeiXe9NUAcXBHzM-4utwW3UFBvFYNpulJ8BEIvEbSYmyx_NfDrOY6kOb2mjh-nDXbYy6L40xNDAVqc4xi6b50Vf3j9c-Pwef0LJ8xVA_UUURcp33ODfxoXph8ngFPq24HlTlsGhEjGDkxyl3CXeqgig9pfvgCORWBN5MH4jA32r0c2VLfKU0yZUjN-V_vX2YeOa2m0AEdY_FziKKD43XpUvhx9S9EuotCZybgrC6CS3hlSsLY9-6ouE_lM83dlPBuz57CTgbq49xrgCXIJrBWd1N5mkh_udwHxUPYm180twHmp0mS4F4SBICNj_2c7IBBrHX17VmDB-v7Pk438tARLMh=s33-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Siphon',
                            value: 'Members: No	Level: 20	Type: Basic	Cooldown: 60	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/cLkhesUQIQH7kfEcFAjJ_XG_1RndESBZYCr9q9Zb0yh6HymcfnNiOwpIOFx2f4eiIjUXr4C7ftaWPRfl33E92xBhpTNgIdHCikDgVa03TJxAfV_Ci-ZEe8mi6xid4BLHNnYPR7p1qz4OrJRVLlHtmm1IvrfQwYcxntmUXlNRHdiERUcegFDJ-cLuAv1amt2GT6CElFLcWi4ACQIbezhlFiqMYL5QiAH-S-RQuSzDHf3yNmhkhivBdw87_Hz3EyaJmzRgaP_PKt9IJDRR8W19AahSKPOqZr21Amk2uXYVJvOj8qyDgjmD2DCaolmevwZlE7RJ0s2jpCdaFFQoStt9StHj0mTfcQHy3aRe0_JPJzOTc6eJ9Yr_aYhuxgq33Yi9eWCw85EZaQJCZw0FKSqd-NDOUMQYu6B08kDmRhrmKyFA9puYCroka23NVtBthOKwOoN4bHRHf_sVRq170htHHBzZPIyjoCCdV0aFfBLQiM9wjPbf0tltq_uOjB4wUU7ldD_FSbHkgATwyja8wS6dqhVemlNl_VXpTo0smj4Dv4EbVfbMvtzPEMsYFim64o1rK_pFwlg7c0YU1LQ-1EZ7eyFKNaxRfFIZJL9StzPyjsMxxVcsgJVa=w255-h162-no'}
                          }
                        }
                      );
  }
});

/*transfigure ability*/
bot.on('message', (message)=>{
  if (message.content == '!transfigure'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/B3cWO1D9GxhusrbsdaxJi0L3p4f8t-1KaTEiHsJ2tHGx3wAP5iHPLNXQvyPdxu4qZcO1DTN3Kw6_amXgecwR2p1mbi7eM6lv_E4kld9GWyIDayxZ_1s0fkAXaX-xplDBk5LVvptL-6B78sIQo5bBfH_MWuDJ9Vzwun_3yYP76erHq7dVqn0pf5sQ749SQlj-h5E6HXguigDlga2CsCA5m3u41KJCu2EvMaXbR7Bwq2hXeHHqtVb3X2tnp9eLrv2SMTNuKmRx9sjC8QB-GzUtZQd7cvMe57rpTAzJ7NUM68nGCUxUwQS7m3AzWEUkZT7sUuQ5czDYJuzVRql5Klx6QbrX-Nn2DkIYwVuB08cpY_etDk7S2WKl8gNVnKS9i-fOloX4ekLuXdY_rcunRBvAFfNdOqrE5NpEVoSg3VZ6R5q6v_LzLphYwGSW_clcvR32p1BLrQmA5VkIzTfQOA3Lo-_18_WOxpX25BLRAI8ZMP4XAhi46Wbu5mLfez1yS-3k0u6jlZk5lW9ro82Ts3-8WFRhkE76RjLswjdOBuXHZrFf2vy7iaYdomwD5yakrejzKBqyzbp7SG3DSE15ZA_K2xAo30cD3akX43xEhT7UXFQ3Am6z-8Ds=w33-h35-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Transfigure',
                            value: 'Members: No	Level: 10	Type: Ultimate	Cooldown: 180	Equipment: None.\n'+
                            'This ability can be obtained as a rare drop from General Graardor and Kree\'arra. It is also obtainable from their bodyguards.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/DTYNg5P7kK6L23tPj3KW82AHTN-5i6pD8FXajWlalNKnqMdHdvF2oPgp-8NlPoVyg67FT7zYjJ2_smIFT8wDR3Bowq2aUR1zaUJjrwGtIk99f5R_uvUcNJvZpPtLluGsfIHgX_ZrfzEZVZhDRpkGKf_WB1CzQWBoQEqMeagkcT3mgST-eBLsEXu2dAk8wQ6o-brw7E1175UhkcR-sVG7C1hBSnaVeUHOJK_-DS27KoxUghrPuT9qBT2SBQeq5Fk3aYmS0xt7ftyOPjHm5FvZ6ZSaj_Q46v4ooxQO9jYlY5vnrgZ3R715pJT7wUznPZFdMOMLasCg5LWXwWRMXxMH2e43n0bIQ9rmZ008CdsUhQ8aotm9H3ha_o3SMcMpKABri55Rm2Wsrg-HEqR7UuJIb8I992sS563Gzyyoc-0OLfLzAzBOOwME2ijbXnSiSf0N2DUZ9uUX5FDPtyiSGNx-1GNg1yRbQ-xnUvFm6Uyt9DFucfabaWpfflZELlW4TtYaICqHhPETwNBQiRkyKoywrrbi7p80ZEmSwij6yWw0He1GRGQwwgJmyfPlosuwGR_0sXZLDbNkHp5NnCtoK-6MApMsNLDKi2L3JV3JPLLcTHqW14SW-HwA=w252-h175-no'}
                          }
                        }
                      );
  }
});

/*special attack ability*/
bot.on('message', (message)=>{
  if (message.content == '!special attack'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/tI6_49IGkZKwVog81c6hchD0cq8quNf81YV8v47KCksHSAlcnU0_u3n2_CfF697frRwr4u4q6VaVgX9cW9sxZimFAWjEILE_YLhqoZOHjvau__arer40t0_ZVHhVykiNByvp9IEDmkQayGk5hZqBUmaLdMHN6mLrgpHZMl2ax9ng_nRjLoPVGzyc8OLlwDHFILUHLVhyd7ZrOqpiqo7VPUHLhvXlS7d_OindJ3GbN360-AwzusHfMOTudGByEKq3x9fqsNsJXitksITR2AE5TjbfLhZuMBNutfJkUoJTR8T2HSYHwG6kFnsF1CrpBYwGMawqoWLiwTjWM4oQtyJ5CSweXRantbvXGZGKqw3EjUxTuERgRV5M3MRh4UITjYDcAucoN-8T3kKYow1iD8pLMTnWdfRoTCS3fMy79g9en89ypb4V9YhDeRAJU4hPXE3dbOF6ajU6Nz2i-YnxgDM9v4JdypIKXogCT_xJryRw9W5DV_Yt2WIEPOkiItScNuJps0e5Lvd0yTDZTie3lGYLfaO1ZYsnFZFrEIaDNx7ozU1aW4B7qNVkVIKEQDuyw2js0guYQQwTysHx7ln_4I0CMI1cwaug0i6mNI0ZyTSgjTi_DpQLN3xB=w36-h35-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Weapon Special Attack',
                            value: 'Members: Yes	Level: 10	Type: Special	Cooldown: 0	Equipment: Special attacks.\n'+
                            'This ability can be used when a weapon offers a special attack.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/qzmg1WALpmRA-8AY-s8aA6-pxbHESsVScaka-DImoj3rPYBcQ6TAinX9GBNnX10o84-_UquncoHlPa6ZM4Q8kluU7APfrgcyTwNa1LKF93wToRQHFfoyuPa07KlFVyij8GYztIL03SHkR8QbiAbcR55g6Py4OBIFfS6XDNr3X4_X7jJ02HJuf0B51wa-bcAKlLGCHd8aqsIY5z_gQrMp8-0eaVm0JxHVeQki2iLmGc8_m_5MyUdVxNdCc6opMhM103jVe7jqLjgq5cx6bFSZgAUOZOeZrVK7B0DFW2aERSgTRVRcID1x0gt-bRb_1bSUfRtvOhYpMcKErpoUzRqx1Hh6UQ-y1_rPnGqxlZVcn6uBrYMUy8uY-fddId0Qgbx9d8gBhpYz0e12s8SB7UdvNF0l2ALA-EPCmzsJQGhEa0MTYx6f5Db3UdfiOkmlvvvrrzork_0jzu7AN9su3woKLv4yKL-KPjj7uWo2VQbdZe4tz8wi8gjrUcrfWP8Xt6LCPrnhSGwFvAEQdP3HUGz-2-OmFgSKC150TfCjLjxdZn48cXumtDMKmY0WP8_MipQIwPYLnpM3-85qYApBHLJdEF5kKEsexhPus30WowljXNto_zg6m3-e=w252-h164-no'}
                          }
                        }
                      );
  }
});

/*tuskas wrath ability*/
bot.on('message', (message)=>{
  if (message.content == '!tuskas wrath'){
    message.channel.send({embed: {
                            color: 14365765,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/O9EIiFZxZpXx6qwGHe8d1qRA-km5immSeJ_2K7kfU-TBlXhGn643YN9s6jCIBMXZXC4nSurp3GbxT9EXQok0GlSqQa0UoVa_OXIMEHhYwtGNAnVzSo3Z6mOUVP2X2SoWcGE4C_1t8rgfoAPG_43h-bOPXu3XXStWw5gsh9jMMwBhvOBx2Fn0xoqGgDtH_T-gMEzwSdY_Lx9_JZZ17qrxoI7ks0wD7Wlik4N6JeC3JW5-9ZfC05FkTJTqdqdiPXuV0dhWvo0KDsjbqR6dvd296sdiPSyu4ouvf10B_kpuOmjPhpUYEQ7_5CZ3jbIzhWXUZRu-tQQMFO8KKNmA0foaGQ8cz0U1DgeH_ndCkmEnZ8dDgMli1vxyg8ctfw0Gl-3hFowLJuc3RDRLTyGvSJj14qx0Y6gBo4ZZMFpg1kJne7JXi4EfiPg1hNOFoddy9G-o66TQyUSEEJ45sjUuPhQSs1SvYj_4Y4LckLQeI5tJUTYeQWzDtyW75vb9AQpe8ksu1w0bptkTW3EP-G4pJtd0UjxvX67jxnol3ckriieCSE7dqZnz8aCaMVlTW9qakZa_gYqLD4LatoOM81g1Pf3IjOeO6yOoez1dZrpUuQoRLoas99gQVICl=s30-no'} ,
                            author: {
                            name: 'Constitution',
                            icon_url: 'http://rs336.pbsrc.com/albums/n360/archiz2/Runescape%20icons/Health.gif~c200'
                            },
                            fields: [
                            {
                            name: 'Tuska\'s Wrath',
                            value: 'Members: Yes	Level: 50	Type: Basic	Cooldown: 120 or 15 Equipment: None.\n'+
                            'Tuska\'s Wrath is a basic ability that can be purchased from the Anima Islands minigame reward shop for 4,000 Reward Currency from Wizard Chambers.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/5V1Rfy3V-TpbUSoMhUR6meJ1wAODqUNv_3MnHv3jaTlWK4rZwhyGza3uevssEMv8yHZK4TUwQC6QYARQGnXTygXwn5d8auWR7tt33bI6xsaC2hp4XpkDk21zMaJz7Mkr9nsMHVg1KzQveMZV8vBqR7X6_FqztX7KgyM2xBSyvSvnARN-sOVjSW1lN4SPgvJzbZLaeAdJFVhkpIVqBGFJ3hRbaMonQ_qVt0sk7Hy0dsGM-4_27ck8U-tBJ46nXVyqqb8draRfdDJXXhfdwmzc6A-cUhqzObnYuO-RDFdoCPYaFMDVjqLvHf2QqYd19qgRYgPYGOauctUzPmx-H4GOIaRPDcM1BF00o27X9hEUUXJ3Rl_wjE0_beSZ0s2fiemzfEVskxcwiwL5Zy8NKJ-KCVy6jSM2AQ-ondXSgzB1KffHob0GW96T1cE-p7Ldjfx32kZHG_Pc_FoO2iBeWcCGZF_yGq_-9rL5pA8uGjzjp952VxP7AY9e_nL41DZ846bsZTDxfCVA1yEawH7yg7bZ3GQU96bgj2NncpwT_BlmPrAyVb-c9ARlAWF0gDrYyyDnBnntWLCiIjA7vm5JmSleAG8aqzdsNbo-2LADpT6ZquObhCNa_v52=w256-h186-no'}
                          }
                        }
                      );
  }
});

//
// /*storm shards ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!storm shards'){
//     message.channel.sendFile('./images/abilities constitution/iceasylumability.jpg')
//   }
// });
//
// /*guthix blessing ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!guthix blessing'){
//     message.channel.sendFile('./images/abilities constitution/iceasylumability.jpg')
//   }
// });
//
// /*shatter ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!shatter'){
//     message.channel.sendFile('./images/abilities constitution/iceasylumability.jpg')
//   }
// });
//
// /*reprisal ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!reprisal'){
//     message.channel.sendFile('./images/abilities constitution/iceasylumability.jpg')
//   }
// });

///////////////////////////////////////////
/* DEFENCE ABILITIES */
bot.on('message', (message)=>{
  if (message.content == '!abilities defence'){
    message.channel.send('**Please Specify which abitity**:\n\n'+

                          '!anticipation\n'+
                          '!barricade\n'+
                          '!bash\n'+
                          '!debilitate\n'+
                          '!devotion\n'+
                          '!freedom\n'+
                          '!immortality\n'+
                          //'!natural instinct\n'+
                          '!preparation\n'+
                          '!provoke\n'+
                          '!reflect\n'+
                          '!rejuvinate\n'+
                          '!resonance\n'+
                          '!revenge\n\n'+

                          '!abilities defence all')
  }
});

bot.on('message', (message)=>{
  if (message.content == '!abilities defence all'){
    message.channel.send({embed: {
                        color: 3447003,
                        author: {
                        name: 'Defence Abilities',

                        icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                        },
                        title: 'This is an overview of all defence abilities',
                        description: 'For more information on each ability use the name of the ability as the command.\n'+
                                      'ex. !anticipation',
                        fields: [{
                        name: 'Anticipation',
                        value: 'Members: No	Level: 3	Type: Basic	Cooldown: 24	Equipment: Any.'
                        },
                        {
                        name: 'Barricade',
                        value: 'Members: Yes	Level: 81	Type: Ultimate	Cooldown: 60	Equipment: Shield.'
                        },
                        {
                        name: 'Bash',
                        value: 'Members: No	Level: 8	Type: Basic	Cooldown: 15	Equipment: Shield.'
                        },
                        {
                        name: 'Debilitate',
                        value: 'Members: Yes	Level: 55	Type: Threshold	Cooldown: 30	Equipment: Any.'
                        },
                        {
                        name: 'Devotion',
                        value: 'Members: No	Level: 1	Type: Threshold	Cooldown: 60	Equipment: None.'
                        },
                        {
                        name: 'Freedom',
                        value: 'Members: No	Level: 34	Type: Basic	Cooldown: 30	Equipment: Any.'
                        },
                        {
                        name: 'Immortality',
                        value: 'Members: Yes	Level: 29	Type: Ultimate	Cooldown: 120	Equipment: Shield.'
                        },
                        {
                        // name: 'Natural Instinct',
                        // value: 'Members: Yes	Level: 85	Type: Ultimate	Cooldown: 120	Equipment: Any.'
                        // },
                        // {
                        name: 'Preparation',
                        value: 'Members: Yes	Level: 67	Type: Basic	Cooldown: 20	Equipment: Shield.'
                        },
                        {
                        name: 'Provoke',
                        value: 'Members: Yes	Level: 24	Type: Basic	Cooldown: 10	Equipment: Any.'
                        },
                        {
                        name: 'Reflect',
                        value: 'Members: Yes	Level: 37	Type: Threshold	Cooldown: 30	Equipment: Shield.'
                        },
                        {
                        name: 'Rejuvenate',
                        value: 'Members: No	Level: 52	Type: Ultimate	Cooldown: 300 or 15 Equipment: Shield.'
                        },
                        {
                        name: 'Resonance',
                        value: 'Members: Yes	Level: 48	Type: Basic	Cooldown: 30	Equipment: Shield.'
                        },
                        {
                        name: 'Revenge',
                        value: 'Members: Yes	Level: 15	Type: Threshold	Cooldown: 45	Equipment: Shield.'
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                        icon_url: bot.user.avatarURL,
                        text: '© B5TA BOT'
                        }
                        }
                        });
  }
});

//INDIVIDUAL ABILITIES//(missing naturual instinct)

/*Anticipation ability*/
bot.on('message', (message)=>{
  if (message.content == '!anticipation'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/q7YvKa5CgCbHOrBEg9QVIEr3xhZ4Ffnn2or_MaUJ_rLIiL005oM4LNu9kpiG4W0-eOfeQjUD2QYxl0xwd-8xrhVklsb62IZkV6CuJypZSdlnO4Zalpt6wORcb6GzjLicOLk8eQI6qrjvO2cdWBGz0GKUiHoyoidWrRhPsDbXYsaUdT0theqoRHLAkVyEXQM3ifRWCR_wkOOlgpsnrzbyK14LH77p3GEjaGYcaI7UJOYom2D_O-qLcmAFIZjQmuR0IEgpP8Vj4SNJt6EaYZVfyDGIDFSY7HdAqTKSqB-melKZhhQuqhPPXyMCLNlb70Fk_Jr-ujzzDcuWRqc5-vzjgAowxR3d5sO8FuvruFFkVtZTkx3jcTcC6Vud7uTtNAvNmWtjlH-s-LjAK3KFn9fLsJlhA1Eo9LvMpd3GY_z0M0KQwZNRbMKOBXrkWywO3qsU9mouPZ0XR_LOAr2Eq2BswlWyuGiYB7XMlWkkcVCgnImF47krOVZqsAyiqQnSAWD1HUS4LTMAnVtClvH_gByQQzsW38dw3M6UO006i-J9Y1ejVLmbOTrXfDoeEGqu4xABa1HShMpJnnsEnBJK8SaEKBBNvn6MyB4LEVBkfoMUfktybQDJWgCi=s34-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Anticipation',
                            value: 'Members: No	Level: 3	Type: Basic	Cooldown: 24	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/piTsXgNn-mNzAJ_XX2LOekPmSzQhqi83xDcl5qMnmUN5GmZbNveZsVusEj413PC6-LUO53vE68r7CG6weqJWh6wnPkkdKFLSWgkCbG6nN5n_P1AShbGdxoXW5L5YEUVxwG2lbQPngTmA5tPHtrU2lzbRMpL2aatN_ped3jrmtha253eQC9ZJoSa8tdrfL89P-BSSAYEOcOce194aMhmbJSRFwqw6CMNK5PqnSJc9WlZGvr-CTzdQC6RzBIEFdhVy26J6p6t0XdPyMnMEljE4MitKkrGkB9NuOK_hBM2Z0htECaX12dptwzlAHCsiNxX5XXl6nznoVFmNm-qd2Bk-GDyiYqU3IyXZFSMIKE_IHmxzPj6Ve1cD9Ms3B6eo6ORITAecRzjpeoNqR5tzG-FRx4T6bkTvZyU8pnms5nPPnseSCbayPgDUv2hGfTfO10kK37wU-BjxLC1R-UkJPzv27xpdnF8ys99ZtAk4fL1lQEyDU_CkSXs33O2huiYV3H2KeHMEcvfjv0h5x2DytZ338DOCx1BP5EzYMNGUmyxZx2rb4KtyEFmaqK-3dwkQz1knuAiyQmLrIcaWPYXYXKAnib6Y3AYyJgB2bOTVDdihrTeEHLdCZ0Ma=w253-h165-no'}
                          }
                        }
                      );
  }
});

/*barricade ability*/
bot.on('message', (message)=>{
  if (message.content == '!barricade'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/A6mVHv8xYCUJjg-1uOT8bRTB7PuaUWISTWN1SVmL88UqoA6y9fXceLv0ZwuNK6JmTFdaX0gqrY3_QzbSidNweWstvC5tgWDXBwj645quQOAfeXhkgxCjGGTX9ZSiwnrUae4rrieI01Cx-vLjw-AkcSQvsA-KcTp0jh5Xowl2ChPxmlnz75G9ZuEgJVJj-TqKRTGBLWTCCUPXkEpGuhddqrAn1xxjxNiC35NE1sFmO2llguFrGUz_Le-1BeC-Ti7C7YxEY06HqS2v4TfPKURSlaCBws3s09R3qwR_MjCS7Er7Vx8LK0UjwmuGj33tiIb1z9J0da-tBdrY8AzOJUnNVajOOSbPACHIHjFvZz64C5Um1t3xljML0Yun6hO86gZfs8bQ7GMqNWUbeQV7dsd-Afap9XIOk965NBPnI3qp4ktrI50XGNsL2HAGMzmKSZUJjKUiCVRezElg1Pm5eMJ0_3g8Cd6qY56Pf51UE93hkFRJJ13X18kngv2QQUGBpTmDayTPDlYkcxq-U8vymaUxXusU5B7IU7ll87gnrdRRNAEmpV9bWPqjQX6m-KShsA-pDzYznwW8OqrdSeS_hFoDTgu1ncF6fnYNeCQuhFBp64Fe2arja-yf=w37-h36-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Barricade',
                            value: 'Members: Yes	Level: 81	Type: Ultimate	Cooldown: 60	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/fXUcI2YCAsLQ6nQlSJRRtQ4LwEzkMvNe3q2oMRzglQG6pWRFOdGQbrnpQlbLpQAO2GGtuRmHpzfFww1pRDEcaHOEBY5A2wOSoVR9p-qCthXJ8ISGFvTZXL-nTDh_LCyQjMsubrVohxMzhVsH11QEeycd_f3HsrHV_Hnzl9w9sCXpbRQ1CMLJz4pLWiRx5atX9d9FR2wHU7JZV9pz98Hl0FCjXuznUgujOghyzJZuaup4kIVzUNxdEuQJIC3UluIR6Qn6sVj83IHHBtfsKS-S4WucYhxOs3mRdFf75LSO3z2WCXGNme-6iBhay9MJ6yYbcxkCDe7ZUXfPks4EwvIg1NBlz8RYBRS72SmSNbHp0LSqkv_YszJNUfWQ8ELRYCg0swIYkYKHxqjdxNbCOspQ_KLl8oYSr7SYHmBc6xnXfwA3Ezl8wyN_HH0_wXSLkHMNKS4gbPl6cLaGGCbknl9q_RBUU6FnO-DhCNpYJbPDFg3OzKzLsZhp0f78SRmfwtYSraZ-V_vQj48xUvZ6spgCM7ek3x-tRWZwg3alU-K3UsWZn1l-QJXRmv9nHFzAMv6AAlUl0CpZTpWOjxbKmmXIJxyJDt1F_WO17W5HTWDIVBzYGquy_-_X=w254-h177-no'}
                          }
                        }
                      );
  }
});

/*bash ability*/
bot.on('message', (message)=>{
  if (message.content == '!bash'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/Qt65KegzEP4rR1Tx4LPGQbUMQDJlND-mL-lLp5NevjrQ8fyQaXlSd2mUaT2HIN4S2nzTZp5eQHI2pVVF15suBDi0XbkujYn4qslYyk0j_o1ZasJDujCf_HZxwX0NrPqaXvwA039DDczkOKW3T8SutG1Y0fm7oEijATigSUbwRWIxtAwBpUmGMbYrnz0UZ_D5V73cW_lQ_r_XNgP7KxCPzBBi3pOK0rgVHJlzShwtvuz5ZoXpm8EfMglIb9O4gDxy-dZaBYRdX5UJPRbMOn5NBNXBbudZJjQ_uFb2dvIKVcXniQ83uQ_NW0132ih2Kp0JEXDslMUqR2wsvvac8xLH7Ue-RpawAqtAH06IYhv6RqnBnuIW78xLsl-_bjgcMxwbU1z-9AqDVt0royaB_FR0L7e7bjics5WxyV_vvP6XnLzkN4y5X9hQ-ejy5v7bKgikxyWPLZ3zZbzLwNG2uJG6o40Dd_nuL1gpxKPq7ZQPmTKUXwjLXNdhbR3z6U8HqBZPDJfTWu_CWrD2ffTs-4V6cnhUcUxhVBUAdqsV0OFr6o8XIE1ONHGmd4aoGbGAtweuZHV55Fa-PqCBflAL3fsDzUvb2LyWSekeKEwphW4ytUBOTwpzR1Hf=w35-h37-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Bash',
                            value: 'Members: No	Level: 8	Type: Basic	Cooldown: 15	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/CWwntXdbMviY_LuE-ENmdOJpb8tbcIMq0oykugxpJXkoROe5a0wV_JOKXnXt5XxmcO3r7AzWCPOQDsmnHFtKBlYGGHiZmOLAIbV8i_0O0-pjYKHxEXKaq_tsSfjXBljCi7fYXWo5Cf6PjwB0Gi1kKnQaa2JWXMK0swFtGw5Slhnz5ErGTgNYTpz19r492T5tv7dkGHp5K5fscCfFFHOhPVTrXJUw0r55CbMhQFVhQ3V97ARf2KxuY3ZMqc1kISK7T4DopyO1aUz1wgHLuiid2GUSxgJI-uGY6QxC0aw06TOkh8nQ8c3NFvrpue_p1w67Jeww1hk31U0O-KXv6KZvGdesia7msD95r7gK-ZTkC-QfsaTORzKLP_Ibm2SNw944EXnjRkC74O6WED9NOZbIuRJXJ_UfMHOOxaZA2YbtmByQgB3tOwbetEQpb-mRUSS6xyYGnrZ2-KqaZ8IRYqN10FhClSol70OE2Ykbf8nC8REFvjdKWCtRqi19TlnRomKcAlljhV3HO9nkb0qFENb59ZI6TCVAnyK5JdCGXsnbRV2Foiax9VDz4aocxu8XO5EPR8ddR9lFhYPDOAT7ZJq6By_vX7i00JPxHbr8oi9kMRKfACGxxm9D=w252-h161-no'}
                          }
                        }
                      );
  }
});

/*debilitate ability*/
bot.on('message', (message)=>{
  if (message.content == '!debilitate'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/Pz6N33H0MHjaWLI-K1oO1op02GlLudpYkNwePgCCPkcdkkigfaZ9w6e98YJVppNBp3KVBqFVzvH46_EM-WRNIe3bqfvIsmVjAufVbQzFSZyosnhyIE6g_h9EL50bpVTDljFQCIrcKmI5TAflEFg0y4g4r5WBGZTn4hPXPQEXBt2O002CcGsjjtY3tCjL6hg0fAsZrQwmquy3hcaOMXDUArrVe50dya8qSDBPwz2A8wnXRoeem45cq6eO9xa6Ib0E4UZE3HPz43xzwxw9CtC3r4B0MRFJGsjRgNfn-TnnO8rF6yYZlkRbcqekgXLFATWcqzT8bVPHGNppRH5hqYLKuHHCWoRTxcpumOXbyUamiLlM0fgQ-aOUcyhHKjmyKQPAbw5wlf96mw3QMkxWQq10fhm1uIJQ5thmun0FNq_kMyJVOMazKWqha51E4LzCYvoTIpA7oHeukN68SrHaIe0rCYaSFAOkzl17lHuKy9fS2GmCsaIyqOtm_Hf2xPJjxItTjv17PkL3NiCwJJeET8qn_PNSW6bnHPVuo7sesuzJNAoY2y_5A5sXZkaZTnkuZoJZjW9tzWFsQ1JOTLya-OI6wjSoj91LY3uyADOTANPyLkXgvVY76naT=w35-h34-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Debilitate',
                            value: 'Members: Yes	Level: 55	Type: Threshold	Cooldown: 30	Equipment: Any'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/ILR1l_X_5qrEhJTK4Z4FtnnhDo-icNFXKJRFCSBEUxMRTtWR42hnrkiW3l5OvtxGgkE7LH3DgZ6Os3EuwBpnsDDF5DfWJ-kkvaAaWN9imqN8cw43GkQfz5jutIdWCIINd3qxkI2k9dX4dUmsnGKWaPFUncfuHNkYlPS7a5uiu4e5sViCy_sxhS62D4AtL3y4zbIUc3zAoxjtWqj5yi-TVhdi168AaSBZwqow9Dfipnf3obwHDXGylD81HMb2yDmJOnUgjWE-zQxaYS0-zDkhqVe0gqBKQJHG3CP_bKT-Gxdm31ucwKuyg9-FMLE_XCl5BpIp2g31_qSxfnJm4U8fduQT_Gc8Zj4ZalRDv3NozoR5gsa14kUakXHIbb-IZ-4WuZaPHq-iSYFKiM3XBKxdQaB-AAYDUUH2JF1FboCOyWf_Ihj6S0IA7BRUtORNsQlYExyO_iuAqPhWOGaY2zRgkFc3MKXAQO1w2a70ioTqXNYwswf9xVBx6X_GfFvVoKQDYLZLbGGOa547-8D1AtbN5b_zseh1eG0wdcWnhF1DEMJAQECHTVBCbzhE_q-811RnRhYfapLLHWOp2e-4a74BGjYy59L9fjIZDtYLTIHUBnkF1NknP_2o=w260-h192-no'}
                          }
                        }
                      );
  }
});

/*devotion ability*/
bot.on('message', (message)=>{
  if (message.content == '!devotion'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/R4JQpvhgCQ1KP-GNkYH9gJbABz_Gp6jFgLV4FXJvzqZWwKz1WKQUvdmSSW9yHR0SvoANtpDgf_yx1OaJIYSnr3Dm9wG7ri2SYCESQPRlYIPHLCJ-MsSBqoreZQHO4TpkKUVn6sCGtSASuh_fj1GW02tzVqI5wlbaZ_FP9fiPfm2l327X_150Jm5xnWqQJ5OGhBQq5H8tTrFAR3ZBD3QqVwGA95aC8K5hqrVNsiyEpgVyctipasEKstKzYBwKCQ0lUk9Ei1FkAxx9BMRK1qF4LxBRbEHDcaw9mW3xVWbXgdGI8jA7qJBZYd3agJyFEeudBf1G5FwD0hBzjK3k3_ajyVXjLQGXq9IRuoea-wdmtUGWDhBUtHBmGJiPFn9ZA8jiQMmg4kAMHOdZRuq0mAF9dj9xf_c5QmYZLOlTgGxbXCZ0noe8WBkthMUxc27iVq24GDw1qOjGU3ZvZaqQolZe8CL1J35c6Z6nUJ1tb_ELNVa428Tlw-kkwWz45rHpveGvuCkYgv18iBYvsQmzeb8G8OqWlxlnmgJX97-b8KS97UdSi878lP5Vb9t-qhAk6T_knPusL8--9AernxsUWFRwzdnBohJZK3BDWrRElr43HnaybuEMk8M_=w34-h35-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Devotion',
                            value: 'Members: No	Level: 1	Type: Threshold	Cooldown: 60	Equipment: None.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/B-y6oeDx8IgbrwTRFd-90Fcg1cfWK9EGCrv2L38Mvy6dV1W6lKeSvGttNHBxGxwq-1CIxE9AuqNKK-U-2jJwqvEFdMsUAAz_t_Mft6lC8-bwuavtlnZPygc30o_dSGI4uK19iiX3NMOjpoFIeUM_AdPWvul9mp57ICLHgu_5iWhIRK9U80RqEFGHrS7FV79oH8Z1Vi9oJjDH8egTKSOKipy6MNcWZZh7GNo7GVTTgaWwfS7i6KtQU9wwe8XuSYa9dZh9AQ1zNs2HRUUM_BdKvf_a0WGj2aUG-QrTEwj-J9CgK-fHWtNipKScO7y2mVZBkPTcSqh6CuoJpM55F7UOlfvLhh0BJ_I8j9D1z3q5z-IFObq8gPOOTsRhiK0O07CONCFYWvZg8gdKjF6N14CoFB-RKDOYGAiT-i-GTU_e5RzWWRg1cjlwdBC8z8-vYCv7dk9d66zT8RZbqhe7PdP77kTPOloPks3eMnlzUebDsylhv5Lj2Q3XFxeGC9UQK7pwwrvcqsq_BUWpkL1gvij9w1Ptnm7R4tdqLqG-MUzHZXepIPD8j0XcGEo5X3N_EJ8e-pSZDoFIZX1IChSXq_2yr8BJos_-wS7_DmZKJN8w-dfYJnmN3cRY=w254-h172-no'}
                          }
                        }
                      );
  }
});

/*freedom ability*/
bot.on('message', (message)=>{
  if (message.content == '!freedom'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/M4uhak8xkfZa4TO-6kDgyoT4Hz4zLp4Atd8v1FwxE1jXce7dzVOsVuG2uVlEiwpHbx0B93JQJk6RLVbmCmRkdVRAp6XoHKLLhLIzZUzj9QtaGx5JFyE1MR2TXfaCHf2ExZa3gRrRXxbp9MwQsOI_pb8UsVnFgitO-EWHhNQW56l5Pe2AdaQa42Ia_CujYhp7Xc7Qo2Uj2pi4CePbjlZv1vGfXtXfXjQc_0Q-H84beKEKEdH2W716_8uaBBcew7sUbSmTa5TXKviLr4vLgZDhCJ3V8ztT9tSyVez2wFmV31ww6IuUyu2UtZECVarsAguUIumzTxe7VVkvFbaMuz9r-lhkCN2h_gf3I3cJ3JURgG0pMwtLGMlfUV-Frz5W9xsLepmH39JOcjjIlb_SNdD3FDjp_lpfJCnGQWDlqHBX7wBecJSQGAqGzsNN6FBTqQY8EvKIpepo-wPiBrFsaeLoDeQAEL-a4Mxafq6GmEHq36tllSsAOOm5xP7o2inQ6v_dpSgv5eU_Cadjl4w_zu_i6qSvQGZKIAIGEYsLeKhgFT24-2NRlODxA9wQEqnr3dUNiNRJDU4Q3D9adDKKsfK4y22sAf9ieyrB3ECmYKf6LtJB0UnjMelG=w37-h34-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Freedom',
                            value: 'Members: No	Level: 34	Type: Basic	Cooldown: 30	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/KMiGtdfZ1MUsy1Ab3Pe5MsMn_wWikdpymPzED6bF1zDTmyuXW4QJDeMMOeK7KyhqOqgsGKwllCHOKjaYnQuV-OQdNtfK_kqMq1zhdGpvFdCzQRlYV-acMybUSXhTGrObsAQF6FYXZmHjB2nAf4jsu2mSWQxnTqG3AC3AxnR842lzm9qSjFlNiA63GApZS9g2Ezw7sfpepOohNZDI6pHVQAtZQkNBh-QKNjQOWfQg7E_S3x5w1l3betK1bUo3c7i1wMbcpKGVLYHk5fNr_zVb8P0C9MdJ0ZTBIH7tZjz_owPuqUfM38FoxPrkZ9To6IfugGqj2xf86zyhLJKf_MLtJhft0hOSCn2vLOuoPxh_A1mKbXpqllE4o0QdTk-sdwCLBHUMoKzimWUqI8UAES5bN8ZLWUVEb9aR5ZVPxPD9F0vOtLySQSHPpSF4y08PfMzD3lGQgn-rzbKlkTYHZK6YeFHcyAEbRvpZOUrTH22Csvy2xnesxZpT0WYD-XNj9HfdyBnXs3WGjQRSk4WNUqMK06Ua2E6m72C4SCEymXak1hxY6vmkZBk7fFGHD-Yb7nYeQDr1eMzrCscZKRQC1a5luhbUn-wiqYy8QG7vDnkPNU5Xl7_vTnUT=w252-h162-no'}
                          }
                        }
                      );
  }
});

/*immortality ability*/
bot.on('message', (message)=>{
  if (message.content == '!immortality'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/6nWnO5RwjjXgX38s0FcEpeZBFVslWRr5J4vH5k72Lc9bxafmXaVIGoJEGahpHrYZkC_cDAy8CMVbc9_vlUGszyLII4xzc5ic1rOlHICmbzRkrF57bgbW2jgdSRBAJOFzp2_fkIi1Cx6-9XegjGCykncjNWwed_aPeEwzw8moyye9uGWexzmHzzFZVGACbupZcJZGfWrURJoeW4a7yLR8DbfH7pSAQqBn_PXxKW3GMyyjnvk7TVX3pNZ22HzpJPc1JfhPCOhUeosES_1VC7ARfr5XUBixLSDtpCyAFeAFQInoPZalvjpTPCrET-gyHfJ9MbL00J0gp04VFBG1u-ZCIKH3v0kwXerXWgbcBqfpdjhKiNrQnPvbbvv-NRluSdp-JCmSFHRRorKbkT6RxmQhxFH3Dh5f3bgdw7sbTKe0rxvF4mTCwpZ3_YtRc7-DdV3tRLw96faQ5jmDPBndmT3lsVMxLu7GjnwYCn3Nb8_wfnNJwyMQSRK6qjW-Eqc386asV8Mmo4i3L3S33cfkNhmeFLp__2-SNE34TKiJfR-M7rHsL7j5-A_veV7adKOEAlKrVbrsqOaTwekzQBc8M5O0Y6SrculjIbQTa73DzbsLdUDHuw6kWjg8=w33-h32-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Immortality',
                            value: 'Members: Yes	Level: 29	Type: Ultimate	Cooldown: 120	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/nkU7gHQaccUpHe-cEZskpa_sloEnLuCLiTRIZ79juN2ZKbms7mx4NBwoA_2aE0bvLoSpKLHrHZJ-26um5GnF8WB2BM6vp9rKzypR4brVsQs8a9NjVsY5L8ApiuylC7CAZHa7aCYnFnyWczwktVmv7vfoo5TLYLuG3X0DNA2FmghSE7BJ9SIHfCBXk-0E4RQGDUaIg7E-pyDZzQd9Inkm_3DW-BakDnzTwB-SEuwQN4sZDJS6YNfsdUKGLT88WA9vQN_NQExemBANbhAnNpR4_FIG5iGgL_s07oRDdp31RIfqM3AEhY-j9TvXl5QHztSlDClZTGHAGVjwbxyAZgmpwvEr9M85I4kyKpuAVsgOvYE21RzSQz6A32v_Ij5oT1Vlg2kiIvaS7-Y38reCq9nX9ueXO0kT3GphsXqvZsqB-69LZThRhc1rJo9rFFLwGY0XAftV5Fn-5wQU9TnJmFv72aeMaobdCfoImwIfO3SbjwHZjT_CnB5PKObn-aup3m4wXdHuNH4IozdCSwPWPyKwGCo77j_KEuKPSH_VQgFY1ELxneNrIkCWUkcMYpOEBTtcNtDnYSjLw_8xDU-q46mT0SEzeOoiVph3lqXvvUmQNcfRvWzxTK8w=w252-h189-no'}
                          }
                        }
                      );
  }
});

/*natural instinct ability*/
bot.on('message', (message)=>{
  if (message.content == '!natural instinct'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://vignette2.wikia.nocookie.net/runescape2/images/7/79/Natural_Instinct.png/revision/latest?cb=20130306231655'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Natural Instinct',
                            value: 'Members: Yes	Level: 85	Type: Ultimate	Cooldown: 120	Equipment: Any.'
                            }],
                          }
                        }
                      );
  }
});

/*preparation ability*/
bot.on('message', (message)=>{
  if (message.content == '!preparation'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/x5_OVY8HCKJVNGqAj3F0ATLDhGLKMJ1CXe6Csh1E8qMK93QwhH89ctyYWX5XRQ_DIYlMQrdhK3kNsiLQOU-hoA5Sutxq5KpkzDZc4-XEZprlPsOab8vbzifuYnDCuRPK2k-J3mJx4v3_u1GYEzY73PKQGfLtTgXSTZ1WeszFjS5LHs6zs6oJ37Q1k8niLr8LhQxmKTGpbO62QK6Zgseb9yTRZQ8HdccbZF0kUUEccYrTQozD_R-BNde60ShXbbb-4ZghzI5EU2B48uV-47wjb7buYj1IaEXmql7Eo-LzuNsOM559N295kIkXc69TPSyX5gDQpJG6SRp2LHI_AgJQ7NM2qeaeg668pknjNTtBKjSwMaUl0Z1Ngj-h32KYekIzX7rWEjFNWD_72FqPyGTHKbcpVNYWDE_tdwW7a2FVXgQx2Atub9MyHM2bm8RjNvyHQkAjSZw4ALz7LKkBFyU2k2WcC_Rx-ZeC_4L9RzuXKJSed9exx_8Hd_CM8aF6wCV-S0yQmK7CE9UWkg6WcJbCGAml5VWR1EBtdzn_nftdqgiWfY_9qpfMMRTmESVnvIDSqOhc6gvEn8sgJdinu3sKRQwUZ0vt-_CuBx3h6vCG92tjNb_flAX0=s36-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Preparation',
                            value: 'Members: Yes	Level: 67	Type: Basic	Cooldown: 20	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/g684HgWTJpKz6i5L7qcVXsaU-28Kx65f0FMqQuBBLYm5EafHxMK4rE2Q2ixkmImNdkSIzhtZOou66dFIzWOlexBQ6CqNusx-93o7ZRQ7g5Fhh8dqixwNS4VO4F85iqbC3REyf18UBOhji9qnmvT817K2WgedQ-f_kvwOMjfgsteQHcyVGIct1L5uw9Stz9DyZymwgtcajhvYHQ_bXTHMrNA2AZt_slx8TesUxs0H0SEuRqK_QgwRIV0ThyiBLqWrcC7ofPHyjMUEUDLQOeQ83maYkLqttbLxYKRQG-kYHfpeIa4DWnqLtdqMA9wK2YQrH8IscBIElGJYNOS3oRfxNX5nYqoCV3l4aPfRYeOq91a1lT6oDX7FB-Jbyt1Gk9-OLKU1ooMflVDinWjFgLGidK-bd2o_jjwjvZBlyr0NpF8te4IKKWPEEGWObmjhHexCMPWP7as0av4L6kzo_XaO17Rkv1QpbdV7tijBR2R16GCA7njAOLfs2u_HL4joxQnp7ZG7IOvNRR1r1jbMLMumLDPfNrvggGtH6iwzUXt2grBW-MdblcNxFX6cdLgvFiYIwAlc7V1uKFg8bd0c7Tw_ryfPjNBELh5FmsfNlBo4UJg4n54HZdVH=w253-h161-no'}
                          }
                        }
                      );
  }
});

/*provoke ability*/
bot.on('message', (message)=>{
  if (message.content == '!provoke'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/CJeBuLExMmwT2abs7pBauKD0e53pmx2sL0Ts-igoMmB1g1MN8J5hee-nwLH8UQAbQxft_zvVPLwsFigohSD-ccGgVFNFXKYk0KC4I8hq18pPq9r8nwETz3e97woYQGv230DSyHRHCyeFwxP_SEu7PsLEpKTN8SpYHk4mxtdZxbBnnnQ78lMyuNv36Wj26cB3bBPFp9RZjpSLuu7huOHDAcr_IohD76wu-b3Bqbrbse9tX3ADO85yflTFGA01h_yht2NaxuVjNZHIpotn7D44-gWVJsLabVL4zvBRLdFMIu3ySbbhNKnbwY-TCLll9Z4uiJxdU0S8NRev81ai3tF--lRC2x9JJk2AKUhzMMJLbjwyHue_ALwoXml41t2pQKpx2hNKEs_Ixppvys-A9-u_lIuj-W5SdVzE-qTpBuA7CVcrnMjSks_ykuhfZKhI3unitOn1PpnrbYUnK8TcFdlzMx--YTPgZH2cVnAaRnDKxR2taOHeX-ukvvfslXFGL4vKLXCC3fiNbTmMUYsy3x7lPzMED6dReNZhXDtdqfGiblDE-xQH4GQILX9v2quL8LTH0oYKgV-3qwFHY35NN5IMo62Rb_2lvLnssB7L8tAQDV68KQIXW35W=w34-h36-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Provoke',
                            value: 'Members: Yes	Level: 24	Type: Basic	Cooldown: 10	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/JhLsAP9om2b64RKPKzxWHreD59YTvZvpwQhfHOB6CZv7vyC2LFILnFAwczVX2dw79zfjyw2Loccw9Y-o5Nugm26Ztqrd34peOlvEJ2Irv387VMA3nKqy4Ka_Aqhg24F3UVOdP8msXhWWDAb147jaSw-nqMekX0Yf4xnDNS3XV-gRTULtomYWOOrbu0OjwTfF6vgS-_mFOl4O_Ogwno2wNHteqi24b9y17Meb1hNsC9TaflXg0_NAvq54ds43ExOkH9nEB4ND_E-flZVZhJx19qWLr0GXbhrYPOlOkO3O0kFbZlCNNLsgr29XHEZObgSWpcurrJrNzzUYRzptcAPABBuUF4KGl_t_e-0f3IwEH03wTEKTtti-LoF_pCJSELXZFR6SRH-8jh8SU1_IJRqQ3aFdfZb_TDRYe8No2QThGPkP4ws58ulcRAqbULC2SMUmqQRirSNnyG00HOg8vlO_bAc5cZI_zjmwKwl_8APT7gCerSz9kuTvh1EVNBCLwe1zzPODABcdUY91ChG8S4k_EPMHdMpiaSJrZfEejk4o86sZ6MU6AzbBCGciTRAwZCMQBr9vjqxRPChVl1zR-SEAoxo2BtOWGftaoWSFPdhivmhBKoaazEBw=w255-h205-no'}
                          }
                        }
                      );
  }
});

/*reflect ability*/
bot.on('message', (message)=>{
  if (message.content == '!reflect'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/Rmk6TC_4vlG6UHeXlcONqsQqYpNLbLQ77rsEsNY0ty3F9frH-eU1dOUiWt6siyZ-FXTRmGowzwJek4D3GPBzSk5EPQwPz3iGIL4gEGRRKu-NKUtupMOMvxOUnV5x95GM99pdZgqrrbGtFQHjWI4DKJfbWQD5EOHtDFUq3Ke5CMbPrZciz23qCEhshCOAv4owUA8pQSCAOwZ36utqmguU8ikotlMLB8sq3IXMqoRBz4utBBbO4RH9Abt5I6JHJ10R6MXwjbpzu_fF900TctvMhyPu_ztwQnOB6qCQyYgYIgrX7wnEY-31KtGOCrm1lLFaaCu7omn527RNlXzgwnzQLzFA6S5b1pdHcwBipCbYZXPNpz4T7huLtdDzrdMo5yerHVp7Yaa7F20KAez_A2hL93qeI4HK3p_AFryrCBuuVVn9V_UP4LrFX0LnMDDW5dYYvvR1c9kAxGMnqSBtZb75Ud-A5jre4dUfxx9STHbcmcgZMidH0fBp5-vKL5158gExzC03ElM2rL878dmGh_9C-dFEOCjs7I8Ojtb8WchZVnuq1H738tT3uNlEqisry1Vcs0_2VJxy4Em08aVx26Swn74A2YBomvIgI8ojDbLFhEBkmNd81xuR=w35-h36-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Reflect',
                            value: 'Members: Yes	Level: 37	Type: Threshold	Cooldown: 30	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/bP3D_YQiwULJdwDqsfzVpdTtRKC42sGDqpzKvd5XH6rjDXRnvzUGjI8dWiZI2JZPGYFEQfZ8DDoulXwWPj2ymVBCSLrxNInRxhOZItra04lnJ7yQ1cRF2vlKgZHqAknisToTdvhGEENPWUL0kOqVk3TTYu94gybeKMZ4kztJLX2KlsKkaLqObsMrLld_q0RdWM8QU5YdVsYN611vqXC6sfMsj-c8Z-TVSK8t0WsJz6ZBf_4HevoD7c1HuW9VVfGMU2SfK2LONT176cPSLvluXcnD2AlXDh9gihncQuSx9g3HDrDMPHwvcUifvOt0L_5k0d0aLTUhdNRrManJ2KfYiZ2i3GjKIEFGbs2_906wSUHTpFbpEGqzKJftl_XlTohiuIblNA6LrBs_7ZsdWnpUyQL3pj8u_nunSMjqx7nNyk728Uf_BO3qPw0Jm92xb91um24T_rZj0agZ9orE5xc42Ugxjx6VKKrAf3DDcSuWdAqvFNmKu-1Y6sR1nwDDUEhtCCMlDdteEIoyHCRezxK_lASyRAvOLIjJXbelRBEiPCI7e7CzX6GmJP_oTtT_vByeEQgene0FMPUaIm9gr-qA1gaQydEjzaxFpVXk0yq_8grHXlSwYsLs=w254-h164-no'}
                          }
                        }
                      );
  }
});

/*rejuvinate ability*/
bot.on('message', (message)=>{
  if (message.content == '!rejuvinate'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/9dR7_1AsGAlr8jRDzRbiU9cDAaV8X1HFKNhScVwBLe0xpYu0vdMUN5QIk01XsLFpANh71Y2VneVqM5KbpoQtpjRlSz-kuuII4F0QM1-muQz73UajjKZ01fW1hlwCi1Z8ZLEcy6DA1nGfhKqKIOisL1OAObphDtrKQr10nQcdkdbQGykfNNX7OBX_wrxdQdtxkdJO4ONDG25jwEncfdiCUavA6pwFEDdhfWTfV4ghYnBLzuZSynLBER6HE4xsA0yck4R5Vv_8Z6EYmxTWmwOFLbNn6nWmrYR8_7KR01vGL1YizceaG7Vks9-wpALQS2ickyJs2ROyGKNKLLNE15xofNHCwzuC78QCny7xztKUxWWKQ-iQcqNuzW0J5KaWe3SoDvlL6qIKZLLWteISiaDNB-mWBFF1HT5dYU0rtVU3UR4vbi3g1ipzRU84j4oOPVh4sXQtWTBtqSBeuVkT7dLYhreggGWX2dZJDgUExZtOdXKM77Kz3aEXB2wQOAGoONB7GaYRbUzI37mFdD9B8ruNtnHt0CvIszNX7XWLObinCB8aEZcuEHKARe1_St_H5Xih-BAsNIz8gXB2GV01B2L6X09v8mpz3ii1xRdMWHgjCilsvA_oquFD=s35-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Rejuvinate',
                            value: 'Members: No	Level: 52	Type: Ultimate	Cooldown: 300 or 15 Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/td5T4KJQcPEcvM6iFt5mliOroh8jxyhFWC0O-ML4oIiVsecL4EERU3Tg_lF4Oo3qdTPfWAU631A1HMo0c5bSOp0qA2h1YPwfQK4FPpugdjAth5DwsHnjIuFvNKFS23g_yt8LDEy79XgrtRwkKgqLtNiPH4ydHcrwdWyEXMq-KIuS2HH6op_21vNuSXN7SQNxATh3rY_1YYCRGLvWJ1M-5GDSYIBpMIf8KZO_NN8L4W1bg0n7apqbv0EYm2a33K2rprhHmA_CsCp9yx18Vk3Jw9Ey4jE37_MdeRlH_wzlRbgN4em-L6RztE0mTaBgFFMTZw1UDhEeazD2L1nEBCWO7WwvP9CMtu6OcV8tvt8TzFLfymPES2DuUEcHN0s8yrew_t5XTHZlj_AUxeyznh-45zSLKp6_btx6Z0JMWiCrdKysAYeeMX8UVSeP25Adq5ADFGpXzpya4uCFxm_fp6VDGmi1DuHdv5W8yEG7WGl33pascv0ECHhM5KVq2Zd6M4B4BrQZbW8OqdrMQC9SC-1ScefA_vceEbjK4xarkgUALNh5-F22yq4NmbAMBaBzjMLnPoXdzaHKI0-eGkc4srsWP7nCanxw0V8RFmOq6w2OKdR08wnTlUGy=w258-h163-no'}
                          }
                        }
                      );
  }
});

/*resonance ability*/
bot.on('message', (message)=>{
  if (message.content == '!resonance'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/RYhkfPGMDjFDdppc73tmSABpLBRy9Zln0roW7ErSLAPXR7s35e8bBLGZXPFGmVdmls9XVYzk9kz1RzFYEBos8jHe8Qa4YCQIxeecDe7w2L3Q9porfCMZ_i-UGX6J34IOaOPNqKic0ovwrv0z3RETFQC8YhDgZVN8O5oMmSdKDPf7GgLO-ZDqW7xFbHxA59p7F3LGzoCmQayQPMQBMCnTaHlNjNghDKWV6GYKm4QT3VVGKMyDBnh4XmVLn_amk7ZGLfE7belnsAiGfctD4zsALf7Nsx3MO-6NPi17wnwSP7gnoXU8a7-7Ly7QQZ1E5K9PRreG9s6iRx1rbZx9XXtJhZ_0qn70a-BeJ0ccBdsFi6Dna-ioRaMOoELUm1m_Sr2hkfTF34eZWKO9Mq-6RRrmR9VH0MW1cU6GxP0yGNiSOJUc1kEf2xi6etcVp78QoZNaKM_wsKeI7YhjyumO6NfutzpPfMwAtKLfXtjPc1Xd06bVEumn8qKAhaNSH2PRXXvrUbMpxbsg0b1Ly8iBN5bkhdcEPKedVo52ruOdNKOxurnwHVLdJ028ovofCMWJszViUhsKNmWWYwcoINOEsXShQmsDUMVQ8cfJBsGBHglzv-6CT7V1dQoD=w37-h35-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Resonance',
                            value: 'Members: Yes	Level: 48	Type: Basic	Cooldown: 30	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/_7a9tkjJPoGyQF5HcjImfBsb58t5v40jpfahp_0w6DMkQgQ2WBphSIlcxVnyjjp4bIz71jRoceLqRsdsJ7U9-JoJWiFEv7abkoCCCcxnRn8lj4I4BQ4kfpzvQz-PjVaPBNC4QHPgIzsuIAFsjdih4sROF9AIgP6tv_40QWPLfLHdLywiRF7FK2prQuMJwqPkVlQdaxVlmKjdpjrWd7rp5R_q2d36UXMbYo4DfHIN1-IMyXlf45MbdOcnhkA7sUBgkxtSHAKKWK4QQcOYqh2L4x2MAGN0mHhD2t6L_AZQEqUgCpHHZxr9kIovh_eQCPaBeobn5ZOn8f67OR1DjatHIPgp0ZDZG0ArJuUlya-TJQ6QnUZ6Lm9o3NYATa-Us6CnmK3c0xeQBBVRBWGFESqDCahbaHr7J0xy-Y3xK_LNrx6OaCRWS5yVVhkjBzPFwCj9RgeLV6xKYHWdO1JdWNQ8ImzJxmbnu8tIyYBrZRnERaLppU5Y0DMOkdeFzt2PoFSx-N5IZGZYk_jlYFP8xfC18uFGcy8KGzkhko-08mu14I0GsL9VhhBCP3dD65aGO0ui6epWNGFyD95iDvQ8IrAykh-gXU5xaEGJIGttfoaQ56jOQ5W0=w253-h203-no'}
                          }
                        }
                      );
  }
});

/*revenge ability*/
bot.on('message', (message)=>{
  if (message.content == '!revenge'){
    message.channel.send({embed: {
                            color: 8421504,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/E8q1eSzFOXWwf9XM-4k_UWKa4tBemKmywQ-Kd0U_PR5PsmWoGHK7fUN3tU5Yqn30P_YiVkzLbc56OT-EK5vhYaWHe-omNa7OupYxbjBlYSlj-A_IPxVwy3VA_Zr7dmwR2yRm-PXDOXFydrDiZ8CIyB2JJROHs1Ww4zymK5movvtVGzXig8l6g0m1UeB395ck3ajf-U3T6zVF6c5fhoJbMS25ooDp-6tqSYVbIfhQx6P4W5KKFHz4ifzE1J56lp0UOrTdGMsiazA4PXIpETe49CzMPu7EaL05uQFODTReow1lwXZfzlx0B_c9pa6CqUS1tIlllDv7lENyJE8o0OrX8c_ftAkKb2reEXL0AI5nSAFe7yAAQ765UufCRHPlVdjOg1gylnC90yvyfcrCvRYz2HHjPoqDgo0ZNEvljKZ5gUyovaTumfXceu_WCdH5YC1GF5IIRYcBlgcPzFOwDNMRKMvStflf9QNn1I1Yc7GyUZE5WXVTojIk-gWRTFajgGUIvZ4N8SSp7_3g96Jl0ljPFnFnmr84PpyN1rEw_RVx9WJk9i1cWgTzCTccjJu23STk-nhLzaB8k6i20uh59_zE0pJ6XPZV_HmlFMnpjwlNZtEa0lxhF1Le=w35-h37-no'} ,
                            author: {
                            name: 'Defence',
                            icon_url: 'http://cdn.iclanwebsites.com/jrtheblack/Awards/25425.png?1479358236'
                            },
                            fields: [
                            {
                            name: 'Revenge',
                            value: 'Members: Yes	Level: 15	Type: Threshold	Cooldown: 45	Equipment: Shield.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/Yu9S0Wvp4ZYfwlExdIzcKS84fZgoeNCeWNyG_P8CEazO-ewrfecHS1w1eIC7YkFTpNoi_Sej0sYRGFrGH6l60P-qY-0P0PBVGFiHDkdeaN31vt0ZtGGPQ7rKKOqkVQOtGkF9lS9fX85313X0G8R7SOoYtlBZvmSU20Jq7cRyLV6xaY1t1y8rfvzR73xMD78mIwqNSNdnw9Jkfwte5UttqhyAI43SRFCCEOfOdrp0a1EtUyJFjyuupXnBC5RSUI9vX9-ftegn81fyfZxJTMjrm9QQkckiD03ZMGoAe9c4kJBvjv1lM0GJIsPdc5JOcPfFQcZZ2QdlB4Z3Z_xOivLbpfAMChBXcJfBtmuyeQyLFz4L6k4R6Yjt2V97njt9564pQy6RMwORhQFEGqKbc1Xxn3JWv1nVb8XkKV0ig8O5aHc7p_PF2G4ZVT6RUtIRAh9i-wztoptYOPHNXyQg9bMpjPRiPchklO3yFo4FkCfBmrPA5Cy7_DQQAI0UtQaGeUsO3HpUIti4OPFs4quC_R-cfEYmLct1a9XmGlJA6cW6INdiGC4tGsIXHQS02IxxXcgnBb4jCzPy-p-4l8dTjKWTOevbGDY5UMF-1aPOboExwU3pyP0095CV=w253-h159-no'}
                          }
                        }
                      );
  }
});

// /*natural instinct ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!natural instinct'){
//     message.channel.sendFile('./images/abilitiesdefence/naturalinstinct.jpg')
//   }
// });


///////////////////////////////////////////
/*  RANGE ABILITIES  */
bot.on('message', (message)=>{
  if (message.content == '!abilities range'){
    message.channel.send('**Please Specify which abitity**:\n\n'+

                          '!binding shot\n'+
                          '!bombardment\n'+
                          '!corruption shot\n'+
                          '!dazing shot\n'+
                          '!deadshot\n'+
                          //'!death swiftness\n'+
                          '!fragmentation shot\n'+
                          '!incendiary shot\n'+
                          //'!mutated dazing shot\n'+
                          '!needle strike\n'+
                          '!piercing shot\n'+
                          '!rapid fire\n'+
                          '!ricochet\n'+
                          //'!salt the wound\n'+
                          '!shadow tendrils\n'+
                          '!snap shot\n'+
                          '!snipe\n'+
                          '!tight bindings\n'+
                          '!unload\n\n'+

                          '!abilities range all')
                        }});

  bot.on('message', (message)=>{
  if (message.content == '!abilities range all'){
    message.channel.send({embed: {
                        color: 25600,
                        author: {
                        name: 'Ranging Abilities',
                        icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                        },
                        title: 'This is an overview of all ranging abilities',
                        description: 'For more information on each ability use the name of the ability as the command.\n'+
                                      'ex. !binding shot',
                        fields: [
                        {
                        name: 'Binding Shot',
                        value: 'Members: No	Level: 10	Type: Basic	Cooldown: 15	Equipment: Any.'
                        },
                        {
                        name: 'Bombardment',
                        value: 'Members: Yes	Level: 55	Type: Threshold	Cooldown: 30	Equipment: Any.'
                        },
                        {
                        name: 'Corruption Shot',
                        value: 'Members: Yes	Level: 70	Type: Basic	Cooldown: 15	Equipment: Ranged.'
                        },
                        {
                        name: 'Dazing Shot',
                        value: 'Members: No	Level: 8	Type: Basic	Cooldown: 5	Equipment: 2h Ranged.'
                        },
                        {
                        name: 'Deadshot',
                        value: 'Members: No	Level: 2	Type: Ultimate	Cooldown: 30	Equipment: Any.'
                        },
                        {
                        name: 'Death\'s Swiftness',
                        value: 'Members: Yes	Level: 85	Type: Ultimate	Cooldown: 60	Equipment: Any.'
                        },
                        {
                        name: 'Escape',
                        value: 'Members: Yes	Level: 30	Type: Basic	Cooldown: 20	Equipment: Any.'
                        },
                        {
                        name: 'Fragmentation Shot',
                        value: 'Members: No	Level: 20	Type: Basic	Cooldown: 15	Equipment: Any.'
                        },
                        {
                        name: 'Incendiary Shot',
                        value: 'Members: Yes	Level: 66	Type: Ultimate	Cooldown: 60	Equipment: 2h Ranged.'
                        },
                        {
                        name: 'Mutated Dazing Shot',
                        value: 'Members: Yes	Level: 8	Type: Basic	Cooldown: 5	Equipment: 2h Ranged.'
                        },
                        {
                        name: 'Needle Strike',
                        value: 'Members: No	Level: 12	Type: Basic	Cooldown: 5	Equipment: Dual Ranged.'
                        },
                        {
                        name: 'Piercing Shot',
                        value: 'Members: No	Level: 1	Type: Basic	Cooldown: 3 Equipment: Any.'
                        },
                        {
                        name: 'Rapid Fire',
                        value: 'Members: No	Level: 37	Type: Threshold	Cooldown: 20	Equipment: Any.'
                        },
                        {
                        name: 'Ricochet',
                        value: 'Members: No	Level: 45	Type: Basic	Cooldown: 10	Equipment: Any.'
                        },
                        {
                        name: 'Salt the Wound',
                        value: 'Members: Yes	Level: 60	Type: Threshold	Cooldown: 15	Equipment: None.'
                        },
                        {
                        name: 'Shadow Tendrils',
                        value: 'Members: Yes	Level: 75	Type: Threshold	Cooldown: 45	Equipment: Any.'
                        },
                        {
                        name: 'Snap Shot',
                        value: 'Members: No	Level: 2	Type: Threshold	Cooldown: 20	Equipment: Any.'
                        },
                        {
                        name: 'Snipe',
                        value: 'Members: No	Level: 5	Type: Basic	Cooldown: 10	Equipment: Any.'
                        },
                        {
                        name: 'Tight Bindings',
                        value: 'Members: No	Level: 15	Type: Threshold	Cooldown: 15	Equipment: Any.'
                        },
                        {
                        name: 'Unload',
                        value: 'Members: Yes	Level: 81	Type: Ultimate	Cooldown: 60	Equipment: Dual Ranged.'
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                        icon_url: bot.user.avatarURL,
                        text: '© B5TA BOT'
                        }
                        }
                        });
  }
});


/*Binding Shot ability*/
bot.on('message', (message)=>{
  if (message.content == '!binding shot'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/k0najXAbkPQ1AfxfjR2S0qI5CaSAbF1tsewefGwU0105NLShLfj3_DCEtahPg2aosceHWQQXcUNkwM0NxHpObNbGDkEZ5Ddw88Wd9h-r0_2YLzaMJWVC10U5o9ui5PeCN9JEleAPeQOPS3w5jwwiE81bqPD9V9Grez5FqDhRVm7q_Dn5FeElsjkECV44Bulz6L9DerreFsoOBDR7fNqOXjj4ZvvMTxE1WH5Nb0ki2c-a4Vpht79G6xywNWNbcTVNdxO4Lt_F41GmsBEZqnYOPw-TUh4f5oQ73E_IdbxnqC3IiVfFKjWEpZjODKQatzxdzVi0qoX_rZKckRD6VvGVeBLV2ljCBbsh5RzsX8l1oEFZ98T0P-uKqCAD1FA8UhdrvCGNmN44xh0D6MqlQDcZP72fX6X7AnAl8AKAP7hu5f5UQrYtMDEuS0rzlH83veIzDJs-sHrifV4-anPO-YoyHimv-9fzuwj1sshNe8zr_pvQC5oK4r9TqujgZ5-h4G5__NxeTCXyGwFP_NlPzKo0icbnnJMCMYTJzNfAmOe-aaVupX_TlcCCkq7QwieKfPdDSoEPfDzYpo_-abN4fGnTZz_oea_-UjJ1DKdDT-zC6YyxEKv1Z14W=w39-h35-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Binding Shot',
                            value: 'Members: No	Level: 10	Type: Basic	Cooldown: 15	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/HHq__3rT6At5tAYWtXzMcdAynbABA4CpKGjk3VmV_L1MOsxWkFLIGsCVnY4ijfYnYwJvU6i26hMqwBQH5e8ulhi3Q8YJIhXcrbXR7yKNis8LzYqLNWDcN2qm488MLHdQpottRDcA5MCohER7tavG6feQD9mmRHk9KHSp-SGA9UoITOxgnHLlxjdX0ShzZZ6rcxBTSj3bP35pJu5bcLIyzUfWqi-qX0tHThncI5qt_qhuZVZtCb6GWx24VCOghVDA5bkhCIragu8Pw9SmltlzOiR5qhFDeWEVt_0fSxEd5If5U19hP4i6-zR67Pdlie0_2pJh9goQsOATS0wRr18FRlq-X3JhZvXBIS7cy2TI3p8mQ8l9Zlb2r8pFK5r_hSqaMgs3i8XVP3BZigQKLzDkQH96KycD1kSXyAH8V6dOCT13XTPO6xGbifSCLrLgUYEHLF18pjFMYE2IF1fQL_1TS0-shZS_QyGBthKWCwUEDEBaeKJSYQW_xfTa2Tfdf-ZjdOtqype3kw2vrLk95JcMF552JcY5aLmrx8K_yp8jjSje3elQAfMipUtdDKtkH6SlDXN7iD42EkcDYBap7VvMwDAaWiM_iLNT1f7Lq-bjqZVyjtZJ2ba5=w252-h164-no'}
                          }
                        }
                      );
  }
});

/*Bombardment ability*/
bot.on('message', (message)=>{
  if (message.content == '!bombardment'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/EFTZ1d-ri2ICbwEfvLi2dcFa6WsQLNJBB5wt8CZ_zR1J-ca2veI8sgXaJhNRsIl9jwTpz0La1SvCzkAIOdad7kn6nz7-4J5-5--q9x3pusR8stq4qCT1xItzDbs3nD_EJvKfmvPCdmKvQs5tF2-h_Gnn9DQn66KT262FFkjU34Exte9xdbQdXl3PwSYiR8S39BUaBaHX1EOgbtSW60udl_LwNrc0fFwYQqb9IW2z7EyqAgt1Xz-vq0UOoY5VcS08d5vNcDOvJauKOPBWw43jqREEC-zQ2zEccgYib9fBMf-w429cF_3Vpvf7R2O51z4wYx_lhvbR5DTkQ5w_V3uorq1xf5L6tKzuwj2eS4gSU1PPT7b6VU2L_KwF3Ojs4YB5WqVigJE49rTUrvKf5uJbIVw1AgUMUIFFuATIQ0mYqW9i7vh7Nqj0eHA68bkY-DDMZo5ZpaieaDUlq6fK_Vy4HGQ446qa-YqY8E6ibmxhV5QRNWmtreySftrVDzsDytcLygrDGH7Q4Z1mDK6ZvxYH2Ak4gOzK_PwzO90aAqerVWdCm8VMnxOarcNYWrG6kYKkrVVCcO8Wq_5UkPL2xlF-qB6yj1Dw5B_-LfZAj8AHZD2zJawXdz4t=w38-h37-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Bombardment',
                            value: 'Members: Yes	Level: 55	Type: Threshold	Cooldown: 30	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/dvgGj2ulAGdrG5WKtV5LyzUEXHOTvq4HseoDbH4gpsKyJ9_MVAKpRtBZyklT66p1fXRd1R1uTlR30DgPSXfafHoojFeVK5DSqEKldP8_xmhOetFur-XxTLOqyIuUM1zNoiN8mHMrBFEfNbW9Q2zhuIxQYMEQ6npQjAdjZ65uhErmXzkVXboUa6ac2CSU20ab9wVOpro9Hp7HcFs9jPF0v5LlsTF5DI0wirj1NWJVQOLGNhMiwqxt1eFyDpBYivI4f5h-qOEqiCcVGPY7jzVPlz8TkBcamSoXhkfe1-T4MGav0sVhDdxSyNcOxQCQIIu_VCYeHxV6aoqD7rdUrZqWFIzPASBbXHquLGAkOSoOcQ2wd39N1T7ON8y8ncQZWNE0bqqJA8Hkpih3FsMGJpxjk5cRUAn19CgRpNaOjpHuwA4cHI4pjqR8s5fV9fNbDkDTAeUzN5JbrcLAtSsjfBQrhtlfu2qdwoka4dZvrsrf7yr1sm_cxJsGvJYZqPIdNpNvEF4IUzzcfeR4SZxoK7ZtsIE9oUpuQcZ2yU_gd-pykYOmjZ16VphqhP8Gvof5l07-I_2fDjp3oHdnYJwu-k2OqhpZDWs00rHsvwQnXkxW2LX2xfgg5OVc=w251-h161-no'}
                          }
                        }
                      );
  }
});

/*Corruption Shot ability*/
bot.on('message', (message)=>{
  if (message.content == '!corruption shot'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/QhDuxE6wybRAFv05e79xQuf-4ABQuC4UEZxFXmSWKArYgCujxyvuK4bFnLp5uThYQIBwGwWJe7yjZBRah9LfcGjhkFbsZfTAlKPKW-TH3OOobj-JXSaPAhUkDkE4NskCKfq2_efyqhmWy8W8I2aFag4HvXABxQuReyXWd0HkfAlGfy5u_AEfYCD6t6-Qfz6kiBb3hbkjhY8WO2oOTnAQPVXW753WBUuUk4kvBoFabJ4mi-Y7XsKu7wfwckgnr5KbFSU1T-Cnu0XQ2VgXBHlkUZBEUbT5Zl7967dBimcYhssGvOtqKY1ygxpOa0FuZYH08bCwweEX0pJNbj6LSVLi3JIGZVr-kordoyFHl40GPRK7SdkiItywHfzO1pRX3j5hNAFEayNQdrtPoNCeC_KTdimvaZhbCMi2s8VYl1GmhKf1Avp9oWNS13CQ1hHIOOUhNJhr1uwhTWFln8s9lPsbTY5oT7cC1cobncfLdulWeSIMVM7OnnajAn9Xz7E-GuUswKzqPgWZCS21uWN8Y9T76sxbpSf57k5CBBRpGzu58ZG18dUqFqsMNrD6R4gqjGTL5gHvchTiFo6RY_W895TZI2F8hrZuL0H6v-zftNUD-wW0Adjpd2vD=w39-h38-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Corruption Shot',
                            value: 'Members: Yes	Level: 70	Type: Basic	Cooldown: 15	Equipment: Ranged.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/KvfuCOcOpNlE6Ov5AR-hvLX7nC0pEk1qXWDlG3u3jktZowVF-zRPbZGasiigKpczI_szo4lJ4JCgkbAX4Yj5fvhQw8jRGE4JPhjkt0Ng9pZVqwsNp0z_5mjVkztHjZmX_xqKEw0S1RKtPF_51f58cXokrMMcpgWeOo6D-HY36zoy0EKIIHt8zyByCo2K6BJOUh3wWQ46f9apMkDm1JmD4p9WUXDa5Rp59EvzHo7Hajx28ezyLt-HL5vsso4_PmezkYXcZJzqayuXYGg81z6n-ZIgKtsakmuDYm5ZqZFGIfVElRYAMse5hMr8mvZodgOXCfgGrtjIKInUwc3dr9IRjh_yb5-2NJ7hw9ymdOUpQ8Lqe3Oz6JRFe0E2aMiBVMnOb8VpnoNyDn5Gs_rl2dQiju48PlK-4oC64R6b6eAqUC7fubPMb_L5uH8ckeMLtTnTREm-xkG5GzGek9JnuDCuqMttNycq9IaTud_x6zmvz21DML0W0J7BGU77I5o3qdgcmowQ9MLtBwxGwM85N-xZL3IaJrcDapFEGY_ROJstdQNcd05bh1ypY27e6uE7_-sxFWOPWfUmLaKONTeInbGdxykRZzIXRwDxhaOLVAOXi-b80dLmuiEc=w251-h173-no'}
                          }
                        }
                      );
  }
});

/*Dazing Shot ability*/
bot.on('message', (message)=>{
  if (message.content == '!dazing shot'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/Z12i33fUhYIukNj6BbThqPTk1lNaR671RHcsxEN_Iq9rLp5Lrxc9wsjMmtYYd8IRHY_VN7JSPIrbSVmTs35-PwWsjybA6l4mHQRsq9HpEIBaXVC6u_LxirrZrlc42gdpeLDaR1-FUpTE85_HzNyvDLEMgjx5hNAXgZP3oC93Boy8sQ50dh0Oz2xJLfymPp9Hqu__mjuTz7sEN6G65fkHXbkFFVa4F9aFJiWF0i6iaprBgfH_SfW7yaq59E_QEWNjU-ID7Njxrjv2ICiuKwMf9iV5l8ZapwhINIAgNPS3A3MWMbdgR6LEMicDJ5yzA8zhMAgDnA62ecf0C-M2d2G0RlCqhx-R2TSMOg4w-c_0rGLBbwRlPAdwmymRpLTJZTBqInbkNtPyL3fSzmnW6XzGQ6D72f5PB_iLb3GKPJg6lFnYgw6MBOgo5xLD958n4qoBioQT2kWN1mi0xEkMY8aQVnboflp6GxPWMxI0wtheSHyZpIixw5wdUionb8KeqOqsihVmmQCba_uyAbsjiPpdlaeFRQXle8LVJuEA2pJSZxILl4ydPijkYWtxVceYOYp6LZEH3Js9370pgxI_aFdno__Kn0eRiYh_7xbFyENqwhtszn1rV7Av=w36-h35-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Dazing Shot',
                            value: 'Members: No	Level: 8	Type: Basic	Cooldown: 5	Equipment: 2h Ranged.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/mVfyF935JNGRyeAW6LbIHpVrYIBpWkJHDQe7vRi4VUA4UkqHiApxPbqTThLaA-4y7u80yaEo1kqkCYhJrcY4ZuTR1cgtT9uYoEr6afHwMo0WeqZs4kPTBlCQb5I1Vtqjr8igamwag-nNb-kmJW2qWmRDsEuplWqOr4ARqrWHuM7VDkKeuAqY8PDA81H3iLS54O_SpznRLx93AjtkIHb9JBrqf3yeV4OwqC00pLStn3fLu7XaJ1PRkkcq3zNWNKDFVIiqdPKfNZybpY1XVyH8ykrfA8aM5SIQ6vq2t1_C7PxuKIgWbKPLuIbMDfy6D3Wf3PvNTRz24Wn5QWaO3d4HXlxUa9rtgzwN2O32znPPv8u1Ud3z0Z11vK2o5RIj3LAypJGt7c_Ba6FNikWlL1gVQ_u3_saq6av04DCRw0P3vtCmOz7A3Tl-mK_kttxva0Oh_zeUrhceU1uGkrcmpfkpk8TxstVUel7FFHU8LWAiIEp14OF8uRJIG6lL7biaeny3FcBu0Vn52vff9rars0P1ylZYpZlvWMfR6L_jg5oa3kKfTUf3U_QCdTdB7yu-iOBLf9SBpgFoRLY5mCEWjmB80QhSw6oy87YjGfLfaWJBBepW5P-46F-U=w252-h173-no'}
                          }
                        }
                      );
  }
});

/*Deadshot ability*/
bot.on('message', (message)=>{
  if (message.content == '!deadshot'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/_hiD-W0-U3crV8_xDsY9lI_6gvKO4TGYS5Is11Y-fGDbh25sqUQnmfqT34fRGw57KqrSaaMk4nJMTxSsS_M0qNjn2fYasRRby53phe17Bah2wjI9Cm1nsjcP1_62zqNQmOmEOyc13fPf9Sn_9M1zLjhuPuLiCL9FtdanaCEmdJdGEVj6vklzzO3f8k6s2bRUuYu_ZHcwjHZZusiizmabSp_PDTx7MnZjunFcYbJ5LGJ4TuJSqRB7yVe_0U1XTpuUm84myoIFks_Vi7wMEV8_yeFBy09HFxbxKF52u9jlmQ1E0_lZYDpCUgnOMSRUILQTX9hnfHadf_TmYjq_glToTIUmC1gYw1m2xg8_6Bva_5ZcvHTZYZdktl4e-BlRh13GLQsQVkQKVj0onfSoKSsPTJCf6p5ycPz0JuSYiXif8nNCvsVcRJOtQNCb3NL47KpAloS5tvxRdwoIqkW9urF3a24jrYOQJDVO48QiUb2KeWtk8K5KNcT5RJNymZP_qrygQ3snmBrRgmuBb0nhsFxU81gVWHrjgnb3ClIeMhdUj86Ty4a05VtpwUVT6TAvlzNwKziKyy0oct3aAUNjrHTCtEitE59NHBvizATDWv4leqn5FxBTHyHR=w36-h35-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Deadshot',
                            value: 'Members: No	Level: 2	Type: Ultimate	Cooldown: 30	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/kKB4eBv7XEZ18YMIhbMxH54HquySfLz9mb8i-201sW7ajf2V4mBKM4pdNkOkYb4QXnQAr4d7E4bzelsDqkrPsljizaBlcEJZgHThfVuExRSY8ziPMJAC0yUezMHM2ybhozE_X1U7bdM2R1Ah6gLzR8OsY7Gk2c7vs6L-yMw2te5cyjrqwtk-jYZPSkzpTr8DfjqL1FOSRYruKec7xIGpsQ_GrZdt5DLppe-Tuh_aIqeYi3WJ17iYU-8Szx6l2QFgNbXw7uQIk7hKWFh9VTuWK8fLi_UrnHagrmS1wYJh0F7ObO-dmn_vUosUKk6XhicJL0q0W_LKkhB__QVPNaX31EHxA_p5st9MHaTJzNlq_JQ5xUryLXB4MS2V2DJtkwKSfOHz6vufYupGRkx8m-VNNlvwglYervoT9Q7daIOjlGj5Ed_p08Kn9qeHCQDeKuSUxk5oZVDmxqadMX_SbYuHLAvmVbnJvDZAtIA-YWMFFPhNDnlYOZYgKGbu2yc91nF9ZuzRMqq8gv-52-X2D_ffpD77lK_lx9zrjxRN6w9FIVZ1vMx45VYl-hpwwqNqlkYV3oIQ9TatCuJQisb7wGHGKm_kF7HondVU-94l2Otros125F5199ZU=w254-h163-no'}
                          }
                        }
                      );
  }
});

// /*Death\'s Swiftness ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!death swiftness'){
//     message.channel.send({embed: {
//                             color: 25600,
//                             thumbnail:{ url:'ABILITY_ICON_LINK'} ,
//                             author: {
//                             name: 'Ranging',
//                             icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
//                             },
//                             fields: [
//                             {
//                             name: 'Death\'s Swiftness',
//                             value: 'Members: Yes	Level: 85	Type: Ultimate	Cooldown: 60	Equipment: Any.'
//                             }],
//                             image:{ url:'ABILITY_DETAILS_LINK'}
//                           }
//                         }
//                       );
//   }
// });

/*Escape ability*/
bot.on('message', (message)=>{
  if (message.content == '!escape'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/o5yB8PgPS1W47blMnAw-oWpbse-1morZdMxYXWkl4IdKvsj8VGdnJoDw900OWvPZTnI_Wph3zByceT1bQKit6fiYUkYsRVhQCQ5jpA44MJR2UCuvp3WR1X_J04wITt56xWX_y-Zygn31Id8TvJqpRY4pjuJBQ4LQsENquy4v4V-TYqqIXi7WgEmgnwP8hNYzKit2M9dziHCOBC4GxRE4QxeEXGF0SmyYipbUuXf2Hz7IiduS2bVQ_lVXDcpg6jUrAWV5BN01uUOK83brrJJc4eEPTE1ucifdI46InSRSLIPiyjsV5uPjSnlLWAcN7LjD-U2zHrmz9plU29rWiNwkSvD4IrL6bx5BQvDT1UsM4H1lBfn-qQaWPE4AG1mYVeVU97pn4VWua5fkOQ8luJtkQd_B9tLxxuPODfDCbZcQGEuDslpRzmDht9D9Q8cum89OodgbR1-DCM565V-LrX-_QRSt5dNxlIN1sXm0IycnJHgJN2yZqGV1KrxKcSV0mz-qlxMx9wWreNWEWEDnqT0GekT6orPSCsdm03RObDaK3G4I6AnQYXTMlZ8K2Knj07X0IFr43WhAV-zHVl6UehNz8vDbcGHTYbJbkpeze0nZFSzAyZZR3yFG=w34-h35-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Escape',
                            value: 'Members: Yes	Level: 30	Type: Basic	Cooldown: 20	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/92l4beqTJ_hrLPniPc6ukirCoWuFPK9chBghVPvOyHu7JJaXcsP7HIq_qcVQ8EvdHynKk5xPkp2RN-i5MkNw8zWtHbqeyNrlyizp00c4caayjzMeKmt_hQa31MSG4_HGxD1QKNj4ERFyVEmSMEhM2_21zfglFYhXBnU-dd968hu_p4yYyNQtO3iBbxfaH8CnWOmYuafaHDOUnaYE9wGBJlb0e-BKDlPrne0LVLxzbNWyWFkquRPnH29z48RTVV7GSTqCz20PrnfliUWPpevYQHnv27kH-nEi3jalgt3kV5lGdqb_IWaYsTGjV24iegHBIFDGNGAZNVCHArzyD2w1aJzKB75NU5yetcQ3bYyCfW6_XVbuWABeMdNtQvnkXyrLUSQ9iwHjAPV9VJLY7ywFYiMWmij23aqttdB9tWqp5d0PjVqN4JZw9JfSCnExN8RjRNKpZTt6mPovp0hHfCCc53vBOd2NGnPd86gUuZ0O3NjEN2njkt-ztmhzDN6SAkMkssT0TQNAfomNy3I4NM35JpFAKtOrIh6wFxWJN5FiDdmXjkkX6Rgc0hGDASylxq56UUnCy_Ia3oXgWcmF5h-1hORVDFEdvG7Rk2c8BbzxCEp_rbOf3qqM=w253-h162-no'}
                          }
                        }
                      );
  }
});

/*Fragmentation Shot ability*/
bot.on('message', (message)=>{
  if (message.content == '!fragmentation shot'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/mhexhJxtS-ofv--XmdjVHqrmPqKDbtyCC1pE-XHbUqNCP5KSgA-eg0-1F27c0q_mzVnNtFuc4IBgDdHBrkkEi_Gav5Nl2Q39AGoM3PsuY9C8EJ4kol94SFboHTqpGkoumU1cSkoevwGqTWjRWSyAcpCn88B2Djcpko6QhYX2MYT_iw8VfcjcdyC7bzKFl9wjmBroiA94Xh0EzMwndAka6PShZgBMW17dyjBd9ZX1YdJSevOM8GIFyayU3meOQ0V86a6rsupJYtF2UwYXQ2s5n3qaIdTZlbz11DgdLuiQsIncZ8yLJ4ZJXeccBEi76BObJ3XLPikfSSP6Szbfsmbod49-b1ewhjy6H6WOJYqUIfvohKOPW8NGlHlnFe63nN7aSwqNl35-kyFRl3Ehd1hvSmysPQsZ593WQSRdCPxaBQf5ykSiKJGdXOQXysSGau6paDuH5Otre5UBAOhlp0Yl4-wmH8gwhdAaNiEzCUKuhgImROVg4DG1YoBV2p7j0jeqbe1YdP9la-mpqXrkbJiz9S9lHeTlu3pbS0MFHo9-7AlkeQUF74PeAw_r85iTZ8FxWUMqAjBs_O2msOd4VEqQjEC7t7xhU4bsZ2L5Gj6-SVaRVOXd0Hsf=w38-h35-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Fragmentation Shot',
                            value: 'Members: No	Level: 20	Type: Basic	Cooldown: 15	Equipment: Any.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/100nQI40ModqIxt5nGLmxZftXOFvEJ_5UdCksxC_5YIUO4WsnucmMNTQ3PiVisyqEkYiw5rmOe3w5RtrSEGFmHpwwGDVuMyAujbYk-Nzg21qcK70caGWbCxxQOPY2qAi8153lyAPm5QD8BRJKbx-L3JqN6CKZdiZwZkjvd9QYWviYnSOA0e7nSviLpShGqXwLjRTXJRHfpMLfZWEdwOdJfgKvRCMmNDQ4ZTCUStSymHGNLF8NwPuFgNw_sWHH7yeN7hEs9mgY9VMrFBgH4pYVuvNAQawJhM1YqjTwZtS-gE9fYTp-nYd3FPwskwKhNz65DPHNgDDBY-d0oCdYlzAGe5PibDPK4qw5y9umgVGElXn7CziJMqHx6L5xk5DbDcJIFUvLa6139-RzWoOjyg5SsIAXf7wyeu0FPY74Kep_b7EFD-Ng-eqnzronvgYexxlPiQGXc5gWSsjIHPADfSJTnKkb2KQHGTb1Pkw2oWfGVotgqEvuCA5PJ_KGlQmrTd-_tU0uyaRZ9mTe4G97yqa5brL5hCo3lNTwPB1jlwWU_RyNWxS-dx-zmtgpQbUnrtpQ7xeLhZjqpKAZtBOmORFnNMTbSsaJhNzVj-omgCBsQ9kb52-kL_V=w252-h176-no'}
                          }
                        }
                      );
  }
});

/*Incendiary Shot ability*/
bot.on('message', (message)=>{
  if (message.content == '!incendiary shot'){
    message.channel.send({embed: {
                            color: 25600,
                            thumbnail:{ url:'https://lh3.googleusercontent.com/7NOt-QHuGsqWU65C6wQ6LdC1V7fazTuHgV6n7TuakK6tcV5vZbRGxo7_gP8578W6k59a56fDgIgG9K41FXbUq6OIK4ayOT4Cwd2Ljp1jFr0p7_HEznXPNM0ATDliAVivneeXYzCdNiJ9vn27KRkVqxpy8s3EuhzpmMr7a9euNkuukffI1DFY2vTUGj4IobCpeD4Qs5R-KfwO4_IY5q2cTD0TpSQybfMJohZJUpjwUJgfYJfdqA4Ysem1kYoGcYrCYEmSU732_nHZFpWGf8w7t15cPFrGiKyIEofJDWz1sW2hkKgz9zvvfg8nzg9rIz6BTOK4nFQYBmFLMKq1rQEVk5jdHV0LFGsy_YndJUMSsRLPNE2t7pzxQEtUPzCHqhV9wy7uA8qmldqtStTpBBN-q43YGPyVmLyulw4_Yz0Qw1T8GGi5TBiGYD4wKzPsUEa28sHnkYSH4uWrSnluPYlZCt-_RzynQvV2EYDKxNe6qoeN8kRfrEWq_hubq_lTNwiCCuMvwC2G2g2UF2Bv20g-Unw9FZ3JkzPZoknngBK1DnV1n3R2ANaufLljTZR-cn0giiw0lx2O8E3GS3XiSd-C4hLqgX2x9XutA5Vk7NOqkfF5kOFQHXfr=w39-h36-no'} ,
                            author: {
                            name: 'Ranging',
                            icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
                            },
                            fields: [
                            {
                            name: 'Incendiary Shot',
                            value: 'Members: Yes	Level: 66	Type: Ultimate	Cooldown: 60	Equipment: 2h Ranged.'
                            }],
                            image:{ url:'https://lh3.googleusercontent.com/GoIO0V1WzK2d0r7rXzUIKb0TO2rKEiPVDCwxAFlPoXvDYi-e3n8IKleIpCCCuasKUpTCxmUv4sjxuo055c9krirYFzc4NHADik5aUw-61VeN_9d07i6rV-IgX-nAmGgPefR7_jFP6vWS4viCADY_qI59AIui5U9MkY9IOX9a4DJwGJ1wO9OgGeaYI75tHw9HPDYJ2pqN_8jMbcgUzPa9hrdfm-S133_LPEuccx6GW-2ZJ8ariCkhTG5mlS2H7fQ19M-91pg0ZTxVc35XqTcQqRblLSreiXu94y8iENPgTchuRPENHdajSQRgrCdUwRBgbKZ8LcHJihfuOlzjQoAG6Ktx-sx3bebN6VfckNgfit0q4f17qo1OT-UJ8IY2X8zX4iHH2WJgV53RHDKQY4G9tKBC8CcqUTM1ftriP5N6cttoGKJ7ajFN3wNIeLcZyhWz65Vzj2rZtSAPQ17sGZarkJL0Ep9AN4ODrtVb7MznBkIWvrONRo4BohVYydl5woI7D4rfzIIbcQcTQDutrszfrXxumY2Y6cWCJoGgiwmKZ7K-BON5KmeEaKYO_ZunAeRh1k182WXKxG1rrc8D1A3LblLv-_09i2NBdrYZhDlPPzvNlm32XGV1=w251-h188-no'}
                          }
                        }
                      );
  }
});

// /*Mutated Dazing Shot ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!mutated dazing shot'){
//     message.channel.send({embed: {
//                             color: 25600,
//                             thumbnail:{ url:'ABILITY_ICON_LINK'} ,
//                             author: {
//                             name: 'Ranging',
//                             icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
//                             },
//                             fields: [
//                             {
//                             name: 'Mutated Dazing Shot',
//                             value: 'Members: Yes	Level: 8	Type: Basic	Cooldown: 5	Equipment: 2h Ranged.'
//                             }],
//                             image:{ url:'ABILITY_DETAILS_LINK'}
//                           }
//                         }
//                       );
//   }
// });


// /*ABILITY_NAME Shot ability*/
// bot.on('message', (message)=>{
//   if (message.content == '!ABILITY_NAME'){
//     message.channel.send({embed: {
//                             color: 25600,
//                             thumbnail:{ url:'ABILITY_ICON_LINK'} ,
//                             author: {
//                             name: 'Ranging',
//                             icon_url: 'http://vignette2.wikia.nocookie.net/soulsplit3/images/e/ea/Ranged_big-13011024.png/revision/latest?cb=20151102014325'
//                             },
//                             fields: [
//                             {
//                             name: 'ABILITY_NAME',
//                             value: 'Members: Yes	Level: 91	Type: Ultimate	Cooldown: 300	Equipment: None.'
//                             }],
//                             image:{ url:'ABILITY_DETAILS_LINK'}
//                           }
//                         }
//                       );
//   }
// });

/*Clue Scroll messages*/
bot.on('message', (message) =>{
  if (message.content == '~cluescroll'){
    message.channel.send('Please specify what you are looking for \ncluescroll-strategy \ncluescroll-easy \ncluescroll-medium \ncluescroll-hard \ncluescroll-elite');
  }
});

bot.on('message', (message) =>{
  if (message.content == '~cluescroll-strategy'){
    message.channel.sendMessage('Link to Strategy Guide: http://runescape.wikia.com/wiki/Treasure_Trails#Types_of_clues');
  }
});
bot.on('message', (message) =>{
  if (message.content == '~cluescroll-easy' ){
    message.channel.sendMessage('Easy Clue Scroll: http://runescape.wikia.com/wiki/Clue_scroll_(easy)');
  }
});
bot.on('message', (message) =>{
  if (message.content == '~cluescroll-medium'){
    message.channel.sendMessage('Medium Clue Scroll: http://runescape.wikia.com/wiki/Clue_scroll_(medium)');
  }
});
bot.on('message', (message) =>{
  if (message.content == '~cluescroll-hard'){
    message.channel.sendMessage('Hard Clue Scroll: http://runescape.wikia.com/wiki/Clue_scroll_(hard)');
  }
});
bot.on('message', (message) =>{
  if (message.content == '~cluescroll-elite'){
    message.channel.sendMessage('Elite Clue Scroll: http://runescape.wikia.com/wiki/Clue_scroll_(elite)');
  }
});


/////////////////////////////////////////                     HELP COMMAND                       //////////////////////////////////////////////////////////
bot.on('message', (message) =>{
  if (message.content == '!help'){
    message.author.send('__**HELP (COMMAND GUIDE)**__\n\n'+

                        '-~-~-~-~-~-~-~-~-~-~'+
                        '**Welcome to B5TA BOT**'+
                        '-~-~-~-~-~-~-~-~-~-~\n\n'+

                        'Looking for content and content writers! Join us is creating the best guide bot for runescape on discord. '+
                        'This is a wonderful oppurtunity to get a little coding experience. If you have content you would like to post on the bot, '+
                        'but don\'t know anything about coding, pm me on discord jefish#3948\n\n'+

                        '-----__**COMANDS**__-----\n'+
                        '(all commands start with !)\n\n\n'+

                        '__BOSSES COMMANDS__\n'+
                        '!boss - List of bosses this bot has\n\n'+

                        '__**Low-Level Bosses**__\n'+
                        '!boss-chaos - Chaos Elemental\n'+
                        '!boss-dag - Dagannoth Kings\n'+
                        '!boss-mole - Giant Mole\n'+
                        '!boss-kq - Kalphite Queen \n'+
                        '!boss-ekq - Exiled Kalphite Queen\n'+
                        '!boss-kbd - King Black Dragon\n'+
                        '!boss-barrows - The Barrows Brothers\n'+
                        '!boss-jad - TzTok-Jad\n\n'+

                        '__**God Wars Dungeon**__\n'+
                        '!boss-kree - Kree’arra (Armadyl)\n'+
                        '!boss-graar - General Graardor (Bandos)\n'+
                        '!boss-zil - Commander Zilyana (Saradomin)\n'+
                        '!boss-kril - K’ril Tsutsaroth (Zamorak)\n'+
                        '!boss-nex - Nex (Zaros)\n\n'+

                        // '__**Medium-Level Bosses**__\n'+
                        // 'Corporeal Beast: boss-corp\n'+
                        // 'Har-aken: boss-aken\n'+
                        // 'Legiones: boss-legiones\n'+
                        // 'Queen Black Dragon: boss-qbd\n'+
                        // 'Kalphite King: boss-kk\n\n'+

                        '__**God Wars Dungeon 2**__\n'+
                        '!boss-greg - Gregorovic (Sliske): \n'+
                        '!boss-helwyr - Helwyr (Seren): \n'+
                        '!boss-twins - Twin Furies (Zamorak): \n'+
                        '!boss-vinny - Vindicta & Gorvek (Zaros): \n\n'+

                        // '__**High-Level Bosses**__\n'+
                        // 'Araxxor: boss-rax\n'+
                        // 'Barrows, Rise of the Six: boss-rots\n'+
                        // 'Telos: boss-telos\n'+
                        // 'Vorago: boss-vorago\n\n'+
                        //
                        // '__**Raids**__\n'+
                        // 'Beastmaster: boss-bm\n'+
                        // 'Yakamaru: boss-yaka\n'+

                        '__POTIONS COMMANDS__\n\n'+
                        '!ovl, !ovls, !overload\n'+
                        '!prayer restore\n'+
                        '!anti-fire\n'+
                        '!super anti-fire\n'+
                        '!super restore\n'+
                        '!super attack\n'+
                        '!super strength\n'+
                        '!super defence\n'+
                        '!super magic\n'+
                        '!super ranging\n\n'+

                        '__ACTIONBAR COMMANDS__\n\n'+
                        '!actionbar magic dualwield\n'+
                        '!actionbar magic 2h\n'+
                        '!actionbar range dualwield\n'+
                        '!actionbar range 2h\n'+
                        '!actionbar melee dualwield\n'+
                        '!actionbar melee 2h\n\n'+

                        '__ABILITIES COMMANDS__\n\n'+
                        '!abilities magic\n'+
                        '!abilities range\n'+
                        '!abilities attack\n'+
                        '!abilities strength\n'+
                        '!abilities defence\n'+
                        '!abilities constitution\n\n'+

                        '__INVENTION__\n'+
                        '!siphons\n'+
                        '!augmentors\n\n'+


                        '__MISCELLANEOUS__\n'+
                        '!cluescroll\n'+
                        '!weewoo'
                        );
  }
});

//bot.login(bot.config.token);
init();
