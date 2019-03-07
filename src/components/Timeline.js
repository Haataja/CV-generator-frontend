import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Col, Container, Row} from "react-bootstrap";
import './Timeline.css';
import Button from "react-bootstrap/Button";
import warning from "react-redux/es/utils/warning";


export class Timeline extends Component {
  constructor(props) {
    super(props);

    this.buttonClick.bind(this);
  }
  buttonClick(event) {
    let textContent = event.target.textContent;

    if(textContent.search("Show") === 0) {
      event.target.textContent = event.target.textContent.replace('Show', 'Hide');
    } else {
      event.target.textContent = event.target.textContent = event.target.textContent.replace('Hide','Show');
    }
  }

  render() {
    return (
      <div id="background">
        <Container id="page">
          <Col>
            <Button onClick={this.buttonClick}>Show work</Button>
          </Col>
          <Col onClick={this.buttonClick} className="button-col">
            <Button>Show education</Button>
          </Col>
          <Col onClick={this.buttonClick} className="button-col">
            <Button>Show projects</Button>
          </Col>
        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(Timeline);