const { Telegraf, Telegram, TelegramError } = require('telegraf')
const sqlite3 = require('sqlite3').verbose();
const { Markup } = require('telegraf')
var convert = require('xml-js')
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const token = process.env.TOKEN;



const bot = new Telegraf(token);

/**Options Para Lotto */
var optionsLotto = {
    method: 'GET',
    url: 'http://www.flalottery.com/video/en/theWinningNumber.xml',
    headers: {
        'Content-Type': 'text/xml'
    }
};

/**Options para Horoscopo */
var optionsHoroscopo = {
    method: 'GET',
    url: 'https://api.adderou.cl/tyaas',

};


/** Tratar de insertar Users 
const json_users = fs.readFileSync('users.json')
const database = JSON.parse(json_users);


bot.use((ctx, next) =>{
    if(ctx.message.text === '/start'){
        newUser = ctx.from
        function comprobarUser(user, arrayUser) {
            for (let i = 0; i < arrayUser.length; i++) {
                if (arrayUser[i].id === user.id) {
                    // console.log('Existe')
                    return;
                }
            }
            const { id, username, first_name } = newUser;
            let nUser = {
                id,
                username,
                first_name
            }
        
            database.push(nUser)
            const user_json = JSON.stringify(database)
            fs.writeFileSync('users.json', user_json)
        }
        comprobarUser(newUser, database);
    }
    next();
})




bot.command('users', ctx=>{
    ctx.reply('Activos : ' + database.length)
    //console.log(ctx.chat)
});


*/

//crear base datos
const db_name = path.join(__dirname, 'db', 'base.db');
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.log(err.message)
    } else {
        console.log('Conexion Exitosa con la base de datos')
    }
});

//Crear la Tabla
const sql_create = "CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, userID INTEGER NOT NULL UNIQUE, username VARCHAR NOT NULL, first_name VARCHAR NOT NULL)";
db.run(sql_create, err => {
    if (err) {
        return console.log(err.message)
    } else {
        console.log('Tabla Creada')
    }
})


//***Mensaje de bienvenida***/
bot.start((ctx) => {
    try {
        const sql = "INSERT INTO users(userID, username, first_name) VALUES(?,?,?)";
        if (ctx.from.username === undefined) {
            ctx.from.username = "Unknow";
        }
        const newUser = [ctx.from.id, ctx.from.username, ctx.from.first_name];
        db.run(sql, newUser, err => {
            if (err) {
                // console.log(err)
                console.log('Ya esta')
            } else {
                console.log('fue agregado')
            }
        });
        ctx.telegram.sendMessage(ctx.chat.id, "Bienvenid@ -----> " + ctx.from.first_name + "\n\nAquí Puedes Consultar Los números de Florida Lottery\n\n\n\🕹 Lottery: Aquí Puedes ver el resumen de todos los juegos de Florida Lottery\n\n\🃏 Horoscopo: Acá puedes consultar cada signo del Zodiaco.\n\n\n\🍀  Suerte: Aquí se Generará los Números de la Suerte Para Tí \n\n\⁉ ️ Ayuda:  Muestra este Mensaje 😁\n\n🎁  Donaciones: Ya tu sabes 😉\n\n\n Seleciona una Opción.........👇", {
            reply_markup: {
                keyboard: [
                    [{ text: '\🕹 Lottery' },
                    { text: '\🃏Horoscopo' }],

                    [{ text: '\🍀Suerte' },
                    { text: '\⁉️Ayuda' }],
                    [{ text: '\🎁Donaciones' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
        })

    } catch (error) {
        console.log(error)
    }


});



bot.hears('\🎁Donaciones', ctx => {

    ctx.reply('Si te ha gustado Mi Bot \n\n💸 Puedes Constribuir Conmigo:\n\n⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️\n\nBPA: \n✅ 💳: 9212 1299 7002 4735\n--------------------------------------\n💎 BTC: 3HMQQHd5Ni2XvEdszgAt1QXwQD2bwbF6jH\n--------------------------------------\n💎 LTC: MBDdVfJJPS7PMP3dMJTVsf1EdMNqBRQZ5w\n--------------------------------------\n💎 DASH: XiTwfSxfPKu5Aw65mJyP5JmUHTA7xbMqf5\n--------------------------------------\n⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️')
})


bot.hears('\⁉️Ayuda', ctx => {
    ctx.telegram.sendMessage(ctx.chat.id, "Bienvenid@ -----> " + ctx.from.first_name + "\n\nAquí Puedes Consultar Los números de Florida Lottery\n\n\n\🕹 Lottery: Aquí Puedes ver el resumen de todos los juegos de Florida Lottery\n\n\🃏 Horoscopo: Acá puedes consultar cada signo del Zodiaco.\n\n\n\🍀  Suerte: Aquí se Generará los Números de la Suerte Para Tí \n\n\⁉ ️ Ayuda:  Muestra este Mensaje 😁\n\n🎁  Donaciones: Ya tu sabes 😉\n\n\n Seleciona una Opción.........👇", {
        reply_markup: {
            keyboard: [
                [{ text: '\🕹 Lottery' },
                { text: '\🃏Horoscopo' }],

                [{ text: '\🍀Suerte' },
                { text: '\⁉️Ayuda' }],
                [{ text: '\🎁Donaciones' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    })

})

/**Numeros de la Suerte */

bot.hears('\🍀Suerte', ctx => {
    ctx.reply('\n\nEstos Números Te traerán Suerte: \n\n\n🍀  ' + numRandom(1, 100) + ' - ' + numRandom(1, 100) + ' - ' + numRandom(1, 100) + ' - ' + numRandom(1, 100) + ' - ' + numRandom(1, 100) + ' - ' + numRandom(1, 100) + ' - ' + numRandom(1, 100) + '\n\n\n\🎰 Combínalos     ')
})

function numRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)

}


/**Horoscopo */
bot.hears('\🃏Horoscopo', ctx => {
    const sql = "INSERT INTO users(userID, username, first_name) VALUES(?,?,?)";
    if (ctx.from.username === undefined) {
        ctx.from.username = "Unknow";
    }
    const newUser = [ctx.from.id, ctx.from.username, ctx.from.first_name];
    db.run(sql, newUser, err => {
        if (err) {
            // console.log(err)
            console.log('Ya existe')
        } else {
            console.log('fue agregado')
        }
    });
    ctx.telegram.sendMessage(ctx.chat.id, "\n\nSelecione su Signo....👇", {
        reply_markup: {
            keyboard: [

                [{ text: '\♈ Aries' },
                { text: '\♉ Tauro' },
                { text: '\♊ Geminis' }],

                [{ text: '\♋ Cancer' },
                { text: '\♌ Leo' },
                { text: '\♍ Virgo' }],

                [{ text: '\♎ Libra' },
                { text: '\♏ Escorpion' },
                { text: '\♐ Sagitario' }],

                [{ text: '\♑ Capricornio' },
                { text: '\♒ Acuario' },
                { text: '\♓ Piscis' }],

                [{ text: 'Atras' }]

            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    })

});

/**Aries */
bot.hears('\♈ Aries', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    // @ts-ignore
    axios.request(optionsHoroscopo).then((response) => {
        var aries = response.data.horoscopo.aries
        var fecha = response.data.titulo
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♈" + aries.nombre + "\n(" + aries.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + aries.amor + "\n\n\🏥Salud: \n" + aries.salud + "\n\n\💸 Dinero: \n" + aries.dinero + "\n\n\💢Color: " + aries.color + "\n\n\🎰 Número de la suerte: " + aries.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo Siento, revisa mas tarde')
    });
});

/**Tauro */
bot.hears('\♉ Tauro', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var tauro = response.data.horoscopo.tauro
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♉" + tauro.nombre + "\n(" + tauro.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + tauro.amor + "\n\n\🏥Salud: \n" + tauro.salud + "\n\n\💸 Dinero: \n" + tauro.dinero + "\n\n\💢Color: " + tauro.color + "\n\n\🎰 Número de la suerte: " + tauro.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Geminis */
bot.hears('\♊ Geminis', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var geminis = response.data.horoscopo.geminis
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♊" + geminis.nombre + "\n(" + geminis.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + geminis.amor + "\n\n\🏥Salud: \n" + geminis.salud + "\n\n\💸 Dinero: \n" + geminis.dinero + "\n\n\💢Color: " + geminis.color + "\n\n\🎰 Número de la suerte: " + geminis.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Cancer */
bot.hears('\♋ Cancer', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var cancer = response.data.horoscopo.cancer
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♋" + cancer.nombre + "\n(" + cancer.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + cancer.amor + "\n\n\🏥Salud: \n" + cancer.salud + "\n\n\💸 Dinero: \n" + cancer.dinero + "\n\n\💢Color: " + cancer.color + "\n\n\🎰 Número de la suerte: " + cancer.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Leo */
bot.hears('\♌ Leo', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var leo = response.data.horoscopo.leo
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♌" + leo.nombre + "\n(" + leo.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + leo.amor + "\n\n\🏥Salud: \n" + leo.salud + "\n\n\💸 Dinero: \n" + leo.dinero + "\n\n\💢Color: " + leo.color + "\n\n\🎰 Número de la suerte: " + leo.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Virgo */
bot.hears('\♍ Virgo', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var virgo = response.data.horoscopo.virgo
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♍" + virgo.nombre + "\n(" + virgo.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + virgo.amor + "\n\n\🏥Salud: \n" + virgo.salud + "\n\n\💸 Dinero: \n" + virgo.dinero + "\n\n\💢Color: " + virgo.color + "\n\n\🎰 Número de la suerte: " + virgo.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Libra */
bot.hears('\♎ Libra', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var libra = response.data.horoscopo.libra
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♎" + libra.nombre + "\n(" + libra.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + libra.amor + "\n\n\🏥Salud: \n" + libra.salud + "\n\n\💸 Dinero: \n" + libra.dinero + "\n\n\💢Color: " + libra.color + "\n\n\🎰 Número de la suerte: " + libra.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Escorpion */
bot.hears('\♏ Escorpion', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var escorpion = response.data.horoscopo.escorpion
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♏" + escorpion.nombre + "\n(" + escorpion.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + escorpion.amor + "\n\n\🏥Salud: \n" + escorpion.salud + "\n\n\💸 Dinero: \n" + escorpion.dinero + "\n\n\💢Color: " + escorpion.color + "\n\n\🎰 Número de la suerte: " + escorpion.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Sagitario */
bot.hears('\♐ Sagitario', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var sagitario = response.data.horoscopo.sagitario
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♐" + sagitario.nombre + "\n(" + sagitario.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + sagitario.amor + "\n\n\🏥Salud: \n" + sagitario.salud + "\n\n\💸 Dinero: \n" + sagitario.dinero + "\n\n\💢Color: " + sagitario.color + "\n\n\🎰 Número de la suerte: " + sagitario.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Capricornio */
bot.hears('\♑ Capricornio', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var capricornio = response.data.horoscopo.capricornio
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♑" + capricornio.nombre + "\n(" + capricornio.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + capricornio.amor + "\n\n\🏥Salud: \n" + capricornio.salud + "\n\n\💸 Dinero: \n" + capricornio.dinero + "\n\n\💢Color: " + capricornio.color + "\n\n\🎰 Número de la suerte: " + capricornio.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Acuario */
bot.hears('\♒ Acuario', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var acuario = response.data.horoscopo.acuario
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♒" + acuario.nombre + "\n(" + acuario.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + acuario.amor + "\n\n\🏥Salud: \n" + acuario.salud + "\n\n\💸 Dinero: \n" + acuario.dinero + "\n\n\💢Color: " + acuario.color + "\n\n\🎰 Número de la suerte: " + acuario.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});

/**Piscis */
bot.hears('\♓ Piscis', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsHoroscopo).then((response) => {
        var fecha = response.data.titulo
        var piscis = response.data.horoscopo.piscis
        ctx.reply("\n\📆 Fecha: " + fecha + "\n\nSigno: \♓" + piscis.nombre + "\n(" + piscis.fechaSigno + ")\n\nPredicciones para hoy: \n\n\❤Amor: \n" + piscis.amor + "\n\n\🏥Salud: \n" + piscis.salud + "\n\n\💸 Dinero: \n" + piscis.dinero + "\n\n\💢Color: " + piscis.color + "\n\n\🎰 Número de la suerte: " + piscis.numero)
    }).catch(function (error) {
        //console.log(error);
        ctx.reply('Lo siento, revisa mas tarde')
    });
});




/**MENU */
bot.hears('\🕹 Lottery', ctx => {
    ctx.telegram.sendMessage(ctx.chat.id, "\n\nSeleciona una Opción: ", {
        reply_markup: {
            keyboard: [

                [{ text: 'PICK 2' },
                { text: 'PICK 3' },
                { text: 'PICK 4' },
                { text: 'PICK 5' }],
                [{ text: 'POWERBALL' },
                { text: 'LOTTO' },
                { text: 'CASH4LIFE' }],

                [{ text: 'FANTASY 5' },
                { text: 'MEGA MILLIONS' },
                { text: 'LUCKY MONEY' }],

                [{ text: 'JACKPOT TRIPLE PLAY' }],
                [{ text: 'Atras' }]

            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    })
});


/** POWERBALL **/
bot.hears('POWERBALL', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[0]._attributes; //POWERBALL
        ctx.reply('🕑: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnumNM + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});


/** PICK 2 **/
bot.hears('PICK 2', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[7]._attributes; //PICK 2
        ctx.reply('\n\n🕹Juego: ' + consult.name + '\n\n🕑: ' + consult.midd + '\n\n🎉Números Ganadores Día:  \n\n' + '✅☀️  ' + consult.winnumm + '\n\n' + '\n\n🕑: ' + consult.eved + '\n\n🎉Números Ganadores Noche:  \n\n' + '✅🌜  ' + consult.winnume)
    }).catch(function (error) {
        console.log(error);
    });
});

/** PICK 3 **/
bot.hears('PICK 3', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[6]._attributes; //PICK 3
        ctx.reply('\n\n🕹Juego: ' + consult.name + '\n\n🕑: ' + consult.midd + '\n\n🎉Números Ganadores Día:  \n\n' + '✅☀️  ' + consult.winnumm + '\n\n' + '\n\n🕑: ' + consult.eved + '\n\n🎉Números Ganadores Noche:  \n\n' + '✅🌜  ' + consult.winnume)
    }).catch(function (error) {
        console.log(error);
    });
});

/** PICK 4 **/
bot.hears('PICK 4', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[5]._attributes; //PICK 4
        ctx.reply('\n\n🕹Juego: ' + consult.name + '\n\n🕑: ' + consult.midd + '\n\n🎉Números Ganadores Día:  \n\n' + '✅☀️  ' + consult.winnumm + '\n\n' + '\n\n🕑: ' + consult.eved + '\n\n🎉Números Ganadores Noche:  \n\n' + '✅🌜  ' + consult.winnume)
    }).catch(function (error) {
        console.log(error);
    });
});


/** PICK 5 **/
bot.hears('PICK 5', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[4]._attributes; //PICK 5
        ctx.reply('\n\n🕹Juego: ' + consult.name + '\n\n🕑: ' + consult.midd + '\n\n🎉Números Ganadores Día:  \n\n' + '✅☀️  ' + consult.winnumm + '\n\n' + '\n\n🕑: ' + consult.eved + '\n\n🎉Números Ganadores Noche:  \n\n' + '✅🌜  ' + consult.winnume)
    }).catch(function (error) {
        console.log(error);
    });
});


/** LOTTO **/
bot.hears('LOTTO', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[1]._attributes; //PICK 5
        ctx.reply('🕑 Fecha: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnum + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});


/**JACKPOT TRIPLE PLAY**/
bot.hears('JACKPOT TRIPLE PLAY', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[2]._attributes; //PICK 5
        ctx.reply('🕑 Fecha: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnum + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});


/**FANTASY 5 */
bot.hears('FANTASY 5', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[3]._attributes; //PICK 5
        ctx.reply('🕑 Fecha: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnum + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});



/** MEGA MILLIONS*** */
bot.hears('MEGA MILLIONS', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[8]._attributes; //PICK 5
        ctx.reply('🕑 Fecha: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnum + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});



/**LUCKY MONEY */
bot.hears('LUCKY MONEY', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        //console.log(response.data)
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[9]._attributes;
        ctx.reply('🕑 Fecha: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnum + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});


/**CASH4LIFE */
bot.hears('CASH4LIFE', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    axios.request(optionsLotto).then((response) => {
        var xml = response.data;
        var result = convert.xml2js(xml, { compact: true, spaces: 4 });
        var consult = result.rss.channel.item[10]._attributes;
        ctx.reply('🕑 Fecha: ' + consult.windd + '\n\nJuego: ' + consult.name + '\n\n🎉Números Ganadores:  \n\n' + '✅  ' + consult.winnum + '\n\n')
    }).catch(function (error) {
        console.log(error);
    });
});





bot.hears('Atras', ctx => {
    const sql = "INSERT INTO users(userID, username, first_name) VALUES(?,?,?)";
    if (ctx.from.username === undefined) {
        ctx.from.username = "Unknow";
    }
    const newUser = [ctx.from.id, ctx.from.username, ctx.from.first_name];
    db.run(sql, newUser, err => {
        if (err) {
            // console.log(err)
            console.log('Ya existe')
        } else {
            console.log('fue agregado')
        }
    });
    ctx.telegram.sendMessage(ctx.chat.id, "\n\nSeleciona una Opción: \n", {
        reply_markup: {
            keyboard: [
                [{ text: '\🕹 Lottery' },
                { text: '\🃏Horoscopo' }],

                [{ text: '\🍀Suerte' },
                { text: '\⁉️Ayuda' }],
                [{ text: '\🎁Donaciones' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    })
})

/**Contar users */
bot.command('members', ctx => {

    const sql = "SELECT * FROM users ORDER BY userID ";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err.message)
        } else {
            ctx.reply('Usuarios: ' + rows.length)
        }
    })
})

bot.command('username', ctx => {
    db.each("SELECT * FROM users ORDER BY username", function (err, row) {
        ctx.reply('User : ' + row.username);
    });


})

/**Enviar la baseDatos */
bot.command('db', ctx => {
    bot.telegram.sendDocument(392269177, {
        source: 'db/base.db'
    })
})


//bot.startWebhook('https://fl-lotto-bot.herokuapp.com/', null, 5000)

bot.launch();
