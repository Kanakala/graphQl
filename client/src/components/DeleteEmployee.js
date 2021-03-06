import React, { Component } from 'react';
import { Modal, Popover, Icon } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const confirm = Modal.confirm;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($_id: ID!) {
    deleteEmployee(_id: $_id) {
      _id
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
        that.props.showList();
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
