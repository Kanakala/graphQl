const { Kind } = require('graphql/language');
const { GraphQLScalarType } = require('graphql');
const moment = require('moment');

function serialize(value) {
  const parsedDate = moment(value).isValid()
    ? moment(value).format('YYYY-MM-DD')
    : null;
  if (parsedDate) {
    return parsedDate;
  } else {
    throw new Error('invalid date');
  }
}

function parseValue(value) {
  const parsedDate = moment(value).isValid()
    ? moment(value).format('YYYY-MM-DD')
    : null;
  if (parsedDate) {
    return parsedDate;
  } else {
    throw new Error('invalid date');
  }
}

function parseLiteral(ast) {
  return ast.kind === Kind.STRING ? parseValue(ast.value) : null;
}

export default new GraphQLScalarType({
  name: 'ISODate',
  description: 'Moment Date object as an ISO timestamp',
  serialize,
  parseValue,
  parseLiteral
});
