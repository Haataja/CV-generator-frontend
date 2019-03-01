import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import './DocumentControls.css';

export default class DocumentControls extends Component {
  render() {
    return (
      <Container fluid={true} id="controls">
        <Row>
          <Col xs={12}>
            Setting value
          </Col>
        </Row>
      </Container>
    );
  }
}