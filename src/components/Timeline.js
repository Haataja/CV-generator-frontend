import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Col, Container, Row} from "react-bootstrap";
import './Timeline.css';
import Button from "react-bootstrap/Button";

import warning from "react-redux/es/utils/warning";

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.buttonClick.bind(this);
  }
  buttonClick(event) {
    let textContent = event.target.textContent;
//this.props.SHOW_WORK
    if(textContent.search("Show") === 0) {
      event.target.textContent = event.target.textContent.replace('Show', 'Hide');
      //this.props.dispatch(action.showWork(true));
    } else {
      event.target.textContent = event.target.textContent = event.target.textContent.replace('Hide','Show');
    }
  }

  render() {
    return (
      <div id="background">
        <Container id="page">
          <Col>
            <Button onClick={this.buttonClick} variant={this.props.Timeline.SHOW_WORK?'success':'warning'}>Show work</Button>
          </Col>
          <Col className="button-col">
            <Button onClick={this.buttonClick}>Show education</Button>
          </Col>
          <Col className="button-col">
            <Button onClick={this.buttonClick}>Show projects</Button>
          </Col>
        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(Timeline);