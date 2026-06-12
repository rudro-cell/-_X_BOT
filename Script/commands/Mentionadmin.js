module.exports.config = {
  name: "adminmention",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "RUDRO",
  description: "Reply when admin is mentioned",
  commandCategory: "Other",
  usages: "@admin",
  cooldowns: 1
};

const adminIDs = [
  "61571107303187",
  "61589687480338",
  "61570781349488"
].map(String);

module.exports.handleEvent = function ({ api, event }) {
  if (!event || !event.mentions) return;

  // রিপ্লাই করা মেসেজ হলে কাজ করবে না
  if (event.type === "message_reply") return;

  const mentionedIDs = Object.keys(event.mentions).map(String);

  const isMentioningAdmin = adminIDs.some(id =>
    mentionedIDs.includes(id)
  );

  if (!isMentioningAdmin) return;

  const replies = [
    "বস এখন ব্যস্ত আছে 🙂",
    "বসকে ডেকে লাভ নাই 😌",
    "রুদ্র এখন অনলাইনে নাই 💤",
    "মেসেজ পরে দিন 👀",
    "বস এখন কাজে ব্যস্ত আছে ⚡",
    "তাকে মেনশন না দিয়ে ইনবক্স করুন 😎"
  ];

  const msg = replies[Math.floor(Math.random() * replies.length)];

  return api.sendMessage(
    msg,
    event.threadID,
    event.messageID
  );
};

module.exports.run = async function () {};
