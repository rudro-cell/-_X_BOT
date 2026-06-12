const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "helpall",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Rudro (fixed)",
  description: "Displays all available commands in one page",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  if (!commands) {
    return api.sendMessage("❌ Commands not loaded", threadID, messageID);
  }

  const allCommands = [];

  for (let [name] of commands) {
    if (name && name.trim()) {
      allCommands.push(name.trim());
    }
  }

  allCommands.sort();

  const finalText = `╔═══❖ 🌟 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌟 ❖═══╗
${allCommands.map(cmd => `║ ➔ ${cmd}`).join("\n")}
╠═════🔰 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🔰═════╣
║ 🤖 Bot: 𝐑𝐎𝐒𝐄 Chat Bot
║ 👑 Owner: RUDRO
║ 📦 Commands: ${allCommands.length}
╚═══════════════════════╝`;

  // ✔ FIX: valid direct image only
  const backgrounds = [
    "https://i.imgur.com/ZWLgcJl.png"
  ];

  const selectedBg =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  const imgPath = path.join(cacheDir, "helpall.jpg");

  try {
    const writer = fs.createWriteStream(imgPath);

    const response = await axios({
      url: selectedBg,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: finalText,
          attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => fs.unlinkSync(imgPath),
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage(finalText, threadID, messageID);
    });

  } catch (err) {
    console.log(err);
    api.sendMessage(finalText, threadID, messageID);
  }
};
