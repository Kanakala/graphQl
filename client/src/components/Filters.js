import React, { Component } from 'react';
import { Row, Col, DatePicker } from 'antd';

export class Filters extends Component {
  state = {};

  componentDidMount() {}

  onDateChange(date, dateString) {
    this.props.handleDates(dateString);
  }
  onSearch(e) {
    console.log(e);
  }

  render() {
    return (
      <div>
        {this.props.containerData === 'LIST' && (
          <Row>
            <Col span={6} />
            <Col span={6}>
              <DatePicker onChange={this.onDateChange.bind(this)} />
            </Col>
            <Col span={6}>
              {/**<Search
              placeholder="Search an employee"
              onSearch={this.onSearch}
              style={{ width: 200 }}
            />**/}
            </Col>

            <Col span={6} />
          </Row>
        )}
      </div>
    );
  }
}

export default Filters;
