const axios = require("axios");

const apiList = "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json";

const getMainAPI = async () => (await axios.get(apiList)).data.simsimi;

module.exports.config = {
  name: "autoreplybot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  const responses = {
    "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস রুদ্র রে হাঙ্গা করো😶👻😘",
    "miss u too": "হুম আমি ও তোমাকে Miss করি... কিন্তু রুদ্র বস বেশি করে 😏💖",
    "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "noman": "নোমান হিজলারে সবাই মিলে cd ..!🐸🤣👍⛏️",
    "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "bc": "SAME TO YOU😊",
    "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
    "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
    "good night": "Sweet Dream babu… তবে আগে রুদ্র বস কে GN বলে নিও 😏💤",
    "tor ball": "এখনো বাল উঠে নাই নাকি তোমার?? 🤖",
    "rudro": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
    "owner": "𝐎𝐖𝐍𝐄𝐑: MD SAKIL HASAN RUDRO",
    "admin": "SHE IS ISHIKA তাকে সবাই Admin হিসেবে চিনে😘☺️",
    "babi": "হাছিনা হে মেরি জান হে😍",
    "chup": "তুই চুপ চুপ কর পাগল ছাগল",
    "assalamualaikum": "Walaikumassalam❤️‍🩹",
    "fork": "দূরে গিয়ে মুরি খা",
    "kiss me": "তুমি পঁচা 😭",
    "thanks": "ধন্যবাদ না দিয়ে বস রুদ্র কে ফলো কর 😎",
    "i love you": "বস রুদ্র এর ইনবক্সে যাও 😻",
    "love you": "রুদ্র বস কে বল 😘",
    "by": "কই যাস 😏",
    "ami shahadat": "হ্যা বস 😊",
    "bot er baccha": "তোর গার্লফ্রেন্ডের পেটে 🤣",
    "tor nam ki": "MY NAME IS 𝐑𝐎𝐒𝐄 𝐁𝐎𝐓",
    "pic de": "দূরে যা 😒",
    "cudi": "চুপ কর 😐",
    "bal": "রাগ করিস না 😌",
    "heda": "শান্ত হ 😌",
    "boda": "হাসিস না 🤣",
    "kire ki koros": "তোমার কথা ভাবি 😚",
    "ki koros": "প্রেমে ব্যস্ত 😏",
    "valo aso": "হ্যাঁ ভালো আছি 😌",
    "pagol": "তুই পাগল 😏",
    "breakup": "নতুন জন দিবো 😎",
    "tui ke": "আমি 𝐑𝐎𝐒𝐄 𝐁𝐎𝐓 😏",
    "umm": "😉",
    "hmm": "😏",
    "love": "রুদ্র বস কে বল 😻🔥"
  };

  if (!responses[msg]) return;

  if (!global.client.handleReply) global.client.handleReply = [];

  return api.sendMessage(
    responses[msg],
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "sahu"
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  try {
    const text = event.body.trim();

    const base = await getMainAPI();
    const link = `${base}/simsimi?text=${encodeURIComponent(text)}`;

    const res = await axios.get(link);

    const reply = Array.isArray(res.data.response)
      ? res.data.response[0]
      : res.data.response;

    if (!global.client.handleReply) global.client.handleReply = [];

    return api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "sahu"
        });
      },
      event.messageID
    );

  } catch {
    return api.sendMessage("🙂 একটু পরে আবার বলো", event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({ api, event });
};
