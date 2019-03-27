import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Container, Row, Col} from 'react-bootstrap';
import {Button, InputGroup, Form, FormControl, ButtonGroup} from 'react-bootstrap';
import {Alert, Modal, Table, Tabs, Tab} from 'react-bootstrap';

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
    this.createRowData = this.createRowData.bind(this);

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
        if (!this.props["EDITOR_DIALOG_MODE"]) {
          this.temporaryData = DocumentView.deepCopy(data[currentDialog]);
        }
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
          return (
            <Tabs defaultActiveKey="bio" transition={false}>
              <Tab eventKey="bio" title="Biography">
                <Form.Control as="textarea" rows="5" placeholder="Biography" {...mapData("value")} />
              </Tab>
              <Tab eventKey="footer" title="Footer">
                <Form.Control as="textarea" rows="5" placeholder="Footer notes" {...mapData("footer")} />
              </Tab>
            </Tabs>
          );
        }
        case 'experience': {
          return (
            <Tabs activeKey={this.props["EDITOR_DIALOG_MODE"] ? this.props["EDITOR_DIALOG_MODE"] : data[currentDialog] ? "view" : "new"} onSelect={event => this.props.dispatch(actions.setDialogEditMode(event))} id="experience" transition={false} className="align-self-center">
              <Tab eventKey="view" title={<i className="fa fa-list"/>} disabled={!data[currentDialog]}>
                <Table borderless="true" striped="true" responsive={true} size="sm">
                  <thead>
                    <tr>
                      <th>Start date</th>
                      <th>End date</th>
                      <th>Name</th>
                      <th>Title</th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    {this.temporaryData.data.map((item, index) => (
                        <tr key={item.id}>
                          <td>{new Date(item.startdate * 1000).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</td>
                          <td>{new Date(item.enddate * 1000).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</td>
                          <td>{item.name}</td>
                          <td>{item.title}</td>
                          <td className="text-right">
                            <ButtonGroup size="sm">
                              <Button onClick={() => {
                                this.props.dispatch(actions.setDialogEditMode("edit"));
                              }} className="fa fa-cog" variant="primary" size="sm"/>
                              <Button onClick={() => {
                                this.temporaryData.data[index].visible = !this.temporaryData.data[index].visible;
                                this.props.dispatch(actions.setDialogEditMode("view"));
                              }} className={this.temporaryData.data[index].visible ? "fa fa-eye-slash" : "fa fa-eye"} variant="primary" size="sm"/>
                              <Button onClick={() => {
                                this.temporaryData.data.splice(index, 1);
                                this.props.dispatch(actions.setDialogEditMode("view"));
                              }} className="fa fa-times" variant="primary" size="sm"/>
                            </ButtonGroup>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="edit" title={<i className="fa fa-edit"/>} disabled={this.props["EDITOR_DIALOG_MODE"] !== "edit"}>
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
                    <Button variant="primary">Edit</Button>
                  </Col>
                </Form.Row>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
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
              </Tab>
            </Tabs>
          );
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

    this.props.dispatch(actions.global.saveData(this.props['GLOBAL_DATA']));
    this.onDialogHide();
  }

  onDialogHide() {
    this.props.dispatch(dispatch => {
      dispatch(actions.updateDialog(null));
      dispatch(actions.setDialogEditMode(null));
    });
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
      if (key === "bio" || key === "profile_image") {
        return this.getProfileData(key, data);
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

  createRowData(data, key, title_func, text_func) {
    let noData = true;

    if (typeof data === "object" && data[key]) {
      if (typeof data[key].data === "object" && data[key].data.length > 0) {
        noData = false;
      } else {
        data[key] = null;
      }
    }

    return (
      <Row>
        <Col xs={5} className="title">
          {title_func(key)}
        </Col>
        <Col xs={6}>
          {this.createDocumentData(data, key, key, text_func(key))}
        </Col>
        <Col xs={1} className="item-controls">
          <ButtonGroup size="sm" aria-label="Item controls">
            <Button className="fa fa-cog" variant="secondary" onClick={this.onDialogShow(key)} disabled={noData} size="sm"/>
            <Button className="fa fa-eye-slash" variant="secondary" disabled={noData} size="sm"/>
            <Button className="fa fa-times" variant="secondary" disabled={noData} size="sm"/>
          </ButtonGroup>
        </Col>
      </Row>
    );
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
                      Localize: Resume
                    </Col>
                    <Col xs={3} id={"profile-image"} >
                      {this.createDocumentData(data,"profile_image", "profile_image", getFieldText("profile_image"))}
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
                  {this.createRowData(data, "experience", getTitle, getFieldText)}
                  {this.createRowData(data, "education", getTitle, getFieldText)}
                  {this.createRowData(data, "projects", getTitle, getFieldText)}
                  {this.createRowData(data, "titles", getTitle, getFieldText)}
                  {this.createRowData(data, "misc", getTitle, getFieldText)}
                  {this.createRowData(data, "references", getTitle, getFieldText)}
                </div>
                <div id="footer">
                  <Row className="text-center">
                    <Col xs={12}>
                      {this.prepareData("footer", "bio")}
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
