import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Container, Row, Col} from 'react-bootstrap';
import {Button, InputGroup, Form, FormControl, ButtonGroup, Modal, Alert} from 'react-bootstrap';

import * as globalActions from '../actions';
import * as actions from '../actions/DocumentActions';
import locale from '../locales';

import './DocumentView.css';

class DocumentView extends Component {
  constructor(props) {
    super(props);

    this.onDialogShow = this.onDialogShow.bind(this);
    this.onDialogHide = this.onDialogHide.bind(this);
    this.isDialogVisible = this.isDialogVisible.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);

    this.prepareData = this.prepareData.bind(this);
    this.getContent = this.getContent.bind(this);

    this.getProfileData = this.getProfileData.bind(this);
    this.createDocumentData = this.createDocumentData.bind(this);

    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.GLOBAL_LANGUAGE !== nextProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(nextProps.GLOBAL_LANGUAGE);
    }
  }

  getContent(data) {
    if (this.isDialogVisible()) {
      const currentDialog = this.props['EDITOR_DIALOG'];

      if (typeof data === "object" && data[currentDialog]) {
        this.temporaryData = {...data[currentDialog]};
      } else {
        return <Alert variant="danger">Localize: Cannot get dialog information</Alert>;
      }

      const mapData = identifier => {
        return {
          defaultValue: this.temporaryData[identifier] ? this.temporaryData[identifier] : "",
          onChange: event => this.temporaryData[identifier] = event.target.value
        };
      };

      switch (currentDialog) {
        case 'profile_image': {
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
              <Form.Control as="textarea" rows="5" {...mapData("value")} />
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
        case 'misc': {
          break;
        }
        case 'titles': {
          break;
        }
        case 'projects': {
          break;
        }
        case 'references': {
          break;
        }
        default: {
          return <p>{this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, null))}</p>;
        }
      }
    }
  }

  onDialogShow(type) {
    return () => this.props.dispatch(actions.updateDialog(type));
  }

  onSaveChanges() {
    const key = this.props["EDITOR_DIALOG"];
    this.props.GLOBAL_DATA[key] = {...this.props.GLOBAL_DATA[key], ...this.temporaryData};

    this.props.dispatch(globalActions.saveData(this.props.GLOBAL_DATA));
    this.onDialogHide();
  }

  onDialogHide() {
    this.props.dispatch(actions.updateDialog(null));
  }

  isDialogVisible() {
    return typeof this.props['EDITOR_DIALOG'] === 'string';
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
    if(data && data[key]) {
      let array = [];

      switch (key) {
        case 'education': {
            for(let i = 0; i < data[key].data.length; i++) {
              const temp = data[key].data[i];
              let type = temp.type === 'education';

              array.push(
                <li key={i}>
                  <div><b>{type?temp.field_name:temp.course_name}</b></div>
                  <div>{type?temp.school_name:temp.provider_name}</div>
                  <div>Start: {new Date(temp.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                  <div>End: {new Date(temp.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                  <div>{temp.grade?type?"Average grade: " + temp.grade:"Grade: " + temp.grade:""}</div>
                </li>
              );
            }
            return array;
          }


        case 'experience': {
            for(let i = 0; i < data[key].data.length; i++) {
              const temp = data[key].data[i];

              array.push(
                <li key={i}>
                  <div><b>{temp.name}</b></div>
                  <div>{temp.title}</div>
                  <div>{temp.description}</div>
                  <div>Start: {new Date(temp.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                  <div>End: {new Date(temp.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>

                </li>
              );
            }
            return array;
          }


        case 'projects': {
            for(let i = 0; i < data[key].data.length; i++) {
              const temp = data[key].data[i];

              array.push(
                <li key={i}>
                  <div><b>{temp.name}</b></div>
                  <div>{temp.description}</div>
                  <div>Completion date: {new Date(temp.completion_date).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                </li>
              );
            }
            return array;
          }

        case 'profile_image': {
          return (
            <img alt="profile_image" src={data[key].source} />
          )
        }
        case 'bio': {
          return (
            <p>{data[key].value}</p>
          );
        }
        case 'misc': {
          for(let i = 0; i < data[key].data.length; i++) {
            const temp = data[key].data[i];

            array.push(
              <li key={i}>
                <div><b>{temp.name}</b></div>
                <div>{temp.value}</div>
              </li>
            )
          }

          return array;
        }
        case 'titles': {
          for(let i = 0; i < data[key].data.length; i++) {
            const temp = data[key].data[i];

            array.push(
              <li key={i}>
                <div><b>{temp.title}</b></div>
                <div>Awarded: {new Date(temp.awarded).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
              </li>
            );
          }

          return array;
        }
        case 'references': {
          for(let i = 0; i < data[key].data.length; i++) {
            const temp = data[key].data[i];

            array.push(
              <li key={i}>
                <div><b>{temp.name}</b></div>
                <div>{temp.type}</div>
                <div>Email: {temp.contact_email}</div>
                <div>Phone: {temp.contact_phone}</div>
              </li>
            );
          }

          return array;
        }
        default: {
          return (
            <Alert key={key} variant="danger">
              Localize: Unknown category
            </Alert>
          );
        }
      }
    }
  }

  createDocumentData(data, key, dialogType, fieldText) {
    if(data && data[key]) {
      if (key === "bio") {
        return this.getProfileData(key, data);
      } else if(key === "profile_image") {
        return this.getProfileData(key,data);
      } else {
          return (
            <ul>
              {this.getProfileData(key, data)}
            </ul>
          );
        }
    } else {

      return(
        <Button variant="primary" block onClick={this.onDialogShow(dialogType)}>
          {fieldText}
        </Button>
      );
    }
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
            <Col xs={12}>
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
                    <Col xs={3} id={"profile-image"} >
                      {this.createDocumentData(data,"profile_image", "profile_pic", getFieldText("profile_pic"))}
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
                                     placeholder={getFieldText("email")}
                                     defaultValue={this.prepareData("email","contact_info")}/>
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
                                     placeholder={getFieldText("phone")}
                                     defaultValue={this.prepareData("phone","contact_info")}/>
                      </InputGroup>
                    </Col>
                    <Col xs={6}>
                    </Col>
                  </Row>
                </div>
                <div id="content">
                  <Row>
                    <Col xs={11}>
                      {this.createDocumentData(data, "bio", "bio", getFieldText("bio"))}
                    </Col>
                    <Col xs={1} className="item-controls">
                      <ButtonGroup size="sm" aria-label="Item controls">
                        <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                        <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                        <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="title">
                      {getTitle("experience")}
                    </Col>
                    <Col xs={6}>
                      {this.createDocumentData(data,"experience","experience", getFieldText("experience"))}
                    </Col>
                    <Col xs={1} className="item-controls">
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
                      {this.createDocumentData(data, "education", "education", getFieldText("education"))}
                    </Col>
                    <Col xs={1} className="item-controls">
                      <ButtonGroup size="sm" aria-label="Item controls">
                        <Button className="fa fa-cog" variant="secondary" disabled size="sm"/>
                        <Button className="fa fa-eye-slash" variant="secondary" disabled size="sm"/>
                        <Button className="fa fa-times" variant="secondary" disabled size="sm"/>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="title">
                      {getTitle("achievements")}
                    </Col>
                    <Col xs={6}>
                      {this.createDocumentData(data,"projects", "projects", getFieldText("achievements"))}
                    </Col>
                    <Col xs={1} className="item-controls">
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
                      {this.createDocumentData(data,"titles", "titles", getFieldText("titles"))}
                    </Col>
                    <Col xs={1} className="item-controls">
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
                      {this.createDocumentData(data,"misc", "misc", getFieldText("misc"))}
                    </Col>
                    <Col xs={1} className="item-controls">
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
                      {this.createDocumentData(data,"references", "references", getFieldText("references"))}
                    </Col>
                    <Col xs={1} className="item-controls">
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

  static deepCopy(object) {
    if (typeof object === "object") {
      const result = Array.isArray(object) ? [...object] : {...object};

      for (let key in result) {
        if (result.hasOwnProperty(key)) {
          result[key] = DocumentView.deepCopy(result[key]);
        }
      }

      return result;
    }

    return object;
  }
}

export default connect(data => data.Document)(DocumentView);
