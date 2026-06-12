const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Rudro (fixed)",
  description: "Shows all commands with details",
  commandCategory: "system",
  usages: "[command name/page number]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    moduleInfo: `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┃ ⚙ Prefix: %8
┃ 🤖 Bot: %9
┃ 👑 Owner: RUDRO
╰━━━━━━━━━━━━━━━━╯`
  }
};

// ✔ FIX 1: valid image only (replace with your own)
const helpImages = [
  "https://i.imgur.com/ZWLgcJl.png"
];

// safe downloader
async function downloadImage(filePath, url) {
  const writer = fs.createWriteStream(filePath);

  const res = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// ---------------- HANDLE EVENT ----------------
module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body || !body.startsWith("help")) return;

  const { commands } = global.client;
  if (!commands) return;

  const args = body.split(" ");
  if (args.length < 2) return;

  const cmdName = args[1].toLowerCase();
  if (!commands.has(cmdName)) return;

  const command = commands.get(cmdName);

  const prefix = global.config.PREFIX || "/";

  const text = this.languages.en.moduleInfo
    .replace("%1", command.config.name)
    .replace("%2", command.config.usages || "N/A")
    .replace("%3", command.config.description || "N/A")
    .replace("%4", command.config.hasPermssion)
    .replace("%5", command.config.credits || "Unknown")
    .replace("%6", command.config.commandCategory || "Unknown")
    .replace("%7", command.config.cooldowns || 0)
    .replace("%8", prefix)
    .replace("%9", global.config.BOTNAME || "BOT");

  try {
    const imgUrl =
      helpImages[Math.floor(Math.random() * helpImages.length)];

    const filePath = path.join(__dirname, "cache", "help.jpg");

    await downloadImage(filePath, imgUrl);

    api.sendMessage(
      {
        body: text,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => fs.unlinkSync(filePath),
      messageID
    );
  } catch (e) {
    api.sendMessage(text, threadID, messageID);
  }
};

// ---------------- RUN ----------------
module.exports.run = function ({ api, event, args }) {
  return module.exports.handleEvent({ api, event });
};
