const express = require('express');
const { createServer } = require('http');
const module1 = require('./config/db');
const constants = require('./config/constants');
const middlewares = require('./config/middlewares');
const cors = require('cors');

const app = express(); // create an instance of express

// Allow cross-origin
app.use(cors());

middlewares(app);

const graphQLServer = createServer(app);

graphQLServer.listen(constants.PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`App listen on port: ${constants.PORT}`);
  }
});
