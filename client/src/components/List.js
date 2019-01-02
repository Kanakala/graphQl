import React, { Component } from 'react';
import { Table, Row, Col, Popover, Icon, Button } from 'antd';
import gql from 'graphql-tag';
import { Query, ApolloConsumer } from 'react-apollo';
import DeleteEmployee from './DeleteEmployee';
import EditTimeSheet from './EditTimeSheet';
import DeleteTimeSheet from './DeleteTimeSheet';
import moment from 'moment';
import * as _ from 'lodash';

const GET_EMPLOYEES = gql`
  query GetEmployees(
    $fromDate: ISODate!
    $toDate: ISODate!
    $page: Int
    $limit: Int
  ) {
    getEmployees(
      fromDate: $fromDate
      toDate: $toDate
      page: $page
      limit: $limit
    ) {
      employeesWithTimeSheets {
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
      totalCount
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
  handleTableChange = async (pagination, filters, sorter, client) => {
    this.props.handleTableChange(pagination);
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
                showList={this.props.showList}
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
          if (dayWiseSheets && dayWiseSheets.length) {
            const content = (
              <div>
                Time Entries:
                <div style={{ marginTop: 10 }}>
                  {_.sortBy(dayWiseSheets, 'start').map(timeSheet => {
                    return (
                      <Row key={timeSheet.date + timeSheet.start}>
                        {timeSheet.start} - {timeSheet.end}
                        <Col span={3} style={{ paddingRight: 5 }}>
                          <EditTimeSheet
                            _id={timeSheet._id}
                            employee={record._id}
                            fromDate={this.props.fromDate}
                            toDate={this.props.toDate}
                            date={timeSheet.date}
                          />
                        </Col>
                        <Col span={3} style={{ paddingRight: 25 }}>
                          <DeleteTimeSheet
                            _id={timeSheet._id}
                            showList={this.props.showList}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </div>
                <br />
                <Button
                  style={{ marginLeft: 10 }}
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
              <Button
                type="primary"
                onClick={() => {
                  this.showAddTimeSheetFormAndGetValues(record._id, weekDay);
                }}
              >
                Add Time
              </Button>
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
            toDate: this.props.toDate,
            page: this.props.pagination.current,
            limit: this.props.pagination.pageSize
          }}
        >
          {({ loading, error, data, refetch }) => {
            // if (loading) return <h4>Loading...</h4>;
            if (error)
              console.log(
                'errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
                error
              );
            refetch({
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate,
                page: this.props.pagination.current,
                limit: this.props.pagination.pageSize
              }
            });

            if (
              data.getEmployees &&
              data.getEmployees.employeesWithTimeSheets &&
              data.getEmployees.employeesWithTimeSheets.length
            ) {
              data.getEmployees.employeesWithTimeSheets.map(
                (employeeData, i) => {
                  const groupByDate = _.groupBy(
                    employeeData.TimeSheets,
                    'date'
                  );
                  Object.keys(groupByDate).map(day => {
                    data.getEmployees.employeesWithTimeSheets[i][
                      moment(day).format('YYYY-MM-DD')
                    ] = groupByDate[day];
                    return null;
                  });
                  this.props.weekArray.map(day => {
                    if (
                      !data.getEmployees.employeesWithTimeSheets[i][
                        moment(day).format('YYYY-MM-DD')
                      ]
                    ) {
                      data.getEmployees.employeesWithTimeSheets[i][
                        moment(day).format('YYYY-MM-DD')
                      ] = [];
                    }
                    return null;
                  });
                  // delete data.getEmployees[i].TimeSheets;
                  return null;
                }
              );

              return (
                <ApolloConsumer>
                  {client => (
                    <Table
                      rowKey={record => record._id}
                      columns={_.union(columns, weeklyColumns)}
                      dataSource={data.getEmployees.employeesWithTimeSheets}
                      pagination={{
                        total: data.getEmployees.totalCount,
                        pageSize: 3
                      }}
                      loading={loading}
                      onChange={(pagination, filters, sorter) => {
                        this.handleTableChange(
                          pagination,
                          filters,
                          sorter,
                          client
                        );
                      }}
                    />
                  )}
                </ApolloConsumer>
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
