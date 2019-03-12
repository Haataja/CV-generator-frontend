import React, {Component} from 'react';
import {Container, Col, Row} from 'react-bootstrap';

import Timeline from "./TimelineView";

import './App.css';

class App extends Component {
  render() {
    return (
      <Container fluid={true}>
        <Row>
          <Col xs={12}>
            <Timeline/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
