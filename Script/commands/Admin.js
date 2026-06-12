const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

module.exports.config = {
  name: "admin",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Rudro (fixed)",
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "admin",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const time = moment()
    .tz("Asia/Dhaka")
    .format("DD/MM/YYYY hh:mm:ss A");

  const cachePath = path.join(__dirname, "cache");
  const imgPath = path.join(cachePath, "owner.jpg");

  // ensure cache folder exists
  fs.ensureDirSync(cachePath);

  const callback = () => {
    api.sendMessage(
      {
        body: `
┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝗥𝗨𝗗𝗥𝗢
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞 
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞 
│ 🎂 𝐀𝐠𝐞 : 𝟏𝟖+
│ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦 
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝐌𝐁𝐀 
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐍𝐚𝐫𝐚𝐲𝐚𝐧𝐠𝐚𝐧𝐣 
└───────────────⭓

┌───────────────⭓
│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧
├───────────────
│ 📘 Facebook:
│ https://www.facebook.com/profile.php?id=61571107303187
└───────────────⭓

┌───────────────⭓
│ 🕒 Time
├───────────────
│ ${time}
└───────────────⭓
        `,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );
  };

  // FIX: direct image URL needed (replace this)
  const imageUrl = "https://i.imgur.com/ZWLgcJl.png";

  const writer = fs.createWriteStream(imgPath);

  const response = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  writer.on("close", callback);

  writer.on("error", () => {
    api.sendMessage("❌ Image load failed!", event.threadID);
  });
};
