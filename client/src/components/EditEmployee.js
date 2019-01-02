import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Popover, Icon, Button } from 'antd';
import gql from 'graphql-tag';
import { Mutation, ApolloConsumer } from 'react-apollo';

const { Option } = Select;

const CollectionEditForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { onCancel, onEdit, form } = this.props;
      const { getFieldDecorator } = form;

      const { username, email, age, department } = this.props.employee;

      return (
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
                  ],
                  initialValue: username
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
                  ],
                  initialValue: age
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
              ],
              initialValue: email
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="Department"
            className="collection-create-form_last-form-item"
          >
            {getFieldDecorator('department', {
              initialValue: department
            })(
              <Select>
                <Option value="OPS">Operations</Option>
                <Option value="FIN">Finance</Option>
                <Option value="TECH">Technology</Option>
              </Select>
            )}
          </Form.Item>
          <Row>
            <Col span={6} />
            <Col span={6}>
              <Button onClick={onCancel} type="primary">
                Cancel
              </Button>
            </Col>
            <Col span={6} />
            <Col span={6}>
              <Button onClick={onEdit} type="primary">
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      );
    }
  }
);

const EDIT_EMPLOYEE = gql`
  mutation EditEmployee(
    $_id: ID!
    $username: String
    $email: String
    $age: Int
    $department: AllowedDepartment
  ) {
    editEmployee(
      _id: $_id
      username: $username
      email: $email
      age: $age
      department: $department
    ) {
      username
      email
      age
      department
      _id
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

export class EditEmployee extends Component {
  state = {
    employee: null
  };

  showModalAndGetValues = async client => {
    const employeeData = await client.query({
      query: GET_EMPLOYEE_BY_ID,
      variables: { _id: this.props._id }
    });

    this.setState({ employee: employeeData.data.getEmployee });
  };

  handleCancel = () => {
    this.props.showList();
  };

  handleEdit = (e, editEmployee) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return err;
      }
      const _id = this.props.data.data.getEmployee._id;

      const { username, email, age, department } = values;

      editEmployee({
        variables: { _id, username, email, age, department }
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
        <ApolloConsumer>
          {client => (
            <Popover title="Edit Employee" trigger="hover">
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
          mutation={EDIT_EMPLOYEE}
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
          {(editEmployee, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;

            return (
              <div>
                <CollectionEditForm
                  wrappedComponentRef={this.saveFormRef}
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                  employee={this.props.data.data.getEmployee}
                  onEdit={e => {
                    this.handleEdit(e, editEmployee, error);
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

export default EditEmployee;
