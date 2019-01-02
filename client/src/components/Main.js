import React, { Component } from 'react';
import { Row, Col } from 'antd';
import List from './List';
import AddEmployee from './AddEmployee';
import AddTimeSheet from './AddTimeSheet';
import EditEmployee from './EditEmployee';
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
    data: null
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
    var startOfWeek = moment().startOf('week');
    var endOfWeek = moment().endOf('week');

    var days = [];
    var day = startOfWeek;

    while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    return (
      <div>
        <Row style={{ marginTop: 50 }}>
          <Col span={18} />
          <Col span={6}>
            <AddEmployee
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
              weekArray={this.state.weekArray}
              days={days}
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
                days={days}
                showForm={this.showForm}
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
                days={days}
                showList={this.showList}
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
