import React, { Component } from 'react';

import { Container, Col, Row } from 'react-bootstrap';

import DocumentControls from './DocumentControls';

class Document extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
  }
  render() {
    return <Container fluid={true}>
      <Row>
        <Col xs={9} id="page">
          <Container>
            <div id="header">
              <Row>
                <Col xs={6}>
                  Header
                </Col>
              </Row>
            </div>
            <div id="content">

            </div>
            <div id="footer">

            </div>
          </Container>
        </Col>
        <Col xs={3}>
          <DocumentControls document={this} />
        </Col>
      </Row>
    </Container>;
  }
}

export default Document;