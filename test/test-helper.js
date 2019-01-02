const mongoUnit = require('mongo-unit');
const testMongoUrl = process.env.TEST_MONGO_URL;

before(async () => {
  const fs = require('fs');
  const dir = __dirname + '/fixtures';

  await fs.readdir(dir, (err, files) => {
    if (err) {
      return null;
    }
    files.forEach(file => {
      const fixture = require('./fixtures/' + file);
      mongoUnit.initDb(testMongoUrl, fixture);
    });
    return files.length;
  });
});

after(() => {
  mongoUnit.drop().then(() => {
    // done();
    process.exit();
  });
});
