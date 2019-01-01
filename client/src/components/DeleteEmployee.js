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
  {
    getEmployees {
      username
      email
      _id
    }
  }
`;

export class DeleteEmployee extends Component {
  state = {
    visible: false
  };

  showConfirm = async (e, deleteEmployee) => {
    var that = this;
    confirm({
      title: 'Do you want to delete this employee?',
      onOk() {
        const _id = that.props._id;
        deleteEmployee({
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
            const employees = cache.readQuery({ query: GET_EMPLOYEES });

            _.remove(employees.getEmployees, {
              _id: deleteEmployee._id
            });
            cache.writeQuery({
              query: GET_EMPLOYEES,
              data: {
                getEmployees: employees.getEmployees
              }
            });
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
