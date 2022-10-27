const telegramApi = require("node-telegram-bot-api");
const {gameOptions, aganeOptions} = require("./Options");// кнопки вынес в отдельный файл

const token = '5420703370:AAG33MrQsqklbDO_WKPelqNt4y2198_QlgU';
const Bot = new telegramApi(token, {polling: true});

const chats = {};

Bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие"},
    {command: "/info", description: "Получить информацию о пользователе"},
    {command: "/game", description: "Играть с ботом"},
])

const startGame = async (chatId) => {
    await Bot.sendMessage(chatId, `Я сейчас загадая цифру от 0 до 9, а  ты должен её угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await Bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}


    const start = () => {
        Bot.on("message", async msg => {
            const text = msg.text;// сохраняю сообщение пользователя
            const chatId = msg.chat.id;// сохраняю id пользователя
        
            // Bot.sendMessage(chatId, "Сообщение"); // отправлка сообщения
        
            if(text === "/start") {
                await Bot.sendMessage(chatId, `https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.jpg`);
                return await Bot.sendMessage(chatId, "Добро пожаловать в чат");
            }
            if(text === "/info") {
                return await Bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}  ${msg.from.last_name}`);
            }
            if(text === "/game") {
                return startGame(chatId);
            }
            
            await Bot.sendMessage(chatId, "Такой команды нет, список команд вы можете просмотреть в меню");
            // console.log("msg ",msg);
        })
    }

    Bot.on("callback_query", async msg=>{ 
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/reestart_game') {
            return startGame(chatId);
        }

        if(data === chats[chatId]) {
            return await Bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, aganeOptions);
        } else {
            Bot.sendMessage(chatId, `К сожалению ты не отгадал`, aganeOptions);
        }
        

    })

    start();