const { Kind } = require('graphql/language');
const { GraphQLScalarType } = require('graphql');
const moment = require('moment');

function serialize(value) {
  try {
    const parsedTime = moment.utc(value * 1000).format('HH:mm');
    return parsedTime;
  } catch (e) {
    throw new Error('invalid time');
  }
}

function parseValue(value) {
  const date = '2019-01-01T' + value; // making a valid moment date by adding a random date to the give time
  const parsedTime = moment(date).isValid()
    ? value === '00:00'
      ? 'zero'
      : moment.duration(value).asSeconds()
    : null;
  if (parsedTime) {
    return parsedTime === 'zero' ? 0 : parsedTime;
  } else {
    throw new Error('invalid time');
  }
}

function parseLiteral(ast) {
  return ast.kind === Kind.STRING ? parseValue(ast.value) : null;
}

module.exports = new GraphQLScalarType({
  name: 'ISOTime',
  description: 'Moment Time object as an ISO timestamp',
  serialize,
  parseValue,
  parseLiteral
});
