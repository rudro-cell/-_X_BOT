const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
name: "toilet",
version: "1.0.1",
credits: "SHAHADAT SAHU",
description: "Generate a toilet banner image",
commandCategory: "banner",
usePrefix: true,
usages: "[@mention | reply]",
cooldowns: 5
};

module.exports.run = async function ({
api,
event,
Currencies
}) {
try {

let targetID = null;

if (event.type === "message_reply") {
  targetID = event.messageReply.senderID;
} else if (
  event.mentions &&
  Object.keys(event.mentions).length > 0
) {
  targetID = Object.keys(event.mentions)[0];
}

if (!targetID) {
  return api.sendMessage(
    "Please reply to or mention someone.",
    event.threadID,
    event.messageID
  );
}

const senderID = event.senderID;

try {
  if (
    Currencies &&
    typeof Currencies.increaseMoney === "function"
  ) {
    const randomPercent = Math.floor(Math.random() * 101);
    const randomAmount =
      Math.floor(Math.random() * 100000) + 100000;

    await Currencies.increaseMoney(
      senderID,
      randomPercent * randomAmount
    );
  }
} catch (err) {
  console.log("Currency Error:", err);
}

const apiList = await axios.get(
  "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json"
);

const AVATAR_CANVAS_API = apiList?.data?.AvatarCanvas;

if (!AVATAR_CANVAS_API) {
  return api.sendMessage(
    "❌ API Error!\n☎️ Call Boss RUDRO",
    event.threadID,
    event.messageID
  );
}

const res = await axios.post(
  `${AVATAR_CANVAS_API}/api`,
  {
    cmd: "toilet",
    uid: targetID
  },
  {
    responseType: "arraybuffer",
    timeout: 30000
  }
);

const cacheDir = path.join(__dirname, "cache");

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, {
    recursive: true
  });
}

const imgPath = path.join(
  cacheDir,
  `toilet_${targetID}.png`
);

fs.writeFileSync(
  imgPath,
  Buffer.from(res.data)
);

return api.sendMessage(
  {
    body: "বেশি বাল পাকলামির জন্য তোরে টয়লেটে ফেলে দিলাম 🤣🤮",
    attachment: fs.createReadStream(imgPath)
  },
  event.threadID,
  () => {
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  },
  event.messageID
);

} catch (error) {
console.error("TOILET CMD ERROR:", error);

return api.sendMessage(
  "❌ API Error!\n☎️ Call Boss RUDRO",
  event.threadID,
  event.messageID
);

}
};
