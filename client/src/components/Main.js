import React, { Component } from 'react';
import { Row, Col } from 'antd';
import List from './List';
import AddEmployee from './AddEmployee';
import AddTimeSheet from './AddTimeSheet';
import EditEmployee from './EditEmployee';
import Filters from './Filters';
import moment from 'moment';

export class Main extends Component {
  state = {
    fromDate: moment()
      .startOf('week')
      .format('YYYY-MM-DD'),
    toDate: moment()
      .endOf('week')
      .format('YYYY-MM-DD'),
    weekArray: [],
    containerData: 'LIST',
    data: null,
    pagination: { current: 1, pageSize: 3 }
  };

  componentDidMount() {
    var startOfWeek = moment().startOf('week');
    var endOfWeek = moment().endOf('week');

    var days = [];
    var day = startOfWeek;

    while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    this.setState({ weekArray: days });
  }

  handleTableChange(pagination) {
    this.setState({ pagination });
  }

  handleDates(date) {
    var startOfWeek = moment(date).startOf('week');
    var endOfWeek = moment(date).endOf('week');
    var days = [];
    var day = startOfWeek;

    while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    this.setState({
      fromDate: moment(date)
        .startOf('week')
        .format('YYYY-MM-DD'),
      toDate: moment(date)
        .endOf('week')
        .format('YYYY-MM-DD'),
      weekArray: days
    });
  }

  showForm = (data, type) => {
    this.setState({
      containerData: type,
      data
    });
  };
  showList = () => {
    this.setState({
      containerData: 'LIST'
    });
  };

  render() {
    return (
      <div>
        <Row style={{ marginTop: 50 }}>
          <Col span={18}>
            <Filters
              handleDates={this.handleDates.bind(this)}
              containerData={this.state.containerData}
            />
          </Col>
          <Col span={6}>
            <AddEmployee
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
              weekArray={this.state.weekArray}
              pagination={this.state.pagination}
              containerData={this.state.containerData}
            />
          </Col>
        </Row>

        <br />
        <br />
        <Row>
          <Col span={4} />
          <Col span={16}>
            {this.state.containerData === 'LIST' ? (
              <List
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                weekArray={this.state.weekArray}
                showForm={this.showForm}
                showList={this.showList}
                handleTableChange={this.handleTableChange.bind(this)}
                pagination={this.state.pagination}
              />
            ) : this.state.containerData === 'EDITEMPLOYEE' ? (
              <EditEmployee
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                data={this.state.data}
                showList={this.showList}
              />
            ) : this.state.containerData === 'ADDTIMESHEET' ? (
              <AddTimeSheet
                data={this.state.data}
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                showList={this.showList}
                weekArray={this.state.weekArray}
              />
            ) : (
              ''
            )}
          </Col>
          <Col span={4} />
        </Row>
      </div>
    );
  }
}

export default Main;
