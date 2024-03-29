import 'dotenv/config';
import { Composer } from 'telegraf';
import { Telegraf } from 'telegraf';
import { commands } from './components/commands.js';
import { ok, nope } from './components/stickers.js';

const funcFile = new Composer();
const bot = new Telegraf(process.env.MBOT_TOKEN);
bot.use(commands);

// Переменные для сохранения колличества участников
let amount = 0;

// Участники
const users = {};

class User {
    constructor(fromId, userName, name) {
        this.userName = userName,
        this.name = name,
        this.user = fromId,
        this.queryData = 6, // длинна числа
        this.time = 4000, // время показа числа
        this.num = 0,
        this.msgId = 0,
        this.count = 0,
        this.record = 0,
        this.watched = false // Подсмотрен ли ответ
    }

    // Записывает рекорд
    setRecord() {
        try {
            this.record < this.count ? this.record = this.count : false;
        } catch(err) {
            console.error(err);
        }
    }

    // Отправляет участнику рандомное число, затем прячет его
    msg(ctx) {
        try {
            this.num = this.getRandomInt();
            ctx.telegram.sendMessage(this.user, this.num)
            .then((data) => { this.msgId = data.message_id })
            .then( setTimeout(() => {
                this.watched = !this.watched;
                ctx.telegram.editMessageText( this.user, this.msgId, this.msgId, 'Жги!').then((data) => {
                ctx.telegram.editMessageReplyMarkup( this.user, this.msgId, this.msgId, JSON.stringify({
                    inline_keyboard: [
                        [new Btns('Подсмотреть', 1)]
                    ]})
                )})
            }, this.time)
        );
        } catch(err) {
            console.error(err);
        }
    }

    // Получаем рандомное число с заданным колличеством знаков
    getRandomInt() {
        try {
            let x = String(Math.floor(Math.random() * 10000000000000));
            return x.slice(0, this.queryData);
        } catch(err) {
            console.error(err);
        }
    }

    // Получаем число в соответствии с выбранным колличеством знаков
    getNunber(ctx, queryData) {
        try {
            switch(queryData) {
                case '1':
                    this.count = 0;
                    console.log(this.user, this.msgId, this.num, (!this.watched))
                    if (this.user && this.msgId && this.num && !this.watched) {
                        ctx.telegram.editMessageText(this.user, this.msgId, this.msgId, this.num);
                        this.watched = !this.watched;
                    }
                    break;
                case '3':
                    this.queryData = 3;
                    this.msg(ctx);
                    break;
                case '4':
                    this.queryData = 4;
                    this.msg(ctx);
                    break;
                case '5':
                    this.queryData = 5;
                    this.msg(ctx);
                    break;
                case '6':
                    this.queryData = 6;
                    this.msg(ctx);
                    break;
                case '7':
                    this.queryData = 7;
                    this.msg(ctx);
                    break;
                case '8':
                    this.queryData = 8;
                    this.msg(ctx);
                    break;
                case '01':
                    this.time = 1000;
                    this.msg(ctx);
                    break;
                case '02':
                    this.time = 2000;
                    this.msg(ctx);
                    break;
                case '03':
                    this.time = 3000;
                    this.msg(ctx);
                    break;
                case '04':
                    this.time = 4000;
                    this.msg(ctx);
                    break;
                case '05':
                    this.time = 5000;
                    this.msg(ctx);
                    break;
                case '06':
                    this.time = 6000;
                    this.msg(ctx);
                    break;
            }
        } catch(err) {
            console.error(err);
        }
    }
}

class Btns {
    constructor(text, key) {
        this.text = text,
        this.callback_data = key
    }
}

// Добавляем участника
let addUser = (userId, userName, name) => {
    try {
        if (!users[userId]) {
            users[userId] = new User(userId, userName, name);
            amount++;
        } else {
            return true;
        }
    }  catch(err) {
        console.error(err);
    } 
};

// Получение рандомного стикера
let arrayRandElement = function (arr) {
    try {
        let rand = Math.floor(Math.random() * arr.length);
        return arr[rand];
    }  catch(err) {
        console.error(err);
    }
};

//Ответ бота на введенное число
let botAnswer = function (ctx, txt1, txt2, arr) {
    try {
        if (ctx) {
            ctx.telegram.sendAnimation(ctx.from.id, arrayRandElement(arr))
            .then(() => {
                ctx.telegram.sendMessage(ctx.from.id, `${txt1}`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [new Btns(`${txt2}`, users[ctx.from.id].queryData)]
                        ]
                    })
                })
            })
        } else {
            addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        }
        
    }  catch(err) {
        console.error(err);
    }
};

// Вызывается при получении ботом сообщения
bot.on('message', (ctx) => {
    // Это для определения file_id стикера
    //console.log(ctx.update.message.sticker.file_id)
    try {
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        if (addUser(ctx.from.id, ctx.from.username, ctx.from.first_name) && ctx.message.text == users[ctx.from.id].num) {
            users[ctx.from.id].count++;
            users[ctx.from.id].setRecord();
            if (users[ctx.from.id].count > 0 && users[ctx.from.id].count % 5 === 0) {
                ctx.telegram.sendAnimation(ctx.from.id, 'CAACAgIAAxkBAANUYwzR45OIBUZQBV9QRfp5ohl-wp0AAkcAAyNZzgwL2iA_LBzv5SkE')
                .then(() => {
                    ctx.telegram.sendMessage(ctx.from.id, `Зачет! ${users[ctx.from.id].count} правильных ответов подряд!!!`)
                    .then(botAnswer(ctx, 'Верно!', 'Следующее', ok));
                })
            } else {
                botAnswer(ctx, 'Верно!', 'Следующее', ok);
            }
        } else {
            users[ctx.from.id].count = 0;
            botAnswer(ctx, 'Ответ не правильный, дерзай ещё раз или пропускай', 'Пропустить', nope);
        }
    } catch (err) {
        console.error(err);
    }
})

// вызывается при нажатии любой кнопки
bot.on('callback_query', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        users[ctx.from.id].getNunber(ctx, ctx.update.callback_query.data);
    } catch (err) {
        console.error(err);
    }
})

bot.launch();
export { addUser, Btns, amount, users }