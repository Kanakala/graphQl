import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, TimePicker, Popover, Icon } from 'antd';
import gql from 'graphql-tag';
import { Mutation, ApolloConsumer } from 'react-apollo';
import moment from 'moment';

const timeFormat = 'HH:mm';

const CollectionEditForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onEdit, form } = this.props;
      const { getFieldDecorator } = form;
      const { title, start, end, taskDesc } = this.props.timesheet;
      return (
        <Modal
          visible={visible}
          title="edit the timesheet"
          okText="Update"
          onCancel={onCancel}
          onOk={onEdit}
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
                    ],
                    initialValue: title
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
                    initialValue: moment(start, timeFormat)
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
                    initialValue: moment(end, timeFormat)
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
                ],
                initialValue: taskDesc
              })(<Input type="textarea" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

const EDIT_TIMESHEET = gql`
  mutation EditTimeSheet(
    $_id: ID!
    $date: ISODate!
    $start: ISOTime!
    $end: ISOTime!
    $title: String
    $taskDesc: String
  ) {
    editTimeSheet(
      _id: $_id
      date: $date
      start: $start
      end: $end
      title: $title
      taskDesc: $taskDesc
    ) {
      _id
      start
      end
      date
      title
      taskDesc
      employee {
        _id
      }
    }
  }
`;

const GET_TIMESHEET_BY_ID = gql`
  query GetTimeSheetById($_id: ID!) {
    getTimeSheetById(_id: $_id) {
      _id
      start
      end
      date
      title
      taskDesc
      employee {
        _id
      }
    }
  }
`;

export class EditTimeSheet extends Component {
  state = {
    visible: false,
    timesheet: null
  };

  showModalAndGetValues = async client => {
    const timeSheetData = await client.query({
      query: GET_TIMESHEET_BY_ID,
      variables: { _id: this.props._id }
    });

    this.setState({ timesheet: timeSheetData.data.getTimeSheetById });
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleEdit = (e, editTimeSheet) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return err;
      }
      const date = this.props.date;
      const _id = this.props._id;
      let { start, end, title, taskDesc } = values;
      start = moment(start).format('HH:mm');
      end = moment(end).format('HH:mm');

      editTimeSheet({
        variables: { _id, date, start, end, title, taskDesc }
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
        <ApolloConsumer>
          {client => (
            <Popover title="Edit TimeSheet" trigger="hover">
              <Icon
                type="edit"
                style={{ fontSize: 16, color: '#08c', marginRight: 10 }}
                onClick={() => {
                  this.showModalAndGetValues(client);
                }}
              />
            </Popover>
          )}
        </ApolloConsumer>
        <Mutation
          mutation={EDIT_TIMESHEET}
          onError={error => {
            console.log(
              'erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
              error
            );
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
          {(editTimeSheet, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;
            return (
              <div>
                {this.state.visible && (
                  <CollectionEditForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    timesheet={this.state.timesheet}
                    onEdit={e => {
                      this.handleEdit(e, editTimeSheet, error);
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

export default EditTimeSheet;
