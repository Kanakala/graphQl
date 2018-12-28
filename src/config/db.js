const mongoose = require('mongoose');
const constants = require('./constants');

mongoose.Promise = global.Promise;

mongoose.set('debug', true); // debug mode on

try {
  mongoose.connect(
    constants.DB_URL,
    {
      useMongoClient: true
    }
  );
} catch (err) {
  mongoose.createConnection(constants.DB_URL, {
    useMongoClient: true
  });
}

mongoose.connection
  .once('open', () => console.log('MongoDB is connected'))
  .on('error', e => {
    throw e;
  });
