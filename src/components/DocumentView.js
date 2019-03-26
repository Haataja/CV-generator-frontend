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

    this.prepareData = this.prepareData.bind(this);
    this.getContent = this.getContent.bind(this);

    this.getProfileData = this.getProfileData.bind(this);

    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.GLOBAL_LANGUAGE !== nextProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(nextProps.GLOBAL_LANGUAGE);
    }
  }

  getContent(data) {
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
              <Form.Control as="textarea" rows="5" defaultValue={data.bio.value}/>
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

    return <p>{this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, null))}</p>;
  }

  onDialogShow(type) {
    return () => this.props.dispatch(actions.updateDialog(type));
  }

  onSaveChanges() {
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

  prepareData(key, category = null) {
    let data = this.props["GLOBAL_DATA"];

    if (data) {
      if (category !== null && data[category] !== undefined) {
        data = data[category];
      }

      if (key !== null && data[key] !== undefined) {
        return data[key];
      }
    }

    return "";
  }

  getProfileData(key, data) {
    if(data) {
      switch (key) {
        case 'courses_and_education': {
          if (data[key]) {
            let array = [];
            for(let i = 0; i < data[key].data.length; i++) {
              const temp = data[key].data[i];
              let type = temp.type === 'education';
              console.log(temp)
              // TODO CHANGE TIMESTAMP TO SECONDS
              let list = <li key={i}>
                <div><b>{type?temp.field_name:temp.course_name}</b></div>
                <div>{type?temp.school_name:temp.provider_name}</div>
                <div>Start: {new Date(temp.startdate * 1000).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                <div>End: {new Date(temp.enddate * 1000).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                <div>{temp.grade?type?"Average grade: " + temp.grade:"Grade: " + temp.grade:""}</div>
              </li>
              array.push(list)
            }

            return array;
          }
        }
      }
    }

    return <div>empty</div>
  }

  render() {
    const date = new Date();
    const data = this.props["GLOBAL_DATA"];

    const getFieldText = identifier => (
      this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_FIELD_TEXT, identifier))
    );

    const getTitle = identifier => (
      this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, identifier))
    );

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
                                     placeholder={getFieldText("first_name")}
                                     defaultValue={this.prepareData("firstname")}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={getFieldText("last_name")}
                                     defaultValue={this.prepareData("lastname")}/>
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
                                     placeholder={getFieldText("address")}
                                     defaultValue={this.prepareData("street_address", "address")}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={getFieldText("zip_code")}
                                     defaultValue={this.prepareData("zipcode", "address")}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={getFieldText("city")}
                                     defaultValue={this.prepareData("city", "address")}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={getFieldText("email")}/>
                      </InputGroup>
                    </Col>
                    <Col xs={7} id="date">
                      {date.toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={getFieldText("phone")}/>
                      </InputGroup>
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('profile_pic')}>
                        {getFieldText("profile_pic")}
                      </Button>
                    </Col>
                  </Row>
                </div>
                <div id="content">
                  <Row>
                    <Col xs={11}>
                      <Button variant="primary" block onClick={this.onDialogShow('bio')}>
                        {getFieldText("bio")}
                      </Button>
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
                      {getTitle("experience")}
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('experience')}>
                        {getFieldText("experience")}
                      </Button>
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
                    <Col xs={5} className="title">
                      {getTitle("education")}
                    </Col>
                    <Col xs={6}>
                      <ul>
                        {this.getProfileData("courses_and_education", data)}
                      </ul>
                      <Button variant="primary" block onClick={this.onDialogShow('education')}>
                        {getFieldText("education")}
                      </Button>
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
                      {getTitle("achievements")}
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('achievements')}>
                        {getFieldText("achievements")}
                      </Button>
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
                      {getTitle("titles")}
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('titles')}>
                        {getFieldText("titles")}
                      </Button>
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
                      {getTitle("misc")}
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('misc')}>
                        {getFieldText("misc")}
                      </Button>
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
                      {getTitle("references")}
                    </Col>
                    <Col xs={6}>
                      <Button variant="primary" block onClick={this.onDialogShow('references')}>
                        {getFieldText("references")}
                      </Button>
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
                      {this.prepareData("footer_value", "document_settings")}
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
            <Modal.Title>{getTitle(this.props["EDITOR_DIALOG"])}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.getContent(data)}
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
