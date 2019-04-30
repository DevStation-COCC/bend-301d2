'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

/********************************************************************************
Configure Server
********************************************************************************/
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

/********************************************************************************
Errors
********************************************************************************/
let handleError = (err, response) => {
  console.error(err); // Might as well be a DB save...
  if(response) response.status(500).send('Internal Server Error Encountered');
};

/********************************************************************************
Constructor Functions
********************************************************************************/
function Location(query, data){
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function Weather(day){
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

/********************************************************************************
Route Callbacks
********************************************************************************/
let searchToLatLong = (request, response) => {
  const data = request.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(result => {
      response.send(new Location(data, result.body.results[0]));
    })
    .catch(error => handleError(error, response));
};

let getWeather = (request, response) => {
  const data = request.query.data;
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${data.latitude},${data.longitude}`;

  return superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        return new Weather(day);
      });

      response.send(weatherSummaries);
    })
    .catch(error => handleError(error, response));
};

/********************************************************************************
Routes
********************************************************************************/
app.get('/location', searchToLatLong);
app.get('/weather', getWeather);

/********************************************************************************
POWER ON
********************************************************************************/
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
