import React, { Component } from 'react';
import { Row, Col } from 'antd';
import List from './List';
import AddEmployee from './AddEmployee';
import moment from 'moment';

export class Main extends Component {
  state = {
    fromDate: moment()
      .startOf('week')
      .format('YYYY-MM-DD'),
    toDate: moment()
      .endOf('week')
      .format('YYYY-MM-DD'),
    weekArray: []
  };
  componentDidMount() {
    console.log('111111111111111111111111111111111111111111111111111111111');
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
            <List
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
              weekArray={this.state.weekArray}
              days={days}
            />
          </Col>
          <Col span={4} />
        </Row>
      </div>
    );
  }
}

export default Main;
