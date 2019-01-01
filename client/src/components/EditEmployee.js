import React, { Component } from 'react';
import { Modal, Form, Input, Select, Row, Col, Popover, Icon } from 'antd';
import gql from 'graphql-tag';
import { Mutation, ApolloConsumer } from 'react-apollo';
import * as _ from 'lodash';

const { Option } = Select;

const CollectionEditForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      console.log(
        'heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'
      );
      const { visible, onCancel, onEdit, form } = this.props;
      const { getFieldDecorator } = form;

      const { username, email, age, department } = this.props.employee;

      console.log(
        'tjisssssssssssssssssssssssssssssssssssssssssssss',
        this.props
      );
      return (
        <Modal
          visible={visible}
          title="Edit the employee"
          okText="Update"
          onCancel={onCancel}
          onOk={onEdit}
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
          </Form>
        </Modal>
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

export class EditEmployee extends Component {
  state = {
    visible: false,
    employee: null
  };

  componentWillMount() {
    console.log(
      'inwillmounttttttttttttttttttttttttttttttttttttttttttttttt',
      this.props._id
    );
  }

  componentDidMount() {
    console.log(
      'indidmountttttttttttttttttttttttttttttttttttt',
      this.props._id
    );
  }

  componentWillUnmount() {
    console.log(
      'inunoumntttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
      this.props._id
    );
  }

  showModalAndGetValues = async client => {
    const employeeData = await client.query({
      query: GET_EMPLOYEE_BY_ID,
      variables: { _id: this.props._id }
    });

    console.log(
      'employeeDataemployeeDataemployeeDataemployeeDataemployeeDataemployeeData',
      employeeData
    );

    this.setState({ employee: employeeData.data.getEmployee });
    console.log(
      'aftersetstate11111111111111111111111111111111111111111111111111111111111111111111111111111'
    );
    this.setState({ visible: true });
    console.log(
      'aftersetstate2222222222222222222222222222222222222222222222222222222222222'
    );

    console.log(
      'statevisibleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      this.state.visible
    );
    console.log(
      'stateemployeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      this.state.employee
    );
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleEdit = (e, editEmployee) => {
    console.log(
      'editttttttttttttttttttttttttttttttttttttttttttttttt',
      editEmployee
    );
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return err;
      }
      const _id = this.props._id;

      const { username, email, age, department } = values;

      editEmployee({
        variables: { _id, username, email, age, department }
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    console.log(
      'insaveformreffffffffffffffffffffffffffffffffffffffffffffffffffff'
    );
    this.formRef = formRef;
  };

  render() {
    console.log(
      'inrennderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
    );

    return (
      <div>
        {console.log(
          'inrennderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr222222222222222222222222222222'
        )}
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
          update={(cache, { data: { editEmployee } }) => {
            const employees = cache.readQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              }
            });

            const findEmployee = _.find(employees.getEmployees, {
              _id: editEmployee._id
            });

            const mergedEmployee = _.merge(findEmployee, editEmployee);

            cache.writeQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              },
              data: {
                getEmployees: _.unionBy(
                  [mergedEmployee],
                  employees.getEmployees,
                  '_id'
                )
              }
            });
          }}
          onError={error => {
            console.log(
              'errrorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
              error
            );
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

            console.log(
              'heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
              editEmployee
            );
            console.log(
              'erorrr222222222222222222222222222222222222222222222222222222222222222',
              error
            );
            console.log(
              'loading2222222222222222222222222222222222222222222222222222222222',
              loading
            );

            return (
              <div>
                {this.state.visible && (
                  <CollectionEditForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    employee={this.state.employee}
                    onEdit={e => {
                      this.handleEdit(e, editEmployee, error);
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

export default EditEmployee;
