import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Col, Container, Row} from "react-bootstrap";
import './Timeline.css';
import Button from "react-bootstrap/Button";


export class Timeline extends Component {
  render() {
    return (
      <div id="background">
        <Container id="page">
          <Col>
            <Button>Show work</Button>
          </Col>
          <Col className="button-col">
            <Button>Show education</Button>
          </Col>
          <Col className="button-col">
            <Button>Show projects</Button>
          </Col>
        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(Timeline);