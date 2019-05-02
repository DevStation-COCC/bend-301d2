'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

/********************************************************************************
Configure Server
********************************************************************************/
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

/********************************************************************************
Database Config
********************************************************************************/
// 1. Create a client with connection url
const client = new pg.Client(process.env.PG_CONNECTION_URL);

// 2. Connect client
client.connect();

// 3. Add event listeners
client.on('err', err => console.error(err));

/********************************************************************************
Helper Functions
********************************************************************************/
let lookup = (handler) => {
  const SQL = `SELECT * FROM ${handler.tableName} WHERE location_id=$1`;

  return client.query(SQL, [handler.location.id])
    .then(result => {
      if(result.rowCount > 0){
        handler.cacheHit(result);
      }else{
        handler.cacheMiss();
      }
    })
    .catch(handleError);
};

let deleteByLocationId = (table, location_id) => {
  const SQL = `DELETE FROM ${table} WHERE location_id=${location_id}`;

  return client.query(SQL);
};

const timeouts = {
  weather: 15 * 1000,
};

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

Location.tableName = 'locations';

// Static function
Location.fetchLocation = (query) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(result => {
      if(!result.body.results.length) throw 'No data';
      let location = new Location(query, result.body.results[0]);
      return location.save()
        .then(result => {
          location.id = result.rows[0].id;
          return location;
        });
    });
};

Location.lookup = handler => {
  const SQL = `SELECT * FROM locations WHERE search_query=$1;`;
  const values = [handler.query];

  return client.query(SQL, values)
    .then(results => {
      if(results.rowCount > 0) {
        handler.cacheHit(results);
      }else{
        handler.cacheMiss();
      }
    })
    .catch(console.error);
};

Location.prototype.save = function(){
  let SQL = `INSERT INTO locations 
    (search_query, formatted_query, latitude, longitude)
    VALUES ($1, $2, $3, $4)
    RETURNING id;`;

  let values = Object.values(this);

  return client.query(SQL, values);
};

function Weather(day){
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.created_at = Date.now();
}

Weather.tableName = 'weathers';
Weather.lookup = lookup;
Weather.deleteByLocationId = deleteByLocationId;

Weather.prototype.save = function(id){
  const SQL = `INSERT INTO weathers (forecast, time, created_at, location_id) VALUES ($1, $2, $3, $4);`;

  const values = Object.values(this);
  values.push(id);
  // const values = [this.forecast, this.time, this.created_at, id];

  return client.query(SQL, values);
};

// Weather.lookup = (handler) => {
//   const SQL = `SELECT * FROM weathers WHERE location_id=$1`;

//   return client.query(SQL, [handler.location.id])
//     .then(result => {
//       if(result.rowCount > 0){
//         handler.cacheHit(result);
//       }else{
//         handler.cacheMiss();
//       }
//     })
//     .catch(handleError);
// };

Weather.fetch = (location) => {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${location.latitude},${location.longitude}`;

  return superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        const summary = new Weather(day);
        summary.save(location.id);
        return summary;
      });

      return weatherSummaries;
    });
};

/********************************************************************************
Route Callbacks
********************************************************************************/
let getLocation = (request, response) => {
  const locationHandler = {
    query: request.query.data,
    cacheHit: results => {
      console.log('Got location from DB');
      response.send(results.rows[0]);
    },
    cacheMiss: () => {
      console.log('Fetching location...');
      Location.fetchLocation(request.query.data)
        .then(results => response.send(results));
    }
  };

  Location.lookup(locationHandler);
};

let getWeather = (request, response) => {
  const weatherHandler = {
    location: request.query.data,
    tableName: Weather.tableName,
    // cacheHit: (result) => response.send(result.rows),

    cacheHit: function(result){
      let ageOfResults = (Date.now() - result.rows[0].created_at);
      if(ageOfResults > timeouts.weather){
        console.log('weather cache invlid');
        Weather.deleteByLocationId(Weather.tableName, request.query.data.id);
        this.cacheMiss();
      }else{
        console.log('weather cache valid');
        response.send(result.rows);
      }
    },

    cacheMiss: () => {
      console.log('Featching weather...');
      Weather.fetch(request.query.data)
        .then(results => response.send(results))
        .catch(console.error);
    }
  };

  Weather.lookup(weatherHandler);
};

/********************************************************************************
Routes
********************************************************************************/
app.get('/location', getLocation);
app.get('/weather', getWeather);

/********************************************************************************
POWER ON
********************************************************************************/
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
