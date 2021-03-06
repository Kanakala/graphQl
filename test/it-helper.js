const prepare = require('mocha-prepare');
const mongoUnit = require('mongo-unit');

prepare(done => {
  mongoUnit.start().then(testMongoUrl => {
    process.env.TEST_MONGO_URL = testMongoUrl;
    done();
  });
});
