import { Composer } from 'telegraf';
import { addUser, Btns, amount, players,  users } from '../index.js';

const commands = new Composer();

// отправляет сообщение с выбором колличества знаков числа
let choice = (ctx) => {
    try {
        ctx.reply('Выберай сколько знаков числа ты будешь запоминать', {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [new Btns('3', 3), new Btns('4', 4), new Btns('5', 5)],
                    [new Btns('6', 6), new Btns('7', 7), new Btns('8', 8)]
                ]
            })
        })
    } catch(err) {
        console.error(err);
    }
}

// Проверяем былали выполнена команда старт (другой стикер CAACAgIAAxkBAAID4WL_aJSGa_Vr2E4_eWlElp-ynwTgAAKfAQACZf-SCjTjjy3AnExtKQQ)
let ifStart = (ctx) => {
    try {
        if (users[ctx.from.id] === undefined) {
            ctx.replyWithSticker('CAACAgIAAxkBAAIeS2MDeGeawJGIstPPUEBCr7G_q6tvAAJUAAMjWc4Mydc_HH5I4ocpBA')
            .then(() => {
                ctx.reply('Сначала команда старт!');
            })
            return false;
        } else {
            return true;
        }
    } catch(err) {
        console.error(err);
    }
}

//  Проверяем наличие имени и фамилии
let first_name = (ctx) => ctx.from.first_name ? ctx.from.first_name : ctx.from.first_name = " ";
let last_name = (ctx) => ctx.from.last_name ? ctx.from.last_name : ctx.from.last_name = " ";

// Обработка команды старт
commands.start(ctx => {
    try {
        ctx.replyWithPhoto({ source: 'logo.jpg' }, { caption: 'Смотри и запоминай!!!' })
        .then(() => {
            choice(ctx);
            // Создаем участника (если его нет)
            addUser(ctx.from.id, ctx.from.first_name);
            players.push(`${first_name(ctx)} ${last_name(ctx)}, ${ctx.from.username}, ${ctx.from.id}:`);
        })
    } catch(err) {
        console.error(err);
    }
});

//Выбор колличества знаков числа
commands.command('choise', (ctx) => {
    try {
        if (ifStart(ctx)) {
            choice(ctx);
        } else {
            return;
        }
    } catch(err) {
        console.error(err);
    }
});
    
// Отправляет сообщение с выбором времени показа числа
commands.command('time', (ctx) => {
    try {
        if (ifStart(ctx)) {
            // Стикер с параметрами CAACAgIAAxkBAAICaWL-THLy4l3f4ZFkbESb8JAEDE9eAAIeDQACF3oKAAHSw51yX6m0HCkE
            ctx.telegram.sendAnimation(ctx.from.id, 'CAACAgIAAxkBAAIeTWMEocDPfpoFNfDNAi3u_ES5T--OAAJDAAMjWc4MnVXkpOP_4c8pBA')
            .then(() => {
                ctx.telegram.sendMessage(ctx.from.id, 'Выбери сколько секунд будет отображатся число', {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [new Btns('1', '01'), new Btns('2', '02'), new Btns('3', '03')],
                            [new Btns('4', '04'), new Btns('5', '05'), new Btns('6', '06')]
                        ]
                    })
                })
            })
        } else {
            return;
        }
    } catch(err) {
        console.error(err);
    }
});

//Показывает рекорд
commands.command('record', (ctx) => {
    try {
        if (ifStart(ctx)) {
            ctx.telegram.sendMessage(ctx.from.id, `Твой личный рекорд правильных ответов подряд: ${users[ctx.from.id].record}`);
        } else {
            return;
        }
    } catch(err) {
        console.error(err);
    }
});

//Показывает достижения
commands.command('achievements', (ctx) => {
    try {
        let arr = Object.keys(users);
        arr.sort((a, b) => b - a);
        for (let value of arr) {
            ctx.telegram.sendMessage(ctx.from.id, `${users[value].userName} рекорд: ${users[value].record}`);
        };
    } catch(err) {
        console.error(err);
    }
});
    
//Показывает колличество участниковa
commands.command('users', (ctx) => {
    try {
        if (!users[ctx.from.id]) {
            addUser(ctx.from.id, ctx.from.first_name);
        } 
        ctx.telegram.sendMessage(ctx.from.id, `Игроков ${amount},  ${players}`);
    } catch (err) {
        console.error(err);
    }
});

export { commands, ifStart }