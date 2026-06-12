const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "arrest",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "RUDRO",
  description: "Generate chor meme using sender and target UID",
  commandCategory: "fun",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 5,
  dependencies: {
    axios: "",
    "fs-extra": "",
    path: ""
  }
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID = null;
  let tag = "";

  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    tag = mentions[targetID];
  } else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
    tag = "Reply User";
  }

  if (!targetID) {
    return api.sendMessage(
      "Please reply to or mention someone.",
      threadID,
      messageID
    );
  }

  try {
    const cachePath = path.join(__dirname, "cache");

    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }

    const apiList = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/main/SAHU-API.json"
    );

    const AVATAR_CANVAS_API = apiList?.data?.AvatarCanvas;

    if (!AVATAR_CANVAS_API) {
      return api.sendMessage(
        "AvatarCanvas API not found.",
        threadID,
        messageID
      );
    }

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      {
        cmd: "chor",
        senderID,
        targetID
      },
      {
        responseType: "arraybuffer",
        timeout: 30000
      }
    );

    const imgPath = path.join(
      cachePath,
      `chor_${senderID}_${targetID}.png`
    );

    fs.writeFileSync(imgPath, res.data);

    return api.sendMessage(
      {
        body: `হালা মুরগী চোর 😹🕵️‍♂️\n=> ${tag}`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      },
      messageID
    );
  } catch (err) {
    console.log(err);

    return api.sendMessage(
      `API Error:\n${err.message}`,
      threadID,
      messageID
    );
  }
};
