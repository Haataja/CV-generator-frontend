import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Container, Row, Col} from 'react-bootstrap';
import {Button, InputGroup, FormControl, ButtonGroup} from "react-bootstrap";

import * as actions from "../actions/DocumentActions";
import DocumentControls from "./DocumentControls";

import './Document.css';

export class DocumentView extends Component {
  render() {
    return (
      <Container fluid={true} id="editor">
        <Row>
          <Col xs={9}>
            <Container id="page">
              <div id="header">
                <Row>
                  <Col xs={5}>
                    <InputGroup size="sm">
                      <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="First name" />
                      <FormControl aria-label="Small"aria-describedby="inputGroup-sizing-sm" placeholder="Last name" />
                    </InputGroup>
                  </Col>
                  <Col xs={4} className="title">
                    Resume
                  </Col>
                  <Col xs={2}>
                    Page number
                  </Col>
                </Row>
                <Row>
                  <Col xs={5}>
                    <InputGroup size="sm">
                      <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Address" />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5}>
                    <InputGroup size="sm">
                      <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Zipcode" />
                      <FormControl aria-label="Small"aria-describedby="inputGroup-sizing-sm" placeholder="City" />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5}>
                    <InputGroup size="sm">
                      <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Email" />
                    </InputGroup>
                  </Col>
                  <Col xs={7} id="date">
                    DD/MM/YYYY
                  </Col>
                </Row>
                <Row>
                  <Col xs={5}>
                    <InputGroup size="sm">
                      <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Phone" />
                    </InputGroup>
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Profile picture...</Button>
                  </Col>
                </Row>
              </div>
              <div id="content">
                <Row>
                  <Col xs={11}>
                    <Button variant="primary" block>Add Biography...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    Abilities and Hobbies
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Abilities or Hobbies...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    Experience
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Experiences...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    Courses and Education
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Courses or Educations...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    Achievements and Projects
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Achievements or Projects...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    Titles and Degrees
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Titles or Degrees...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    Licences
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add Licence...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={5} className="align-self-center title">
                    References
                  </Col>
                  <Col xs={6}>
                    <Button variant="primary" block>Add References...</Button>
                  </Col>
                  <Col xs={1} className="align-self-center item-controls">
                    <ButtonGroup size="sm" aria-label="Item controls">
                      <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                      <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                    </ButtonGroup>
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

export default connect(data => data.Document)(DocumentView);
