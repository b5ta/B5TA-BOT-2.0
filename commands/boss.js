const { inspect } = require("util");

exports.run = (client, message, args) => {
  if (args[0]) {

    let boss = client.bosses.get(args[0]) || client.bosses.get(client.bossaliases.get(args[0]));
    if(client.bosses.has(boss.info.name)){
      client.logger.log("yay we have a boss!");
      message.reply('__**' + boss.info.name + '**__\n' + boss.info.description + '\n' + boss.info.website);
    }
  }
  else {
    // Show individual command's help.

    let localdbClient = new client.database.Client(client.dbConnectionString);
    let query = {
      text: 'SELECT B."ID",B."Name",B."BossGroupID",BG."Name" FROM public.Boss B INNER JOIN public."BossGroup" BG ON BG."ID" = B."BossGroupID"',
      rowMode: 'array'
    };
    localdbClient.connect(function(err, dbclient, done){
      if(err){
        client.logger.log(err,"error");
        client.logger.log("error fetching client from pool", "error");
      }
      else {
        client.logger.log("im checking bosses now");
        dbclient.query(query, function(err, result){
          if(err){
            client.logger.log(err,"error");
            client.logger.log("error running query","error");
          }
          let msg = 'Specify which boss with boss-bossname: \n\n'
          let lowlvlbossList = '__**Low-Level Bosses**__\n' + result.rows.filter(function (item){
            return item[2] == 1;
          }).
          map(function (item){
            return item[1];
          }).
          sort(function (a, b){
            return a < b ? 1 : 0;
          }).join(", \n");
          client.logger.log(lowlvlbossList, "warn");
          msg = msg + lowlvlbossList;
          client.logger.log(msg);
          message.reply(msg);
          dbclient.end();
        });
      }
    });
  }
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
