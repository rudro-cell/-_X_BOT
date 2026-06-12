module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.3",
  credits: "Rudro",
  description: "Welcome message with optional image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];

  for (const dirPath of paths) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const path = require("path");
  const { threadID } = event;

  const botPrefix = global.config.PREFIX || "/";
  const botName = global.config.BOTNAME || "𝐑𝐎𝐒𝐄 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁";

  // Bot Added
  if (
    event.logMessageData.addedParticipants.some(
      i => i.userFbId == api.getCurrentUserID()
    )
  ) {
    await api.changeNickname(
      `[ ${botPrefix} ] • ${botName}`,
      threadID,
      api.getCurrentUserID()
    );

    api.sendMessage(
      "চ্ঁলে্ঁ এ্ঁসে্ঁছি্ঁ 𝐑𝐎𝐒𝐄 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 এঁখঁনঁ তোঁমাঁদেঁরঁ সাঁথেঁ আঁড্ডাঁ দিঁবঁ..!",
      threadID,
      () => {
        const randomGifPath = path.join(
          __dirname,
          "cache",
          "randomgif"
        );

        let selected = null;

        if (fs.existsSync(randomGifPath)) {
          const allFiles = fs.readdirSync(randomGifPath).filter(file =>
            [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext =>
              file.toLowerCase().endsWith(ext)
            )
          );

          if (allFiles.length > 0) {
            selected = fs.createReadStream(
              path.join(
                randomGifPath,
                allFiles[Math.floor(Math.random() * allFiles.length)]
              )
            );
          }
        }

        const messageBody = `╭•┄┅═══❁🌺❁═══┅┄•╮
     আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯

𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐢-𝐠𝐫𝐨𝐮𝐩-🖤🤗
𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐬𝐡𝐚𝐀𝐥𝐥𝐚𝐡 🌺❤️

𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:
${botPrefix}help
${botPrefix}info
${botPrefix}admin

★ যেকোনো অভিযোগ অথবা হেল্প এর জন্য এডমিন 𝐈𝐬𝐡𝐢𝐤𝐚 কে নক করতে পারেন ★

➤𝐌𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫:
https://www.facebook.com/profile.php?id=61571107303187

➤𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩:
https://wa.me/8801617655013

❖⋆═══════════════════════⋆❖
          𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➢ 𝗥𝗨𝗗𝗥𝗢`;

        if (selected) {
          api.sendMessage(
            {
              body: messageBody,
              attachment: selected
            },
            threadID
          );
        } else {
          api.sendMessage(messageBody, threadID);
        }
      }
    );

    return;
  }

  // User Added
  try {
    const { createReadStream, readdirSync } = fs;

    const { threadName, participantIDs } =
      await api.getThreadInfo(threadID);

    const threadData =
      global.data.threadData.get(parseInt(threadID)) || {};

    let mentions = [];
    let nameArray = [];
    let memLength = [];
    let i = 0;

    for (const user of event.logMessageData.addedParticipants) {
      nameArray.push(user.fullName);

      mentions.push({
        tag: user.fullName,
        id: user.userFbId
      });

      memLength.push(participantIDs.length - i++);
    }

    memLength.sort((a, b) => a - b);

    let msg =
      typeof threadData.customJoin === "undefined"
        ? `╭•┄┅═══❁🌺❁═══┅┄•╮
     আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯

হাসি, মজা, ঠাট্টায় গড়ে উঠুক
চিরস্থায়ী বন্ধুত্বের বন্ধন।🥰

ভালোবাসা ও সম্পর্ক থাকুক আজীবন।💝

➤ আশা করি আপনি এখানে হাসি-মজা করে
আড্ডা দিতে ভালোবাসবেন।😍

➤ সবার সাথে মিলেমিশে থাকবেন।😉

➤ উস্কানিমূলক কথা বা খারাপ ব্যবহার করবেন না।🚫

➤ গ্রুপ এডমিনের কথা শুনবেন ও রুলস মেনে চলবেন।✅

›› প্রিয় {name},

আপনি এই গ্রুপের {soThanhVien} নম্বর মেম্বার!

›› গ্রুপ: {threadName}

💌 🌺 𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄 🌺 💌

╭─╼╾─╼🌸╾─╼╾───╮
   𝐑𝐎𝐒𝐄 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 🌺
╰───╼╾─╼🌸╾─╼╾─╯

❖⋆══════════════════════════⋆❖`
        : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(", "))
      .replace(/\{soThanhVien}/g, memLength.join(", "))
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(__dirname, "cache", "joinGif");

    let randomFile = null;

    if (fs.existsSync(joinGifPath)) {
      const files = readdirSync(joinGifPath).filter(file =>
        [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext =>
          file.toLowerCase().endsWith(ext)
        )
      );

      if (files.length > 0) {
        randomFile = createReadStream(
          path.join(
            joinGifPath,
            files[Math.floor(Math.random() * files.length)]
          )
        );
      }
    }

    return api.sendMessage(
      randomFile
        ? {
            body: msg,
            attachment: randomFile,
            mentions
          }
        : {
            body: msg,
            mentions
          },
      threadID
    );
  } catch (e) {
    console.error("JoinNoti Error:", e);
  }
};
