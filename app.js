const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// replace the value below with the Telegram token you receive from @BotFather
const token = '570136357:AAHjN8T1v8wWdIL9CL1_udtPbSqPy1g7dYs';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/rates/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Choose the currency you are interested in", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '€ - EUR',
            callback_data: 'EUR'
          },
          {
            text: '$ - USD',
            callback_data: 'USD'
          },
          {
            text: '₽ - RUR',
            callback_data: 'RUR'
          },
          {
            text: '₿ - BTC',
            callback_data: 'BTC'
          }
        ]
      ]
    }
  });
});


bot.on('callback_query', query => {
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
    const data = JSON.parse(body);

    const result  = data.filter(item => item.ccy === query.data)[0];

    const flag = {
      'EUR': '🇪🇺',
      'USD': '🇺🇸',
      'RUR': '🇷🇺',
      'UAH': '🇺🇦',
      'BTC': '₿'
    };
    let md = `
    *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
    Buy: ${result.buy}
    Sale: ${result.sale}
    `;

    bot.sendMessage(id, md, {parse_mode: 'Markdown'});
  })
});