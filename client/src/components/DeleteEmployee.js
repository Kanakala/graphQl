import React, { Component } from 'react';
import { Modal, Popover, Icon } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import * as _ from 'lodash';

const confirm = Modal.confirm;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($_id: ID!) {
    deleteEmployee(_id: $_id) {
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

export class DeleteEmployee extends Component {
  state = {
    visible: false
  };

  showConfirm = (e, deleteEmployee) => {
    var that = this;
    confirm({
      title: 'Do you want to delete this employee?',
      async onOk() {
        const _id = that.props._id;
        await deleteEmployee({
          variables: { _id }
        });
      },
      onCancel() {}
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Mutation
          mutation={DELETE_EMPLOYEE}
          update={(cache, { data: { deleteEmployee } }) => {
            console.log(
              'deleteEmployeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              deleteEmployee
            );
            const employees = cache.readQuery({
              query: GET_EMPLOYEES,
              variables: {
                fromDate: this.props.fromDate,
                toDate: this.props.toDate
              }
            });

            console.log(
              'employeesssssssssssssssssssssssssssssssssssss11111111111111111111111111111111111111111111',
              employees
            );
            _.remove(employees.getEmployees, {
              _id: deleteEmployee._id
            });
            cache.writeQuery({
              query: GET_EMPLOYEES,
              data: {
                getEmployees: employees.getEmployees
              }
            });
            console.log(
              'employeessssssssssssssssssssssssssssssssssss2222222222222222222222222222222222222222222222222222222222',
              employees
            );
          }}
          onError={error => {
            alert(error && error.toString());
          }}
        >
          {(deleteEmployee, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;

            return (
              <Popover title="Delete Employee" trigger="hover">
                <Icon
                  type="delete"
                  style={{ fontSize: 16, color: '#08c', marginRight: 10 }}
                  onClick={e => {
                    this.showConfirm(e, deleteEmployee);
                  }}
                />
              </Popover>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default DeleteEmployee;
