const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

const token = 'thisWillBeYourDiscordToken'
const weatherAPIToken = 'thisWillBeYourOpenWeatherMapToken'

async function checkWeather(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherAPIToken}&units=metric`);
    const json = await response.json();
    return json;
}

async function shouldIGoOutside() {
    const data = await checkWeather('Glasgow'); // I only check for Glasgow
    const weather = data.weather[0].main
    const weatherSpecific =  data.weather[0].description
    const temperature = data.main.temp
    let message = '';
    if (weather === 'Clouds') {
        message =  'Sure. Typical Glasgow weather, but at least no rain! '
    } else if (weather === 'Rain' || weather === 'Drizzle' || weather === 'Thuderstorm' ) {
        message =  'Hmm unsure... maybe bring an umbrella if do you head out. 🌧'
    } else if (weather === 'Snow') {
      message =  "It's snowing!! Go and make a snowman or something. "
    } else if (weather === 'Clear') {
        message =  'Oooh delightful! Go outside now! 🌞 '
    } else {
      message = "There's some strange weather out there..."
    }
    return {weather, weatherSpecific, message, temperature, json: data};
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  if (msg.content === 'should I go for a walk?') {
    const data = await shouldIGoOutside();

    msg.reply(`there's ${data.weatherSpecific} outside! ${data.message} ${data.temperature > 5 ? '' : "P.S Wrap up warm, it's cold!" }`);
  } else if (msg.content === 'is it cold outside?') {
    const data = await shouldIGoOutside();
    msg.reply(`it's ${data.temperature}c outside! `);

  } else if (msg.content === 'who is your creator?') {
    msg.reply(`all hail my overlord Ottilia`);

  } else if (msg.content === 'tell me everything about the weather please!') {
    const data = await shouldIGoOutside();
    msg.reply(data.json);
  }

});

client.login(token);
