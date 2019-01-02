module.exports = {
  PORT: process.env.PORT || 4000,
  DB_URL:
    process.env.NODE_ENV === 'test'
      ? 'mongodb://localhost/test'
      : 'mongodb://ds247674.mlab.com:47674/employee-timesheets',
  MONGO_USERNAME: 'sumanth',
  MONGO_PASSWORD: 'sumanth.123',
  GRAPHQL_PATH: '/graphql'
};
