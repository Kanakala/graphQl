import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
            <Col span={8} />
            <Col span={2}>
              <Button onClick={onCancel} type="primary">
                Cancel
              </Button>
            </Col>
            <Col span={2}>
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

export class EditEmployee extends Component {
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
        <Mutation
          mutation={EDIT_EMPLOYEE}
          errorPolicy="all"
          update={() => {
            console.log('editEmployeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
          }}
          notifyOnNetworkStatusChange={true}
          onError={error => {
            console.log(
              'errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
              error
            );
          }}
        >
          {(editEmployee, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;

            return (
              <div>
                <CollectionEditForm
                  wrappedComponentRef={this.saveFormRef}
                  onCancel={this.handleCancel}
                  employee={this.props.data.data.getEmployee}
                  onEdit={e => {
                    this.handleEdit(e, editEmployee);
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
