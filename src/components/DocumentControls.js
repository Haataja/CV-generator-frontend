import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

export default class DocumentControls extends Component {
  render() {
    return (
      <Container fluid={true}>
        <Row>
          <Col xs={10}>
            <h3>Sidebar</h3>
          </Col>
          <Col xs={2} className="align-self-center">
            <Button className="fa fa-close" onClick={this.props.onHide}/>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>This is example content, but I'm not really sure if we really need this component.</p>
          </Col>
        </Row>
      </Container>
    );
  }
}
