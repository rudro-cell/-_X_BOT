const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Rudro (fixed)",
  description: "Show Owner Info with styled box & image",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  const info = `
╔═════════════════════ ✿
║ ✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨
╠═════════════════════ ✿
║ 👑 𝗡𝗮𝗺𝗲 : 𝗥𝗨𝗗𝗥𝗢
║ 🎂 𝗔𝗴𝗲 : 𝟭𝟴+
║ 💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻 : 𝗦𝗶𝗻𝗴𝗹𝗲
║ 🎓 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 : 𝐌𝐁𝐀
║ 🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝐍𝐚𝐫𝐚𝐲𝐚𝐧𝐠𝐚𝐧𝐣
╠═════════════════════ ✿
║ 📘 Facebook:
║ https://www.facebook.com/61571107303187
╚═════════════════════ ✿
`;

  // ✔ FIX: valid direct image only
  const images = [
    "https://i.imgur.com/ZWLgcJl.png"
  ];

  const randomImg = images[Math.floor(Math.random() * images.length)];

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  const imgPath = path.join(cacheDir, "owner.jpg");

  try {
    const writer = fs.createWriteStream(imgPath);

    const response = await axios({
      url: randomImg,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: info,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage(info, event.threadID, event.messageID);
    });

  } catch (e) {
    api.sendMessage(info, event.threadID, event.messageID);
  }
};
