const path = require('path');
const express = require('express');
const request = require('request');
const Promise = require('bluebird');
const moment = require('moment');

const app = express();
const requestAsync = Promise.promisify(request);

app.use(express.static('public'));

function mapWeather(dailyWeather) {
    const condition = dailyWeather.weather_state_name;
    const conditionAbbr = dailyWeather.weather_state_abbr;
    const start_date = dailyWeather.applicable_date;
    const nowTemp = Math.round(dailyWeather.the_temp);
    const minTemp = Math.round(dailyWeather.min_temp);
    const maxTemp = Math.round(dailyWeather.max_temp);
    const humidity = dailyWeather.humidity;
    const predictability = dailyWeather.predictability;

    var new_startDate= new Date(start_date);
    var date = moment(new_startDate).format('dddd, LL');

    return {
        date,
        condition,
        conditionAbbr,
        nowTemp,
        minTemp,
        maxTemp,
        humidity,
        predictability
    };
}

function transformResponse(response) {
    
    const city = response.title;
    const country  = response.parent.title;
    const list  = response.consolidated_weather.map(mapWeather);

    return {
        city,
        country,
        list
    };
}

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, credentials, accept, Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, './public', 'home.html'));
  }); 

app.get('/:term', async function(req, res) {
    const url = 'https://www.metaweather.com/api/location/' + req.params.term;
    
    try {
        const searchResponse = await requestAsync(url);
        const results        = JSON.parse(searchResponse.body);
        // console.log(transformResponse(results));
        res.send(transformResponse(results));
    } catch(e) {
        res
            .status(500)
            .send(e);
    }
});

app.get('/search/:term', async function(req, res) {
    const url = 'https://www.metaweather.com/api/location/search/?query=' + req.params.term;
    
    try {
        const searchResponse = await requestAsync(url);
        const results        = JSON.parse(searchResponse.body);
        // console.log(results);
        res.send(results);
    } catch(e) {
        res
            .status(500)
            .send(e);
    }
});

app.listen(3000, () => console.log('server started on port 3000...'));