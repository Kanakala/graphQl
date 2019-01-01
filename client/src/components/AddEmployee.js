import React, { Component } from 'react';
import { Modal, Button, Form, Input, Select, Row, Col } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import moment from 'moment';

const { Option } = Select;

const CollectionCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new employee"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Row>
              <Col span={12}>
                <Form.Item label="Username">
                  {getFieldDecorator('username', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your Username'
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={3} />
              <Col span={6}>
                <Form.Item label="Age">
                  {getFieldDecorator('age', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your Age'
                      }
                    ]
                  })(<Input type="number" />)}
                </Form.Item>
              </Col>
              <Col span={3} />
            </Row>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!'
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="Department"
              className="collection-create-form_last-form-item"
            >
              {getFieldDecorator('department', {
                initialValue: 'OPS'
              })(
                <Select>
                  <Option value="OPS">Operations</Option>
                  <Option value="FIN">Finance</Option>
                  <Option value="TECH">Technology</Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $username: String!
    $email: String!
    $age: Int
    $department: AllowedDepartment!
  ) {
    addEmployee(
      username: $username
      email: $email
      age: $age
      department: $department
    ) {
      _id
      username
      email
      TimeSheets {
        _id
        date
      }
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

export class AddEmployee extends Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = (e, addEmployee) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return err;
      }

      const { username, email, age, department } = values;

      addEmployee({
        variables: { username, email, age, department }
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
          New Employee
        </Button>
        <Mutation
          mutation={ADD_EMPLOYEE}
          update={(cache, { data: { addEmployee } }) => {
            const employees = cache.readQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              }
            });

            this.props.days.map(day => {
              addEmployee[moment(day).format('YYYY-MM-DD')] = [];
              return null;
            });

            cache.writeQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              },
              data: {
                getEmployees: employees.getEmployees.concat([addEmployee])
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
          {(addEmployee, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;
            return (
              <div>
                {this.state.visible && (
                  <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={e => {
                      this.handleCreate(e, addEmployee, error);
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

export default AddEmployee;
