import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container, Row, Col } from 'react-bootstrap';

import DocumentControls from "./DocumentControls";

export class Document extends Component {
  render() {
    return (
      <Container fluid={true} id="document">
        <Row>
          <Col xs={9}>
            <Container id="page">
              <div id="header">
                <Row>
                  <Col xs={6}>
                    Nothing
                  </Col>
                  <Col xs={4}>
                    Resume
                  </Col>
                  <Col xs={2}>
                    Page
                  </Col>
                </Row>
              </div>
              <div id="content">
                <Row>
                  <Col xs={12}>
                    Content goes here...
                  </Col>
                </Row>
              </div>
              <div id="footer">
                <Row className="text-center">
                  <Col xs={12}>
                    Footer content
                  </Col>
                </Row>
              </div>
            </Container>
          </Col>
          <Col xs={3}>
            <DocumentControls />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(data => data.Document)(Document);