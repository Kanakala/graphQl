import React, { Component } from 'react';
import { Modal, Button, Form, Input, Row, Col, TimePicker } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import * as _ from 'lodash';

const timeFormat = 'HH:mm';

const CollectionCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new timesheet"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Row>
              <Col span={6}>
                <Form.Item label="Title">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input a title'
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={3} />
              <Col span={6}>
                <Form.Item label="Start Time">
                  {getFieldDecorator('start', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your start time'
                      }
                    ],
                    initialValue: moment('00:00', timeFormat)
                  })(<TimePicker format={timeFormat} />)}
                </Form.Item>
              </Col>
              <Col span={3} />
              <Col span={6}>
                <Form.Item label="Start Time">
                  {getFieldDecorator('end', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your start time'
                      }
                    ],
                    initialValue: moment('00:00', timeFormat)
                  })(<TimePicker format={timeFormat} />)}
                </Form.Item>
              </Col>
              <Col span={3} />
            </Row>
            <Form.Item label="Description">
              {getFieldDecorator('taskDesc', {
                rules: [
                  {
                    message: 'Please input a description!'
                  }
                ]
              })(<Input type="textarea" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

const ADD_TIMESHEET = gql`
  mutation AddTimeSheet(
    $employee: ID!
    $date: ISODate!
    $start: ISOTime!
    $end: ISOTime!
    $title: String!
    $taskDesc: String
  ) {
    addTimeSheet(
      employee: $employee
      date: $date
      start: $start
      end: $end
      title: $title
      taskDesc: $taskDesc
    ) {
      start
      end
      date
      title
      taskDesc
    }
  }
`;

const GET_EMPLOYEES = gql`
  query GetEmployees($fromDate: ISODate!, $toDate: ISODate!) {
    getEmployees(fromDate: $fromDate, toDate: $toDate) {
      _id
      username
      email
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

export class AddTimeSheet extends Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = (e, addTimeSheet) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return err;
      }
      const date = this.props.date;
      const employee = this.props._id;
      let { start, end, title, taskDesc } = values;
      start = moment(start).format('HH:mm');
      end = moment(end).format('HH:mm');

      addTimeSheet({
        variables: { employee, date, start, end, title, taskDesc }
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add Time
        </Button>
        <Mutation
          mutation={ADD_TIMESHEET}
          update={(cache, { data: { addTimeSheet } }) => {
            const employees = cache.readQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              }
            });

            let currentEmployeeIndex = _.findIndex(employees.getEmployees, {
              _id: this.props._id
            });
            let currentEmployee = employees.getEmployees[currentEmployeeIndex];

            currentEmployee[this.props.date] =
              currentEmployee[this.props.date] || [];
            currentEmployee[this.props.date].push(addTimeSheet);
            currentEmployee.TimeSheets.push(addTimeSheet);

            employees.getEmployees.splice(
              currentEmployeeIndex,
              1,
              currentEmployee
            );

            cache.writeQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              },
              data: {
                getEmployees: employees.getEmployees
              }
            });
          }}
          onError={error => {
            if (
              error &&
              error.toString() &&
              error.toString().includes('username must be unique')
            ) {
              alert(
                'There is already another user under this username, Please try with a new name'
              );
            } else if (
              error &&
              error.toString() &&
              error.toString().includes('email must be unique')
            ) {
              alert(
                'There is already another user under this email, Please try with a new email'
              );
            }
          }}
        >
          {(addTimeSheet, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;
            return (
              <div>
                {this.state.visible && (
                  <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={e => {
                      this.handleCreate(e, addTimeSheet, error);
                    }}
                  />
                )}
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default AddTimeSheet;