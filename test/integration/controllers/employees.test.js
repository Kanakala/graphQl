/* eslint-disable no-unused-vars */

//During the test the env variable is set to test
process.env.NODE_ENV = 'test'; //Just being safe.

//Require the dev-dependencies
global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = require('../../../src/index.js');
global.should = chai.should();
global.testHelper = require('../../test-helper');

const url = `http://localhost:4000`;
const request = require('supertest')(url);

chai.use(chaiHttp);

const mongoUnit = require('mongo-unit');
const expect = require('chai').expect;
const mongoose = require('mongoose');
// const testMongoUrl = process.env.TEST_MONGO_URL;
// const testData = require('../../fixtures/notes.json');

describe('Get Employees', () => {
  // this timeout is for giving the kafka to connect

  before(done => {
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should throw error', done => {
    request
      .post('/graphql')
      .send({
        query:
          '{\n  getEmployees() {\n    employeesWithTimeSheets {\n      username\n      email\n      age\n      department\n    }\n    totalCount\n  }\n}',
        variables: null,
        operationName: null
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.body.errors[0].should.be.an
          .instanceOf(Object)
          .and.have.keys('message', 'locations');

        done();
      });
  });

  it('should allow to get all employees', done => {
    request
      .post('/graphql')
      .send({
        query:
          '{\n  getEmployees(fromDate:"2018-01-01",toDate:"2019-02-01") {\n    employeesWithTimeSheets {\n      username\n      email\n      age\n      department\n      TimeSheets {\n        date\n      }\n    }\n    totalCount\n  }\n}',
        variables: null,
        operationName: null
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.body.data.getEmployees.should.be.an
          .instanceOf(Object)
          .and.have.keys('employeesWithTimeSheets', 'totalCount');

        res.body.data.getEmployees.totalCount.should.be.eql(1);

        res.body.data.getEmployees.employeesWithTimeSheets[0].should.be.an
          .instanceOf(Object)
          .and.have.keys(
            'username',
            'email',
            'age',
            'department',
            'TimeSheets'
          );

        res.body.data.getEmployees.employeesWithTimeSheets[0].TimeSheets[0].should.be.an
          .instanceOf(Object)
          .and.have.keys('date');

        done();
      });
  });
});
