const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "7485224158:AAGVOhM6ds7c900bDzfzZ1fP4GR8GHH4bGE";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9 а ты должен ее угадать! `);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай ", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвие" },
    { command: "/info", description: "Информация о боте и командах бота" },
    { command: "/game", description: "Игра угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(chatId, "https://sl.combot.org/pishichoso1/webp/18xf09f9180.webp");
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бота`);
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.username} `);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Вы отправили не существующую команду или запрос :(");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Вы угадали вашу цифру умничка :) ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]} `,
        againOptions
      );
    }

    bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);

    console.log(msg);
  });
};

start();
