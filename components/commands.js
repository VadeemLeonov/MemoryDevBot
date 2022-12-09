import { Composer } from 'telegraf';
import { addUser, Btns, amount, users } from '../index.js';

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

// Обработка команды старт
commands.start(ctx => {
    try {
        ctx.replyWithPhoto({ source: 'logo.jpg' }, { caption: 'Смотри и запоминай!!!' })
        .then(() => {
            choice(ctx);
            // Создаем участника (если его нет)
            addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        })
    } catch(err) {
        console.error(err);
    }
});

//Выбор колличества знаков числа
commands.command('choise', (ctx) => {
    try {
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        choice(ctx);
    } catch(err) {
        console.error(err);
    }
});
    
// Отправляет сообщение с выбором времени показа числа
commands.command('time', (ctx) => {
    try {
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
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
    } catch(err) {
        console.error(err);
    }
});

commands.command('help', (ctx) => {
    try {
        ctx.reply(`Замечания и пожелания по развитию игры пишите в наш бот поддержки пользователей: t.me/ExampleSupport_bot`);
    } catch(err) {
        console.error(err)
    }

});

//Показывает рекорд
commands.command('record', (ctx) => {
    try {
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        ctx.telegram.sendMessage(ctx.from.id, `Твой личный рекорд правильных ответов подряд: ${users[ctx.from.id].record}`);
    } catch(err) {
        console.error(err);
    }
});

//Показывает достижения
commands.command('achievements', (ctx) => {
    try {
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        let arr = Object.keys(users);
        let records = [];
        for (let value of arr.sort((a, b) => users[b].record - users[a].record)) {
            records.push(`
${users[value].name} рекорд: ${users[value].record}`);
        };
        ctx.telegram.sendMessage(ctx.from.id, `${records}`);
        
    } catch(err) {
        console.error(err);
    }
});
    
//Показывает колличество участников
commands.command('users', (ctx) => {
    try {
        addUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
        let arr = Object.keys(users);
        let players = [];
        for (let value of arr) {
            players.push(`
${users[value].name}: ${users[value].userName}`);
        };
        ctx.telegram.sendMessage(ctx.from.id, `Игроков ${amount}, ${players}`);
    } catch (err) {
        console.error(err);
    }
});

export { commands }