const config = {
  "ownerID": "198246009699041281",

  "admins": [],

  "support": [],

  "token": "NDAwMzkyOTU0MjE4NTQ1MTY0.DTa-tg.xDSlSqaRLghHpOSe0-rlnYlp-8Y",


  "defaultSettings" : {
    "prefix": "$",
    "modLogChannel": "mod-log",
    "modRole": "Moderator",
    "adminRole": "Administrator",
    "systemNotice": "true",
    "welcomeChannel": "welcome",
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    "welcomeEnabled": "false"
  },

  permLevels: [
    { level: 0,
      name: "User",
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      check: (message) => {
        try {
          const modRole = message.server.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator",
      check: (message) => {
        try {
          const adminRole = message.server.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "Server Owner",
      check: (message) => message.channel.type === "text" ? (message.server.owner.user.id === message.author.id ? true : false) : false
    },

    { level: 8,
      name: "Bot Support",
      check: (message) => config.support.includes(message.author.id)
    },

    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: "Bot Owner",
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
