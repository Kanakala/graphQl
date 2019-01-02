import React, { Component } from 'react';
import { Table, Row, Col, Popover, Icon, Button } from 'antd';
import gql from 'graphql-tag';
import { Query, ApolloConsumer } from 'react-apollo';
import DeleteEmployee from './DeleteEmployee';
import AddTimeSheet from './AddTimeSheet';
import EditTimeSheet from './EditTimeSheet';
import moment from 'moment';
import * as _ from 'lodash';

const GET_EMPLOYEES = gql`
  query GetEmployees($fromDate: ISODate!, $toDate: ISODate!) {
    getEmployees(fromDate: $fromDate, toDate: $toDate) {
      _id
      username
      email
      TimeSheets {
        _id
        date
        start
        end
        title
        taskDesc
      }
    }
  }
`;

const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployee($_id: ID!) {
    getEmployee(_id: $_id) {
      _id
      username
      email
      age
      department
      TimeSheets {
        date
        start
        end
        title
        taskDesc
      }
    }
  }
`;

export class List extends Component {
  showFormAndGetValues = async (client, employeeId) => {
    const employeeData = await client.query({
      query: GET_EMPLOYEE_BY_ID,
      variables: { _id: employeeId }
    });

    this.props.showForm(employeeData, 'EDITEMPLOYEE');
  };

  showAddTimeSheetFormAndGetValues = async (employeeId, weekDay) => {
    this.props.showForm(
      { employeeId, currentDate: moment(weekDay).format('YYYY-MM-DD') },
      'ADDTIMESHEET'
    );
  };

  render() {
    let columns = [
      {
        title: 'Employee Name',
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => (
          <Row key={record._id}>
            {record.username}
            <Col span={3}>
              <ApolloConsumer>
                {client => (
                  <Popover title="Edit Employee" trigger="hover">
                    <Icon
                      type="edit"
                      style={{ fontSize: 16, color: '#08c', marginRight: 10 }}
                      onClick={() => {
                        this.showFormAndGetValues(client, record._id);
                      }}
                    />
                  </Popover>
                )}
              </ApolloConsumer>
            </Col>
            <Col span={3}>
              <DeleteEmployee
                _id={record._id}
                fromDate={this.props.fromDate}
                toDate={this.props.toDate}
              />
            </Col>
          </Row>
        )
      }
    ];

    let weeklyColumns = this.props.weekArray.map(weekDay => {
      return {
        title: moment(weekDay).format('ddd DD/MM/YY'),
        key: moment(weekDay).format('YYYY-MM-DD'),
        render: (text, record) => {
          let dayWiseSheets = record[moment(weekDay).format('YYYY-MM-DD')];
          if (dayWiseSheets.length) {
            const content = (
              <div>
                Time Entries:
                {_.sortBy(dayWiseSheets, 'start').map(timeSheet => {
                  return (
                    <Row key={timeSheet.date + timeSheet.start}>
                      {timeSheet.start} - {timeSheet.end}
                      <Col span={3} style={{ paddingRight: 25 }}>
                        <EditTimeSheet
                          _id={timeSheet._id}
                          employee={record._id}
                          fromDate={this.props.fromDate}
                          toDate={this.props.toDate}
                          date={timeSheet.date}
                        />
                      </Col>
                    </Row>
                  );
                })}
                <br />
                <Button
                  type="primary"
                  onClick={() => {
                    this.showAddTimeSheetFormAndGetValues(record._id, weekDay);
                  }}
                >
                  Add Time
                </Button>
              </div>
            );
            dayWiseSheets = dayWiseSheets.map(timeSheet => {
              const start = moment.duration(timeSheet.start).asSeconds();
              const end = moment.duration(timeSheet.end).asSeconds();
              return { start, end, diff: end - start };
            });
            return (
              <div>
                <Popover content={content} placement="bottom">
                  <Icon
                    id="print-cursor"
                    type="ellipsis"
                    title="Actions"
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </Popover>

                {moment
                  .utc(_.sumBy(dayWiseSheets, 'diff') * 1000)
                  .format('HH:mm')}
              </div>
            );
          } else {
            const content = (
              <AddTimeSheet
                _id={record._id}
                date={moment(weekDay).format('YYYY-MM-DD')}
                fromDate={this.props.fromDate}
                toDate={this.props.toDate}
                days={this.props.days}
              />
            );
            return (
              <div>
                <Popover content={content} placement="bottom">
                  <Icon
                    id="print-cursor"
                    type="ellipsis"
                    title="Actions"
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </Popover>
                <span style={{ opacity: '0.4' }}>no data</span>
              </div>
            );
          }
        }
      };
    });

    return (
      <div>
        <Query
          query={GET_EMPLOYEES}
          variables={{
            fromDate: this.props.fromDate,
            toDate: this.props.toDate
          }}
        >
          {({ loading, error, data }) => {
            // if (loading) return <h4>Loading...</h4>;
            if (error) console.log('errorerrorerrorerrorerrorerror', error);

            if (data.getEmployees && data.getEmployees.length) {
              data.getEmployees.map((employeeData, i) => {
                const groupByDate = _.groupBy(employeeData.TimeSheets, 'date');
                Object.keys(groupByDate).map(day => {
                  data.getEmployees[i][moment(day).format('YYYY-MM-DD')] =
                    groupByDate[day];
                  return null;
                });
                this.props.days.map(day => {
                  if (!data.getEmployees[i][moment(day).format('YYYY-MM-DD')]) {
                    data.getEmployees[i][moment(day).format('YYYY-MM-DD')] = [];
                  }
                  return null;
                });
                // delete data.getEmployees[i].TimeSheets;
                return null;
              });

              return (
                <Table
                  rowKey={record => record._id}
                  columns={_.union(columns, weeklyColumns)}
                  dataSource={data.getEmployees}
                  loading={loading}
                />
              );
            } else {
              return <div>loading......</div>;
            }
          }}
        </Query>
      </div>
    );
  }
}

export default List;
