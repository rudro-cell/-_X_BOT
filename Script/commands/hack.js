const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
name: "hack",
version: "1.0.1",
credits: "RUDRO",
description: "Generate hack banner image",
commandCategory: "banner",
usePrefix: true,
usages: "[@mention | reply]",
cooldowns: 5
};

module.exports.run = async function ({ event, api }) {
const {
threadID,
messageID,
senderID
} = event;

let targetID = null;

if (
event.mentions &&
Object.keys(event.mentions).length > 0
) {
targetID = Object.keys(event.mentions)[0];
} else if (
event.messageReply &&
event.messageReply.senderID
) {
targetID = event.messageReply.senderID;
}

if (!targetID) {
return api.sendMessage(
"Please reply or mention someone......",
threadID,
messageID
);
}

try {

const apiList = await axios.get(
  "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json"
);

const AVATAR_CANVAS_API =
  apiList?.data?.AvatarCanvas;

if (!AVATAR_CANVAS_API) {
  return api.sendMessage(
    "❌ API Error!\n☎️ Call Boss RUDRO",
    threadID,
    messageID
  );
}

const res = await axios.post(
  `${AVATAR_CANVAS_API}/api`,
  {
    cmd: "hack",
    senderID,
    targetID
  },
  {
    responseType: "arraybuffer",
    timeout: 30000
  }
);

const cacheDir = path.join(
  __dirname,
  "cache"
);

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, {
    recursive: true
  });
}

const imgPath = path.join(
  cacheDir,
  `hack_${senderID}_${targetID}.png`
);

fs.writeFileSync(
  imgPath,
  Buffer.from(res.data)
);

return api.sendMessage(
  {
    body: "তোর আইডি হ্যাক করা হলো ✅",
    attachment: fs.createReadStream(imgPath)
  },
  threadID,
  () => {
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  },
  messageID
);

} catch (error) {

console.error(
  "HACK CMD ERROR:",
  error.response?.data || error.message
);

return api.sendMessage(
  "❌ API Error!\n☎️ Call Boss RUDRO",
  threadID,
  messageID
);

}
};
