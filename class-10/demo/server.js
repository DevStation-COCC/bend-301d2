'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Would crash server if not in try/catch
try{
  const foo = require('foo'); // expected output: Cannot find module 'foo'
}catch(e){
  console.error(e);
}

const PORT = 3000;
const app = express();


// create a postgres error

app.use(cors());
app.use(express.static('public'));

app.get('/reference-error', (req, res) => {

  // url is not defined so reference error thrown and caught in catch block
  superagent.get(url)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
});

app.get('/unhandledrejection', (req, res) => {
  // If we do not catch on our promise chains then any error thrown will crash the server
  // Again, we aren't trying to prevent all errors, but we need to handle all _potential_ errors with grace
  superagent.get('www.google.com')
    .then(result => {
      throw 'Ooops! Error in GET /unhandledrejection';
      res.send(result);
    });
    // .catch(e => console.error(e));
});

app.get('*', (req, res) => {
  res.status(404).send('Route does not exist');
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
