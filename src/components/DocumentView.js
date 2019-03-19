import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Container, Row, Col} from 'react-bootstrap';
import {Button, InputGroup, Form, FormControl, ButtonGroup, Modal, Fade} from 'react-bootstrap';

import * as actions from '../actions/DocumentActions';
import locale from '../locales';

import DocumentControls from './DocumentControls';
import './DocumentControls.css';
import './DocumentView.css';

class DocumentView extends Component {
  constructor(props) {
    super(props);

    this.onDialogShow = this.onDialogShow.bind(this);
    this.onDialogHide = this.onDialogHide.bind(this);
    this.isDialogVisible = this.isDialogVisible.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);

    this.onSidebarHide = this.onSidebarHide.bind(this);
    this.onSidebarToggle = this.onSidebarToggle.bind(this);
    this.isSidebarVisible = this.isSidebarVisible.bind(this);

    this.getContent = this.getContent.bind(this);
    this.getTitle = this.getTitle.bind(this);

    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.GLOBAL_LANGUAGE !== nextProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(nextProps.GLOBAL_LANGUAGE);
    }
  }

  getTitle() {
    if (this.isDialogVisible()) {
      return this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_DIALOG_TITLE, this.props['EDITOR_DIALOG']));
    }

    return null;
  }

  getContent() {
    if (this.isDialogVisible()) {
      switch (this.props['EDITOR_DIALOG']) {
        case 'profile_pic': {
          return <Form>
            <Form.Group controlId="bioGroup">
              <Form.Label>Allowed file image (*.bmp, *.jpg, *.png)</Form.Label>
              <Form.Control type="file"/>
            </Form.Group>
          </Form>;
        }
        case 'bio': {
          return <Form>
            <Form.Group controlId="bioGroup">
              <Form.Label>Provide a short description of yourself</Form.Label>
              <Form.Control as="textarea" rows="5"/>
            </Form.Group>
          </Form>;
        }
        case 'experience': {
          return <Form>
            <Form.Row>
              <Col>
                <Form.Row>
                  <Col xs={3}>
                    <Form.Group controlId="startDateGroup">
                      <Form.Label>Start date</Form.Label>
                      <Form.Control type="date"/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="typeGroup">
                      <Form.Label>Experience type</Form.Label>
                      <Form.Control as="select">
                        <option>Work experience</option>
                        <option>Other experience</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col xs={3}>
                    <Form.Group controlId="endDateGroup">
                      <Form.Label>End date</Form.Label>
                      <Form.Control type="date"/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="employerGroup">
                      <Form.Label>Employer</Form.Label>
                      <Form.Control/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="titleGroup">
                      <Form.Label>Title</Form.Label>
                      <Form.Control/>
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
              <Col xs={1} className="align-self-center">
                <Button variant="primary">Add</Button>
              </Col>
            </Form.Row>
          </Form>;
        }
        case 'education': {
          return <Form>
            <Form.Row>
              <Col>
                <Form.Row>
                  <Col xs={3}>
                    <Form.Group controlId="startDateGroup">
                      <Form.Label>Start date</Form.Label>
                      <Form.Control type="date"/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="typeGroup">
                      <Form.Label>Experience type</Form.Label>
                      <Form.Control as="select">
                        <option>Course</option>
                        <option>Degree</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col xs={3}>
                    <Form.Group controlId="endDateGroup">
                      <Form.Label>End date</Form.Label>
                      <Form.Control type="date"/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="employerGroup">
                      <Form.Label>School</Form.Label>
                      <Form.Control/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="titleGroup">
                      <Form.Label>Field</Form.Label>
                      <Form.Control/>
                    </Form.Group>
                  </Col>
                </Form.Row>
              </Col>
              <Col xs={1} className="align-self-center">
                <Button variant="primary">Add</Button>
              </Col>
            </Form.Row>
          </Form>;
        }
      }
    }

    return <p>{this.getLocalizedString(locale.EDITOR_DIALOG_EMPTY)}</p>;
  }

  onDialogShow(type) {
    // Load data based on type
    return () => this.props.dispatch(actions.updateDialog(type));
  }

  onSaveChanges() {
    // Save changes
    this.onDialogHide();
  }

  onDialogHide() {
    this.props.dispatch(actions.updateDialog(null));
  }

  isDialogVisible() {
    return typeof this.props['EDITOR_DIALOG'] === 'string';
  }

  onSidebarToggle() {
    this.props.dispatch(actions.toggleSidebar(!this.isSidebarVisible()));
  }

  onSidebarHide() {
    this.props.dispatch(actions.toggleSidebar(null));
  }

  isSidebarVisible(setupCheck) {
    const prop = this.props['EDITOR_SIDEBAR'];
    return setupCheck ? prop === null || prop === undefined : prop;
  }

  render() {
    return (
      <>
        <Container fluid={true} id="editor">
          <Row>
            <Col xs={this.isSidebarVisible(true) ? 12 : 9}>
              <Container id="page">
                <div id="header">
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_FIRST_NAME)}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_LAST_NAME)}/>
                      </InputGroup>
                    </Col>
                    <Col xs={4} className="title">
                      Resume
                    </Col>
                    <Col xs={2} className="text-right">
                      <Button variant="secondary" className="fa fa-cog" onClick={this.onSidebarToggle}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_ADDRESS)}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_ZIP_CODE)}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_CITY)}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_EMAIL)}/>
                      </InputGroup>
                    </Col>
                    <Col xs={7} id="date">
                      DD/MM/YYYY
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedString(locale.EDITOR_FIELD_PHONE)}/>
                      </InputGroup>
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('profile_pic')}>Add Profile
                        picture...</Button>
                    </Col>
                  </Row>
                </div>
                <div id="content">
                  <Row>
                    <Col xs={11}>
                      <Button variant="primary" block onClick={this.onDialogShow('bio')}>Add Biography...</Button>
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
                      <Button variant="primary" block onClick={this.onDialogShow('experience')}>Add
                        Experiences...</Button>
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
                      <Button variant="primary" block onClick={this.onDialogShow('education')}>Add Courses or
                        Educations...</Button>
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
                      <Button variant="primary" block onClick={this.onDialogShow('achievements')}>Add Achievements or
                        Projects...</Button>
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
                      <Button variant="primary" block onClick={this.onDialogShow('titles')}>Add Titles or
                        Degrees...</Button>
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
                      <Button variant="primary" block onClick={this.onDialogShow('misc')}>Add Licence...</Button>
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
                      <Button variant="primary" block onClick={this.onDialogShow('references')}>Add
                        References...</Button>
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
            <Fade in={this.isSidebarVisible()} onExited={this.onSidebarHide} mountOnEnter={true} unmountOnExit={true}>
              <Col xs={3} id="controls">
                <DocumentControls props={this.props} onHide={this.onSidebarToggle}/>
              </Col>
            </Fade>
          </Row>
        </Container>
        <Modal size="lg" show={this.isDialogVisible()} centered onHide={this.onDialogHide}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getTitle()}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.getContent()}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary"
                    onClick={this.onDialogHide}>{this.getLocalizedString(locale.GLOBAL_CLOSE)}</Button>
            <Button variant="primary"
                    onClick={this.onSaveChanges}>{this.getLocalizedString(locale.GLOBAL_SAVE_CHANGES)}</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default connect(data => data.Document)(DocumentView);
