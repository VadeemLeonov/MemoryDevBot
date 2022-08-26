import 'dotenv/config';
import { Composer } from 'telegraf';
import express from 'express';
import { Telegraf } from 'telegraf';
import { commands, ifStart } from './components/commands.js';
import { ok, nope } from './components/stickers.js';

const app = express();

const funcFile = new Composer();
const bot = new Telegraf(process.env.MBOT_TOKEN);
bot.use(commands);

// Переменные для сохранения колличества участников
let amount = 0;

// Участники
const users = {};

class User {
    constructor(fromId) {
        this.user = fromId,
        this.queryData = 'six',
        this.time = 4000,
        this.num = 1,
        this.msgId = 1
    }
};

class Btns {
    constructor(text, key) {
        this.text = text,
        this.callback_data = key
    }
}

// Проверяем есть ли у нас этот участник, возвращает id участника или undefined
/* let getUser = (userId) => {
    try {
        return users.filter( user => user.user === userId )[0];
    } catch(err) {
        console.error(err);
    }
}; */

// Добавляем участника
let addUser = (userId) => {
    try {
        if (!users[userId]) {
            users[userId] = new User(userId);
            amount++;
        }
    }  catch(err) {
        console.error(err);
    } 
};

let arrayRandElement = function (arr) {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

// Получаем рандомное число с заданным колличеством знаков
let getRandomInt = (num) => {
    let x = String(Math.floor(Math.random() * 10000000000000));
    return x.slice(0, (num));
}

// Получаем число в соответствии с выбранным колличеством знаков
let getNunber = (queryData, ctx, time) => {
    try {
        switch(queryData) {
            case '1':
                ctx.telegram.editMessageText( ctx.chat.id, users[ctx.update.callback_query.from.id].msgId, users[ctx.update.callback_query.from.id].msgId, users[ctx.update.callback_query.from.id].num);
                break;
            case '3':
                users[ctx.update.callback_query.from.id].queryData = 3;
                msg(ctx, 3, time);
                break;
            case '4':
                users[ctx.update.callback_query.from.id].queryData = 4;
                msg(ctx, 4, time);
                break;
            case '5':
                users[ctx.update.callback_query.from.id].queryData = 5;
                msg(ctx, 5, time);
                break;
            case '6':
                users[ctx.update.callback_query.from.id].queryData = 6;
                msg(ctx, 6, time);
                break;
            case '7':
                users[ctx.update.callback_query.from.id].queryData = 7;
                msg(ctx, 7, time);
                break;
            case '8':
                users[ctx.update.callback_query.from.id].queryData = 8;
                msg(ctx, 8, time);
                break;
            case '01':
                users[ctx.update.callback_query.from.id].time = 1000;
                msg(ctx, users[ctx.update.callback_query.from.id].queryData, 1000);
                break;
            case '02':
                users[ctx.update.callback_query.from.id].time = 2000;
                msg(ctx, users[ctx.update.callback_query.from.id].queryData, 2000);
                break;
            case '03':
                users[ctx.update.callback_query.from.id].time = 3000;
                msg(ctx, users[ctx.update.callback_query.from.id].queryData, 3000);
                break;
            case '04':
                users[ctx.update.callback_query.from.id].time = 4000;
                msg(ctx, users[ctx.update.callback_query.from.id].queryData, 4000);
                break;
            case '05':
                users[ctx.update.callback_query.from.id].time = 5000;
                msg(ctx, users[ctx.update.callback_query.from.id].queryData, 5000);
                break;
            case '06':
                users[ctx.update.callback_query.from.id].time = 6000;
                msg(ctx, users[ctx.update.callback_query.from.id].queryData, 6000);
                break;
        }
    }  catch(err) {
        console.error(err);
    }  
}

// Отправляет участнику рандомное число, затем прячет его
let msg = function (ctx, n, t) {
    try {
        users[ctx.from.id].num = getRandomInt(n);
        ctx.telegram.sendMessage(ctx.from.id, users[ctx.from.id].num)
        .then((data) => { users[ctx.from.id].msgId = data.message_id  })
        .then( setTimeout(() => {
                ctx.telegram.editMessageText( ctx.chat.id, users[ctx.from.id].msgId, users[ctx.from.id].msgId, 'Жги!').then((data) => {
                ctx.telegram.editMessageReplyMarkup( ctx.chat.id, users[ctx.from.id].msgId, users[ctx.from.id].msgId, JSON.stringify({
                    inline_keyboard: [
                        [new Btns('Подсмотреть', 1)]
                    ]})
                )})
            }, t)
        );
    }  catch(err) {
        console.error(err);
    }
}

// Вызывается при получении ботом сообщения
bot.on('message', (ctx) => {
    // Это для определения file_id стикера
    //console.log(ctx.update.message.sticker.file_id)
    try {
        if (ctx.message.text == users[ctx.from.id].num) {
            ctx.telegram.sendAnimation(ctx.from.id, arrayRandElement(ok))
            .then(() => {
                ctx.telegram.sendMessage(ctx.from.id, 'Верно!', {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [new Btns('Следующее', users[ctx.from.id].queryData)]
                        ]
                    })
                })
            })
        } else {
            ctx.telegram.sendAnimation(ctx.from.id, arrayRandElement(nope))
            .then(() => {
                ctx.telegram.sendMessage(ctx.from.id, 'Ответ не правильный, дерзай ещё раз или пропускай', {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [new Btns('Пропустить', users[ctx.from.id].queryData)]
                        ]
                    })
                })
            })
        }
    } catch (err) {
        console.error(err);
    }
})

// вызывается при нажатии любой кнопки
bot.on('callback_query', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        if (ifStart(ctx)) {
            getNunber(ctx.update.callback_query.data, ctx, users[ctx.from.id].time);
        } else {
            return;
        }
    } catch (err) {
        console.error(err);
    }
    
})

bot.launch();
export { addUser, Btns, amount, users }