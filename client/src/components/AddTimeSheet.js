import React, { Component } from 'react';
import { Button, Form, Input, Row, Col, TimePicker } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import moment from 'moment';

const timeFormat = 'HH:mm';

const CollectionCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
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
          <Row>
            <Col span={8} />
            <Col span={2}>
              <Button onClick={onCancel} type="primary">
                Cancel
              </Button>
            </Col>
            <Col span={2}>
              <Button onClick={onCreate} type="primary">
                Create
              </Button>
            </Col>
          </Row>
        </Form>
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

export class AddTimeSheet extends Component {
  handleCancel = () => {
    this.props.showList();
  };

  handleCreate = (e, addTimeSheet) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return err;
      }
      const date = this.props.data.currentDate;
      const employee = this.props.data.employeeId;
      let { start, end, title, taskDesc } = values;
      start = moment(start).format('HH:mm');
      end = moment(end).format('HH:mm');

      addTimeSheet({
        variables: { employee, date, start, end, title, taskDesc }
      });
      form.resetFields();
      this.props.showList();
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Mutation
          mutation={ADD_TIMESHEET}
          onError={error => {
            if (
              error &&
              error.toString() &&
              error
                .toString()
                .includes(
                  'a timesheet exist already between the start and end time of the given date under the employee, please select different values'
                )
            ) {
              alert(
                'a timesheet exist already between the start and end time of the given date under the employee, please select different values'
              );
            }
          }}
        >
          {(addTimeSheet, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;
            return (
              <div>
                <CollectionCreateForm
                  wrappedComponentRef={this.saveFormRef}
                  onCancel={this.handleCancel}
                  onCreate={e => {
                    this.handleCreate(e, addTimeSheet, error);
                  }}
                />
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default AddTimeSheet;
