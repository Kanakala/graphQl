const mongoose = require('mongoose');
const constants = require('./constants');

mongoose.Promise = global.Promise;

mongoose.set('debug', true); // debug mode on

const authOptions =
  process.env.NODE_ENV === 'test'
    ? {
        useMongoClient: true
      }
    : {
        useMongoClient: true,
        user: constants.MONGO_USERNAME,
        pass: constants.MONGO_PASSWORD
      };

try {
  mongoose.connect(
    constants.DB_URL,
    authOptions
  );
} catch (err) {
  mongoose.createConnection(constants.DB_URL, authOptions);
}

mongoose.connection
  .once('open', () => console.log('MongoDB is connected'))
  .on('error', e => {
    throw e;
  });
