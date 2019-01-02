import React, { Component } from 'react';
import { Modal, Popover, Icon } from 'antd';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const confirm = Modal.confirm;

const DELETE_TIMESHEET = gql`
  mutation DeleteTimeSheet($_id: ID!) {
    deleteTimeSheet(_id: $_id) {
      _id
    }
  }
`;

export class DeleteTimeSheet extends Component {
  state = {
    visible: false
  };

  showConfirm = (e, deleteTimeSheet) => {
    var that = this;
    confirm({
      title: 'Do you want to delete this timeSheet?',
      async onOk() {
        const _id = that.props._id;
        await deleteTimeSheet({
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
          mutation={DELETE_TIMESHEET}
          onError={error => {
            alert(error && error.toString());
          }}
        >
          {(deleteTimeSheet, { loading, error }) => {
            // if (loading) return <h4>Loading...</h4>;

            return (
              <Popover title="Delete Employee" trigger="hover">
                <Icon
                  type="delete"
                  style={{ fontSize: 16, color: '#08c', marginRight: 10 }}
                  onClick={e => {
                    this.showConfirm(e, deleteTimeSheet);
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

export default DeleteTimeSheet;
