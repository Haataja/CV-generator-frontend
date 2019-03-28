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
    this.getDialogTab = this.getDialogTab.bind(this);
    this.getDialogType = this.getDialogType.bind(this);
    this.getDialogItem = this.getDialogItem.bind(this);
    this.getDialogCallback = this.getDialogCallback.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);

    this.prepareData = this.prepareData.bind(this);
    this.getContent = this.getContent.bind(this);

    this.getProfileData = this.getProfileData.bind(this);
    this.createRowData = this.createRowData.bind(this);

    this.getLocalizedField = this.getLocalizedField.bind(this);
    this.getLocalizedTitle = this.getLocalizedTitle.bind(this);
    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.GLOBAL_LANGUAGE !== nextProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(nextProps.GLOBAL_LANGUAGE);
    }
  }

  getLocalizedTitle(identifier) {
    return this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, identifier))
  }

  getLocalizedField(identifier) {
    return this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_FIELD_TEXT, identifier))
  }

  getContent(data) {
    const currentDialog = this.getDialogType();

    if (currentDialog) {
      const currentTab = this.getDialogTab();

      if (!DocumentView.isObject(this.temporaryData)) {
        this.temporaryData = DocumentView.deepCopy(data[currentDialog]);

        if (!this.temporaryData) {
          this.temporaryData = {};
        }
      }

      const mapData = identifier => {
        return {
          defaultValue: this.temporaryData[identifier] ? this.temporaryData[identifier] : '',
          onChange: event => this.temporaryData[identifier] = event.target.value
        };
      };

      const mapObjectData = (identifier) => {
        const index = this.props['EDITOR_DIALOG'].item;

        if (index) {
          return {
            defaultValue: this.temporaryData.data[index][identifier] ? this.temporaryData.data[index][identifier] : ''
          };
        }
      };

      const submitValues = (identifier, index) => {
        return event => {
          event.preventDefault();

          const form = document.getElementById(identifier);
          const values = Object.values(form.elements).reduce(
            (obj, field) => {
              if (field.name) {
                obj[field.name] = field.value;
              }
              return obj;
            },
            {}
          );

          if (Array.isArray(this.temporaryData.data) && typeof index === 'number') {
            this.temporaryData.data[index] = values;
          } else {
            if (!Array.isArray(this.temporaryData.data)) {
              this.temporaryData.data = [];

              this.props.dispatch(actions.updateDialog(this.getDialogType(), this.getDialogTab()));
            }

            this.temporaryData.data.push(values);
          }
        };
      };

      switch (currentDialog) {
        case 'profile_image': {
          return (
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  Image URL:
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl {...mapData('source')} />
            </InputGroup>
          );
        }
        case 'bio': {
          return (
            <Tabs defaultActiveKey="bio" transition={false}>
              <Tab eventKey="bio" title="Biography">
                <Form.Control as="textarea" rows="5" placeholder="Biography" {...mapData('value')} />
              </Tab>
              <Tab eventKey="footer" title="Footer">
                <Form.Control as="textarea" rows="5" placeholder="Footer notes" {...mapData('footer')} />
              </Tab>
            </Tabs>
          );
        }
        case 'experience': {
          const getItems = data => {
            return (
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
                {data.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</td>
                      <td>{new Date(item.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</td>
                      <td>{item.name}</td>
                      <td>{item.title}</td>
                      <td className="text-right">
                        <ButtonGroup size="sm">
                          <Button onClick={this.getDialogCallback('update', index)} className="fa fa-cog"
                                  variant="primary" size="sm"/>
                          <Button onClick={this.getDialogCallback('scope', index)}
                                  className={DocumentView.getIconState(data, index)}
                                  variant="primary" size="sm"/>
                          <Button onClick={this.getDialogCallback('delete', index)} className="fa fa-times"
                                  variant="primary" size="sm"/>
                        </ButtonGroup>
                      </td>
                    </tr>
                  )
                )}
                </tbody>
              </Table>
            );
          };

          return (
            <Tabs activeKey={currentTab} onSelect={this.getDialogCallback} transition={false} className="align-self-center">
              <Tab eventKey="" title={<i className="fa fa-list"/>} disabled={!Array.isArray(this.temporaryData.data)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="update-data">
                  <Form.Row>
                    <Col>
                      <Form.Row>
                        <Col xs={3}>
                          <Form.Group controlId="startDateGroup">
                            <Form.Label>Start date</Form.Label>
                            <Form.Control name="startdate" type="date" {...mapObjectData('startdate')}/>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="typeGroup">
                            <Form.Label>Experience type</Form.Label>
                            <Form.Control name="type" as="select" {...mapObjectData('type')}>
                              <option key="work" value="work">Work experience</option>
                              <option key="personal" value="personal">Other experience</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={4}>
                          <Form.Group controlId="endDateGroup">
                            <Form.Label>End date</Form.Label>
                            <Form.Control name="enddate" type="date" {...mapObjectData('enddate')}/>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="employerGroup">
                            <Form.Label>Employer</Form.Label>
                            <Form.Control name="name" {...mapObjectData('name')}/>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="titleGroup">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" {...mapObjectData('title')}/>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Button variant="primary" block
                              onClick={submitValues('update-data', this.getDialogItem())}>Edit</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="create-data">
                  <Form.Row>
                    <Col>
                      <Form.Row>
                        <Col xs={3}>
                          <Form.Group controlId="startDateGroup">
                            <Form.Label>Start date</Form.Label>
                            <Form.Control name="startdate" type="date"/>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="typeGroup">
                            <Form.Label>Experience type</Form.Label>
                            <Form.Control name="type" as="select">
                              <option value="work">Work experience</option>
                              <option value="personal">Other experience</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={4}>
                          <Form.Group controlId="endDateGroup">
                            <Form.Label>End date</Form.Label>
                            <Form.Control name="enddate" type="date"/>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="employerGroup">
                            <Form.Label>Employer</Form.Label>
                            <Form.Control name="name" ref="shitpile"/>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="titleGroup">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title"/>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Button variant="primary" block onClick={submitValues('create-data')}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
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
          break;
        }
      }
    }

    return <p>{this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, null))}</p>;
  }

  getDialogTab() {
    return this.props['EDITOR_DIALOG'] ? this.props['EDITOR_DIALOG'].tab : null;
  }

  getDialogType() {
    return this.props['EDITOR_DIALOG'] ? this.props['EDITOR_DIALOG'].type : null;
  }

  getDialogItem() {
    return this.props['EDITOR_DIALOG'] ? this.props['EDITOR_DIALOG'].item : null;
  }

  getDialogCallback(type, index = null) {
    switch (type) {
      case 'update': {
        return () => (
          this.props.dispatch(actions.updateDialog(this.getDialogType(), type, index))
        );
      }
      case 'delete': {
        return () => {
          this.temporaryData.data.splice(index, 1);
          this.props.dispatch(actions.updateDialog(this.getDialogType(), ''));
        };
      }
      case 'scope': {
        return () => {
          this.temporaryData.data[index].visible = !this.temporaryData.data[index].visible;
          this.props.dispatch(actions.updateDialog(this.getDialogType(), ''));
        };
      }
      default: {
        this.props.dispatch(actions.updateDialog(this.getDialogType(), type));
      }
    }
  }

  onDialogShow(type, createMode) {
    return () => this.props.dispatch(actions.updateDialog(type, createMode ? 'new' : ''));
  }

  onSaveChanges() {
    const key = this.props['EDITOR_DIALOG'].type;
    this.props['GLOBAL_DATA'][key] = {...this.props['GLOBAL_DATA'][key], ...this.temporaryData};

    this.props.dispatch(actions.global.saveData(this.props['GLOBAL_DATA']));
    this.onDialogHide();
  }

  onDialogHide() {
    this.temporaryData = null;
    this.props.dispatch(actions.updateDialog(null));
  }

  prepareData(key, category = null) {
    let data = this.props['GLOBAL_DATA'];

    if (data) {
      if (category !== null && data[category] !== undefined) {
        data = data[category];
      }

      if (key !== null && data[key] !== undefined) {
        return data[key];
      }
    }

    return '';
  }

  getProfileData(key, data) {
    if (DocumentView.isObject(data) && DocumentView.isObject(data[key])) {
      let array = [];

      switch (key) {
        case 'education': {
          for (let i = 0; i < data[key].data.length; i++) {
            const temp = data[key].data[i];
            let type = temp.type === 'education';

            array.push(
              <li key={i}>
                <div><b>{type ? temp.field_name : temp.course_name}</b></div>
                <div>{type ? temp.school_name : temp.provider_name}</div>
                <div>Start: {new Date(temp.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                <div>End: {new Date(temp.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                <div>{temp.grade ? type ? 'Average grade: ' + temp.grade : 'Grade: ' + temp.grade : ''}</div>
              </li>
            );
          }
          return array;
        }

        case 'experience': {
          for (let i = 0; i < data[key].data.length; i++) {
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
          for (let i = 0; i < data[key].data.length; i++) {
            const temp = data[key].data[i];

            array.push(
              <li key={i}>
                <div><b>{temp.name}</b></div>
                <div>{temp.description}</div>
                <div>Completion
                  date: {new Date(temp.completion_date).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
              </li>
            );
          }
          return array;
        }

        case 'profile_image': {
          return (
            <img alt="profile_image" src={data[key].source}/>
          );
        }
        case 'bio': {
          return (
            <p>{data[key].value}</p>
          );
        }
        case 'misc': {
          for (let i = 0; i < data[key].data.length; i++) {
            const temp = data[key].data[i];

            array.push(
              <li key={i}>
                <div><b>{temp.name}</b></div>
                <div>{temp.value}</div>
              </li>
            );
          }

          return array;
        }
        case 'titles': {
          for (let i = 0; i < data[key].data.length; i++) {
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
          for (let i = 0; i < data[key].data.length; i++) {
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

  createRowData(data, key) {
    const updateScope = () => {
      data[key].visible = !data[key].visible;
      this.props.dispatch(actions.global.saveData(data));
    };

    const deleteAll = () => {
      data[key] = null;
      this.props.dispatch(actions.global.saveData(data));
    };

    const hasData = () => {
      return DocumentView.isObject(data) && DocumentView.isObject(data[key]);
    };

    const hasItems = () => {
      return hasData() && Array.isArray(data[key].data) && data[key].data.length > 0;
    };

    if (key === 'profile_image') {
      if (hasData()) {
        return (
          <>
            {this.getProfileData(key, data)}
            <ButtonGroup size="sm">
              <Button className="fa fa-cog" variant="primary" onClick={this.onDialogShow(key)} size="sm"/>
              <Button className={DocumentView.getIconState(data, key)} variant="primary" onClick={updateScope} size="sm"/>
              <Button className="fa fa-times" variant="primary" onClick={deleteAll} size="sm"/>
            </ButtonGroup>
          </>
        );
      } else {
        return (
          <Button size="sm" variant="primary" onClick={this.onDialogShow(key)}>
            <i className="fa fa-camera"/>
          </Button>
        );
      }
    } else if (key === 'bio') {
      if (hasData()) {
        return (
          <Row>
            <Col xs={10}>
              {this.getProfileData(key, data)}
            </Col>
            <Col xs={2} className="item-controls text-right">
              <ButtonGroup size="sm">
                <Button className="fa fa-cog" variant="primary" onClick={this.onDialogShow(key)} size="sm"/>
                <Button className={DocumentView.getIconState(data, key)} variant="primary" onClick={updateScope} size="sm"/>
                <Button className="fa fa-times" variant="primary" onClick={deleteAll} size="sm"/>
              </ButtonGroup>
            </Col>
          </Row>
        );
      } else {
        return (
          <Row>
            <Col xs={12}>
              <Button variant="primary" block onClick={this.onDialogShow(key, true)}>
                {this.getLocalizedField(key)}
              </Button>
            </Col>
          </Row>
        );
      }
    } else {
      if (hasItems()) {
        return (
          <Row>
            <Col xs={5} className="title">
              {this.getLocalizedTitle(key)}
            </Col>
            <Col xs={5}>
              <ul>
                {this.getProfileData(key, data)}
              </ul>
            </Col>
            <Col xs={2} className="item-controls text-right">
              <ButtonGroup size="sm">
                <Button className="fa fa-cog" variant="primary" onClick={this.onDialogShow(key)} size="sm"/>
                <Button className="fa fa-plus" variant="primary" onClick={this.onDialogShow(key, true)} size="sm"/>
                <Button className={DocumentView.getIconState(data, key)} variant="primary" onClick={updateScope} size="sm"/>
                <Button className="fa fa-times" variant="primary" onClick={deleteAll} size="sm"/>
              </ButtonGroup>
            </Col>
          </Row>
        );
      } else {
        return (
          <Row>
            <Col xs={5} className="title">
              {this.getLocalizedTitle(key)}
            </Col>
            <Col xs={7}>
              <Button variant="primary" block onClick={this.onDialogShow(key, true)}>
                {this.getLocalizedField(key)}
              </Button>
            </Col>
          </Row>
        );
      }
    }
  }

  render() {
    const date = new Date();
    const data = this.props['GLOBAL_DATA'];

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
                                     placeholder={this.getLocalizedField('first_name')}
                                     defaultValue={this.prepareData('firstname')}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('last_name')}
                                     defaultValue={this.prepareData('lastname')}/>
                      </InputGroup>
                    </Col>
                    <Col xs={4} className="title">
                      {this.getLocalizedTitle('resume')}
                    </Col>
                    <Col xs={3} id="profile-image" className="text-right">
                      {this.createRowData(data, 'profile_image', this.getLocalizedTitle, this.getLocalizedField)}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('address')}
                                     defaultValue={this.prepareData('street_address', 'address')}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('zip_code')}
                                     defaultValue={this.prepareData('zipcode', 'address')}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('city')}
                                     defaultValue={this.prepareData('city', 'address')}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('email')}
                                     defaultValue={this.prepareData('email', 'contact_info')}/>
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
                                     placeholder={this.getLocalizedField('phone')}
                                     defaultValue={this.prepareData('phone', 'contact_info')}/>
                      </InputGroup>
                    </Col>
                    <Col xs={6}>
                    </Col>
                  </Row>
                </div>
                <div id="content">
                  {this.createRowData(data, 'bio')}
                  {this.createRowData(data, 'experience')}
                  {this.createRowData(data, 'education')}
                  {this.createRowData(data, 'projects')}
                  {this.createRowData(data, 'titles')}
                  {this.createRowData(data, 'misc')}
                  {this.createRowData(data, 'references')}
                </div>
                <div id="footer">
                  <Row className="text-center">
                    <Col xs={12}>
                      {/*this.prepareData('footer', 'bio')*/}
                    </Col>
                  </Row>
                </div>
              </Container>
            </Col>
          </Row>
        </Container>
        <Modal size="lg" show={!!this.getDialogType()} centered onHide={this.onDialogHide}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getLocalizedTitle(this.getDialogType())}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.getContent(data)}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onDialogHide}>
              {this.getLocalizedString(locale.GLOBAL_CLOSE)}
            </Button>
            <Button variant="primary" onClick={this.onSaveChanges}>
              {this.getLocalizedString(locale.GLOBAL_SAVE_CHANGES)}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  static getIconState(data, key) {
    let icon = 'fa-eye';

    if (this.isObject(data) && this.isObject(data[key])) {
      icon = data[key].visible ? 'fa-eye-slash' : icon;
    }

    return `fa ${icon}`;
  }

  static deepCopy(object) {
    if (this.isObject(object)) {
      const result = Array.isArray(object) ? [...object] : {...object};

      for (let key in result) {
        if (result.hasOwnProperty(key)) {
          result[key] = this.deepCopy(result[key]);
        }
      }

      return result;
    }

    return object;
  }

  static isObject(object) {
    return object instanceof Object && typeof object === 'object';
  }
}

export default connect(data => data.Document)(DocumentView);
