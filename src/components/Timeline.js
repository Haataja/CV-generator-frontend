import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Col, Container, Row} from "react-bootstrap";
import './Timeline.css';
import Button from "react-bootstrap/Button";
import warning from "react-redux/es/utils/warning";


export class Timeline extends Component {
  constructor(props) {
    super(props);

    this.buttonClick = this.buttonClick.bind(this);
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
          <Row xs={12}>
            <Button onClick={this.buttonClick}>Show work</Button>
          </Row>
          <Row xs={12} className="button-col">
            <Button onClick={this.buttonClick}>Show education</Button>
          </Row>
          <Row xs={12} className="button-col">
            <Button onClick={this.buttonClick}>Show projects</Button>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(Timeline);