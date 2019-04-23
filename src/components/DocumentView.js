import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Container, Row, Col} from 'react-bootstrap';
import {Button, InputGroup, Form, FormControl, ButtonGroup} from 'react-bootstrap';
import {Modal, Table, Tabs, Tab} from 'react-bootstrap';

import {AlertList} from 'react-bs-notifier';

import * as actions from '../actions/DocumentActions';
import locale from '../locales';

import './DocumentView.css';

/*
 * React component that displays document view.
 */
class DocumentView extends Component {

  /*
   * Overrides default constructor.
   */
  constructor(props) {
    super(props);

    this.onDialogShow = this.onDialogShow.bind(this);
    this.onDialogHide = this.onDialogHide.bind(this);
    this.getDialogTab = this.getDialogTab.bind(this);
    this.getDialogType = this.getDialogType.bind(this);
    this.getDialogItem = this.getDialogItem.bind(this);
    this.getDialogCallback = this.getDialogCallback.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);

    this.getContent = this.getContent.bind(this);

    this.getProfileData = this.getProfileData.bind(this);
    this.createRowData = this.createRowData.bind(this);
    this.postPartialData = this.postPartialData.bind(this);

    this.getLocalizedField = this.getLocalizedField.bind(this);
    this.getLocalizedTitle = this.getLocalizedTitle.bind(this);

    this.generate = this.generate.bind(this);
    this.clear = this.clear.bind(this);

    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);

    this.origin = window.location.origin;
    if (process.env.NODE_ENV === 'development') {
      this.origin = this.origin.replace(/:\d+$/, ':8080');
    }
  }

  /*
   * Overrides React method.
   */
  componentWillUpdate(nextProps, nextState) {
    if (this.props.GLOBAL_LANGUAGE !== nextProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(nextProps.GLOBAL_LANGUAGE);
    }
  }

  /*
   * Gets localized title.
   */
  getLocalizedTitle(identifier) {
    return this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, identifier));
  }

  /*
   * Gets localized field value.
   */
  getLocalizedField(identifier) {
    return this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_FIELD_TEXT, identifier));
  }

  /*
   * Gets current dialog content.
   */
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

      const dateFormat = date => {
        date = typeof date === 'string' ? new Date(date) : new Date();
        return date.toISOString().slice(0, 10);
      };

      const visibilityData = [
        {value: true, title: this.getLocalizedString(locale.GLOBAL_VISIBILITY_VISIBLE)},
        {value: false, title: this.getLocalizedString(locale.GLOBAL_VISIBILITY_HIDDEN)}
      ].map(
        item => <option key={item.value} value={item.value}>{item.title}</option>
      );

      const mapProperty = (property, type = null, shouldSubmit = true) => {
        const mapData = data => {
          switch (type) {
            case 'boolean': {
              return {
                defaultValue: Boolean(data[property]),
                onChange: event => data[property] = Boolean(event.target.value),
                name: property
              };
            }
            case 'date': {
              return {
                defaultValue: dateFormat(data[property]),
                onChange: event => data[property] = event.target.value,
                name: property
              };
            }
            default: {
              return {
                defaultValue: data[property],
                onChange: event => data[property] = event.target.value,
                name: property
              };
            }
          }
        };

        let data = this.temporaryData;

        if (shouldSubmit) {
          data = DocumentView.deepCopy(data);
        }

        if (DocumentView.isObject(data)) {
          const index = this.getDialogItem();

          if (typeof index == 'number' && Array.isArray(data.data)) {
            return mapData(data.data[index]);
          } else {
            return mapData(data);
          }
        }
      };

      const submitValues = event => {
        event.preventDefault();

        const index = this.getDialogItem();
        const form = document.getElementById(typeof index == 'number' ? 'edit-item' : 'add-item');
        const values = Object.values(form.elements).reduce(
          (obj, field) => {
            if (field.name) {
              let value = field.value;

              if (field.type === 'number') {
                value = Number(value);
              } else if (field.name === 'visible') {
                value = value.toLowerCase() === 'true';
              }

              obj[field.name] = value;
            }
            return obj;
          },
          {}
        );

        if (typeof index === 'number' && Array.isArray(this.temporaryData.data)) {
          this.temporaryData.data[index] = values;
        } else {
          if (!Array.isArray(this.temporaryData.data)) {
            this.temporaryData.data = [];

            this.props.dispatch(actions.updateDialog(this.getDialogType(), this.getDialogTab()));
          }

          this.temporaryData.data.push(values);
        }
      };

      let index = this.getDialogItem() ? this.getDialogItem() : 0;
      let visibilityOption = this.temporaryData && this.temporaryData.data && this.temporaryData.data[index] ? this.temporaryData.data[index].visible : true;

      switch (currentDialog) {
        case 'profile_image': {
          return (
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  {this.getLocalizedString(locale.EDITOR_PROFILE_IMAGE_URL)}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="url" {...mapProperty('source', null, false)} />
            </InputGroup>
          );
        }
        case 'bio': {
          return (
            <Form.Group controlId="bioGroup">
              <Form.Label>{this.getLocalizedString(locale.EDITOR_BIO_HELP)}</Form.Label>
              <Form.Control as="textarea" rows="5" {...mapProperty('value', null, false)} />
            </Form.Group>
          );
        }
        case 'experience': {
          const getItems = data => {
            return (
              <Table borderless="true" striped="true" responsive={true} size="sm">
                <thead>
                <tr>
                  <th>{this.getLocalizedString(locale.GLOBAL_START_DATE)}</th>
                  <th>{this.getLocalizedString(locale.GLOBAL_END_DATE)}</th>
                  <th>{this.getLocalizedString(locale.GLOBAL_NAME)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_TITLE)}</th>
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
              <Tab eventKey="" title={<i className="fa fa-list"/>}
                   disabled={!(Array.isArray(this.temporaryData.data) && this.temporaryData.data.length > 0)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="edit-item">
                  <Form.Row>
                    <Col>
                      <Form.Row>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="startDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_START_DATE)}</Form.Label>
                            <Form.Control type="date" {...mapProperty('startdate', 'date')}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="endDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_END_DATE)}</Form.Label>
                            <Form.Control type="date" {...mapProperty('enddate', 'date')}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="visibleGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                            <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                              {visibilityData}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="employerGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_EMPLOEYER)}</Form.Label>
                            <Form.Control {...mapProperty('name')}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="titleGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_TITLE)}</Form.Label>
                            <Form.Control {...mapProperty('title')}/>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="descriptionGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_DESCRIPTION)}</Form.Label>
                        <Form.Control {...mapProperty('description')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="work"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="add-item">
                  <Form.Row>
                    <Col>
                      <Form.Row>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="startDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_START_DATE)}</Form.Label>
                            <Form.Control name="startdate" type="date" defaultValue={dateFormat()}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="endDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_END_DATE)}</Form.Label>
                            <Form.Control name="enddate" type="date" defaultValue={dateFormat()}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="visibleGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                            <Form.Control name="visible" as="select">
                              {visibilityData}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="employerGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_EMPLOEYER)}</Form.Label>
                            <Form.Control name="name"/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="titleGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_TITLE)}</Form.Label>
                            <Form.Control name="title"/>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="descriptionGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_EXPERIENCE_DESCRIPTION)}</Form.Label>
                        <Form.Control name="description"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="work"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
            </Tabs>
          );
        }
        case 'education': {
          const getItems = data => {
            return (
              <Table borderless="true" striped="true" responsive={true} size="sm">
                <thead>
                <tr>
                  <th>{this.getLocalizedString(locale.GLOBAL_START_DATE)}</th>
                  <th>{this.getLocalizedString(locale.GLOBAL_END_DATE)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_EDUCATION_SCHOOL_NAME)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_EDUCATION_FIELD_NAME)}</th>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</td>
                      <td>{new Date(item.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</td>
                      <td>{item.school_name}</td>
                      <td>{item.field_name}</td>
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
              <Tab eventKey="" title={<i className="fa fa-list"/>}
                   disabled={!(Array.isArray(this.temporaryData.data) && this.temporaryData.data.length > 0)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="edit-item">
                  <Form.Row>
                    <Col>
                      <Form.Row>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="startDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_START_DATE)}</Form.Label>
                            <Form.Control type="date" {...mapProperty('startdate', 'date')}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="endDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_END_DATE)}</Form.Label>
                            <Form.Control type="date" {...mapProperty('enddate', 'date')}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="visibleGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                            <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                              {visibilityData}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="schoolGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EDUCATION_SCHOOL_NAME)}</Form.Label>
                            <Form.Control {...mapProperty('school_name')}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="schoolTypeGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EDUCATION_SCHOOL_TYPE)}</Form.Label>
                            <Form.Control {...mapProperty('school_type')}/>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="gradeGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_GRADE)}</Form.Label>
                        <Form.Control type="number" {...mapProperty('grade')}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="fieldGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_EDUCATION_FIELD_NAME)}</Form.Label>
                        <Form.Control {...mapProperty('field_name')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="education"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="add-item">
                  <Form.Row>
                    <Col>
                      <Form.Row>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="startDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_START_DATE)}</Form.Label>
                            <Form.Control name="startdate" type="date" defaultValue={dateFormat()}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="endDateGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_END_DATE)}</Form.Label>
                            <Form.Control name="enddate" type="date" defaultValue={dateFormat()}/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Group controlId="visibleGroup">
                            <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                            <Form.Control name="visible" as="select">
                              {visibilityData}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="schoolGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EDUCATION_SCHOOL_NAME)}</Form.Label>
                            <Form.Control name="school_name"/>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="schoolTypeGroup">
                            <Form.Label>{this.getLocalizedString(locale.EDITOR_EDUCATION_SCHOOL_TYPE)}</Form.Label>
                            <Form.Control name="school_type"/>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="gradeGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_GRADE)}</Form.Label>
                        <Form.Control name="grade" type="number"/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="fieldGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_EDUCATION_FIELD_NAME)}</Form.Label>
                        <Form.Control name="field_name"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="education"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
            </Tabs>
          );
        }
        case 'misc': {
          const getItems = data => {
            return (
              <Table borderless="true" striped="true" responsive={true} size="sm">
                <thead>
                <tr>
                  <th>{this.getLocalizedString(locale.GLOBAL_NAME)}</th>
                  <th>{this.getLocalizedString(locale.GLOBAL_VALUE)}</th>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.value}</td>
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
              <Tab eventKey="" title={<i className="fa fa-list"/>}
                   disabled={!(Array.isArray(this.temporaryData.data) && this.temporaryData.data.length > 0)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="edit-item">
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="nameGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_NAME)}</Form.Label>
                        <Form.Control {...mapProperty('name')}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="valueGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VALUE)}</Form.Label>
                        <Form.Control {...mapProperty('value')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="other"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="add-item">
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="nameGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_NAME)}</Form.Label>
                        <Form.Control name="name"/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="valueGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VALUE)}</Form.Label>
                        <Form.Control name="value"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="other"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
            </Tabs>
          );
        }
        case 'titles': {
          const getItems = data => {
            return (
              <Table borderless="true" striped="true" responsive={true} size="sm">
                <thead>
                <tr>
                  <th>{this.getLocalizedString(locale.EDITOR_TITLES_AWARDED)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_TITLES_VALUE)}</th>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.awarded}</td>
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
              <Tab eventKey="" title={<i className="fa fa-list"/>}
                   disabled={!(Array.isArray(this.temporaryData.data) && this.temporaryData.data.length > 0)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="edit-item">
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="awardedGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_TITLES_AWARDED)}</Form.Label>
                        <Form.Control type="date" {...mapProperty('awarded', 'date')}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="titleGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_TITLES_VALUE)}</Form.Label>
                        <Form.Control {...mapProperty('title')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="title"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="add-item">
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="awardedGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_TITLES_AWARDED)}</Form.Label>
                        <Form.Control name="awarded" type="date" defaultValue={dateFormat()}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="valueGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_TITLES_VALUE)}</Form.Label>
                        <Form.Control name="title"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="title"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
            </Tabs>
          );
        }
        case 'projects': {
          const getItems = data => {
            return (
              <Table borderless="true" striped="true" responsive={true} size="sm">
                <thead>
                <tr>
                  <th>{this.getLocalizedString(locale.EDITOR_PROJECT_COMPLETION)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_PROJECT_PROJECT_NAME)}</th>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.completion_date}</td>
                      <td>{item.name}</td>
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
              <Tab eventKey="" title={<i className="fa fa-list"/>}
                   disabled={!(Array.isArray(this.temporaryData.data) && this.temporaryData.data.length > 0)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="edit-item">
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="dateGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_PROJECT_COMPLETION)}</Form.Label>
                        <Form.Control type="date" {...mapProperty('completion_date', 'date')}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="nameGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_PROJECT_PROJECT_NAME)}</Form.Label>
                        <Form.Control {...mapProperty('name')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="descriptionGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_PROJECT_DESCRIPTION)}</Form.Label>
                        <Form.Control as="textarea" rows="3" {...mapProperty('description')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="project"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="add-item">
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="dateGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_PROJECT_COMPLETION)}</Form.Label>
                        <Form.Control name="completion_date" type="date" defaultValue={dateFormat()}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" name="visible">
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="nameGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_PROJECT_PROJECT_NAME)}</Form.Label>
                        <Form.Control name="name"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Group controlId="descriptionGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_PROJECT_DESCRIPTION)}</Form.Label>
                        <Form.Control as="textarea" rows="3" name="description"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="project"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
            </Tabs>
          );
        }
        case 'references': {
          const getItems = data => {
            return (
              <Table borderless="true" striped="true" responsive={true} size="sm">
                <thead>
                <tr>
                  <th>{this.getLocalizedString(locale.GLOBAL_NAME)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_REFERENCES_EMAIL)}</th>
                  <th>{this.getLocalizedString(locale.EDITOR_REFERENCES_PHONE)}</th>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.contact_email}</td>
                      <td>{item.contact_phone}</td>
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
              <Tab eventKey="" title={<i className="fa fa-list"/>}
                   disabled={!(Array.isArray(this.temporaryData.data) && this.temporaryData.data.length > 0)}>
                {Array.isArray(this.temporaryData.data) ? getItems(this.temporaryData.data) : ''}
              </Tab>
              <Tab eventKey="update" title={<i className="fa fa-edit"/>} disabled={currentTab !== 'update'}>
                <Form id="edit-item">
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="nameGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_NAME)}</Form.Label>
                        <Form.Control {...mapProperty('name')}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="emailGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_REFERENCES_EMAIL)}</Form.Label>
                        <Form.Control {...mapProperty('contact_email')}/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="phoneGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_REFERENCES_PHONE)}</Form.Label>
                        <Form.Control {...mapProperty('contact_phone')}/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="person"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
              <Tab eventKey="new" title={<i className="fa fa-plus-circle"/>}>
                <Form id="add-item">
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="nameGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_NAME)}</Form.Label>
                        <Form.Control name="name"/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="visibleGroup">
                        <Form.Label>{this.getLocalizedString(locale.GLOBAL_VISIBILITY_TITLE)}</Form.Label>
                        <Form.Control as="select" {...mapProperty('visible', 'boolean')} defaultValue={visibilityOption}>
                          {visibilityData}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="emailGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_REFERENCES_EMAIL)}</Form.Label>
                        <Form.Control name="contact_email"/>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group controlId="phoneGroup">
                        <Form.Label>{this.getLocalizedString(locale.EDITOR_REFERENCES_PHONE)}</Form.Label>
                        <Form.Control name="contact_phone"/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={12}>
                      <Form.Control name="type" type="hidden" defaultValue="person"/>
                      <Button variant="primary" block onClick={submitValues}>{this.getLocalizedField(currentDialog)}</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </Tab>
            </Tabs>
          );
        }
        default: {
          break;
        }
      }
    }

    return <p>{this.getLocalizedString(locale.getKeyFormat(locale.EDITOR_GENERIC_TEXT, null))}</p>;
  }

  /*
   * Gets current dialog tab.
   */
  getDialogTab() {
    return this.props['EDITOR_DIALOG'] ? this.props['EDITOR_DIALOG'].tab : null;
  }

  /*
   * Gets current dialog type.
   */
  getDialogType() {
    return this.props['EDITOR_DIALOG'] ? this.props['EDITOR_DIALOG'].type : null;
  }

  /*
   * Gets current dialog item index.
   */
  getDialogItem() {
    return this.props['EDITOR_DIALOG'] ? this.props['EDITOR_DIALOG'].item : null;
  }

  /*
   * Gets dialog callback function.
   */
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

          if (this.temporaryData.data.length > 0) {
            this.props.dispatch(actions.updateDialog(this.getDialogType()));
          } else {
            this.props.dispatch(actions.updateDialog(this.getDialogType()), 'new');
          }
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

  /*
   * Shows dialog view.
   */
  onDialogShow(type, createMode) {
    return () => this.props.dispatch(actions.updateDialog(type, createMode ? 'new' : ''));
  }

  /*
   * Saves data.
   */
  onSaveChanges(data) {
    const key = this.props['EDITOR_DIALOG'].type;
    data[key] = {...data[key], ...this.temporaryData};
    this.props.dispatch(actions.global.saveData(data));
    this.postPartialData(key, data[key]);
    this.onDialogHide();
  }

  /*
   * Sends partial data to backend.
   */
  postPartialData(key, data) {
    if (data) {
      const post = (url, postData) => {
        fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }).then(() => this.generate(this.getLocalizedString(locale.ALERT_SUCCESS), this.getLocalizedString(locale.ALERT_TEXT_SUCCESS)))
          .catch(() => this.generate(this.getLocalizedString(locale.ALERT_FAILURE), this.getLocalizedString(locale.ALERT_TEXT_FAILURE)));
      };

      switch (key) {
        case 'bio': {
          let url = `${this.origin}/api/post/bio`;
          let postData = {value: data.value, visible: data.visible, footer: data.footer};
          post(url, postData);
          break;
        }

        case 'experience': {
          let url = `${this.origin}/api/post/experience`;
          let postData = {data: data.data, visible: data.visible, order: data.order ? data.order : 0};
          post(url, postData);
          break;
        }

        case 'education': {
          let url = `${this.origin}/api/post/education`;
          let postData = {data: data.data, visible: data.visible, order: data.order ? data.order : 0};
          post(url, postData);
          break;
        }

        case 'projects': {
          let url = `${this.origin}/api/post/projects`;
          let postData = {data: data.data, visible: data.visible, order: data.order ? data.order : 0};
          post(url, postData);
          break;
        }

        case 'titles': {
          let url = `${this.origin}/api/post/titles`;
          let postData = {data: data.data, visible: data.visible, order: data.order ? data.order : 0};
          post(url, postData);
          break;
        }

        case 'misc': {
          let url = `${this.origin}/api/post/misc`;
          let postData = {data: data.data, visible: data.visible, order: data.order ? data.order : 0};
          post(url, postData);
          break;
        }

        case 'references': {
          let url = `${this.origin}/api/post/references`;
          let postData = {data: data.data, visible: data.visible, order: data.order ? data.order : 0};
          post(url, postData);
          break;
        }

        case 'profile_image': {
          let url = `${this.origin}/api/post/profile`;
          let postData = {source: data.source, visible: data.visible};
          post(url, postData);
          break;
        }

        case 'basic_info': {
          let url = `${this.origin}/api/post/user`;
          let postData = {
            firstname: data.firstname,
            lastname: data.lastname,
            birthdate: '',
            contact_info: {
              email: data.contact_info.email,
              phone: data.contact_info.phone,
              visible: data.contact_info.visible
            },
            address: {
              street_address: data.address.street_address,
              zipcode: data.address.zipcode,
              country: '',
              city: data.address.city,
              visible: data.address.visible
            }
          };
          post(url, postData);
          break;
        }
      }
    }
  }

  /*
   * Hides dialog view.
   */
  onDialogHide() {
    this.temporaryData = null;
    this.props.dispatch(actions.updateDialog(null));
  }

  /*
   * Gets user profile data.
   */
  getProfileData(key, data) {
    if (DocumentView.isObject(data) && DocumentView.isObject(data[key])) {
      switch (key) {
        case 'profile_image': {
          return (
            <img alt="" src={data[key].source}/>
          );
        }
        case 'bio': {
          return (
            <p>{data[key].value}</p>
          );
        }
        case 'education': {
          return data[key].data.map((item, i) => {
            let type = item.type === 'education';

            return (
              <li key={i}>
                <div><b>{type ? item.field_name : item.course_name}</b></div>
                <div>{type ? item.school_name : item.provider_name}</div>
                <div>{this.getLocalizedString(locale.GLOBAL_START_DATE)}: {new Date(item.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                <div>{this.getLocalizedString(locale.GLOBAL_END_DATE)}: {new Date(item.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
                <div>{item.grade ? type ? this.getLocalizedString(locale.GLOBAL_GRADE) + ': ' + item.grade : this.getLocalizedString(locale.GLOBAL_GRADE) + ': ' + item.grade : ''}</div>
              </li>
            );
          });
        }
        case 'experience': {
          return data[key].data.map((item, i) => (
            <li key={i}>
              <div><b>{item.name}</b></div>
              <div>{item.title}</div>
              <div>{item.description}</div>
              <div>{this.getLocalizedString(locale.GLOBAL_START_DATE)}: {new Date(item.startdate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
              <div>{this.getLocalizedString(locale.GLOBAL_END_DATE)}: {new Date(item.enddate).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
            </li>
          ));
        }
        case 'projects': {
          return data[key].data.map((item, i) => (
            <li key={i}>
              <div><b>{item.name}</b></div>
              <div>{item.description}</div>
              <div>{this.getLocalizedString(locale.EDITOR_PROJECT_COMPLETION)}: {new Date(item.completion_date).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
            </li>
          ));
        }
        case 'misc': {
          return data[key].data.map((item, i) => (
            <li key={i}>
              <div><b>{item.name}</b></div>
              <div>{item.value}</div>
            </li>
          ));
        }
        case 'titles': {
          return data[key].data.map((item, i) => (
            <li key={i}>
              <div><b>{item.title}</b></div>
              <div>{this.getLocalizedString(locale.EDITOR_TITLES_AWARDED)}: {new Date(item.awarded).toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}</div>
            </li>
          ));
        }
        case 'references': {
          return data[key].data.map((item, i) => (
            <li key={i}>
              <div><b>{item.name}</b></div>
              <div>Email: {item.contact_email}</div>
              <div>Phone: {item.contact_phone}</div>
            </li>
          ));
        }
        default: {
          return (
            this.generate('Localize: Unknown category', 'Error')
          );
        }
      }
    }
  }

  /*
   * Produces document rows.
   */
  createRowData(data, key) {
    const updateScope = () => {
      data[key].visible = !data[key].visible;
      this.props.dispatch(actions.global.saveData(data));
      this.postPartialData(key, data[key]);
    };

    const deleteAll = () => {
      if (data[key].data) {
        data[key] = {data: [], visible: true};
      } else {
        data[key] = {visible: true};
      }

      this.props.dispatch(actions.global.saveData(data));
      this.postPartialData(key, data[key]);
    };

    const objectIsEmpty = data => {
      if (DocumentView.isObject(data)) {
        for (let index in data) {
          if (index !== 'visible' && index !== 'order' && data.hasOwnProperty(index)) {
            return false;
          }
        }
      }

      return true;
    };

    const hasData = () => {
      return DocumentView.isObject(data) && !objectIsEmpty(data[key]);
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
      if (hasData() && data[key].value !== '') {
        return (
          <Row>
            <Col xs={12} sm={9} md={10}>
              {this.getProfileData(key, data)}
            </Col>
            <Col xs={12} sm={3} md={2} className="item-controls text-right">
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
            <Col xs={12} sm={5} md={5} className="title">
              {this.getLocalizedTitle(key)}
            </Col>
            <Col xs={12} sm={7} md={5}>
              <ul>
                {this.getProfileData(key, data)}
              </ul>
            </Col>
            <Col xs={12} md={2} className="item-controls text-right">
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
            <Col xs={12} sm={5} className="d-none d-sm-block title">
              {this.getLocalizedTitle(key)}
            </Col>
            <Col xs={12} sm={7}>
              <Button variant="primary" block onClick={this.onDialogShow(key, true)}>
                {this.getLocalizedField(key)}
              </Button>
            </Col>
          </Row>
        );
      }
    }
  }

  /*
   * Generates alerts.
   */
  generate(title, message) {
    const newAlert = [{
      id: (new Date()).getTime(),
      type: 'info',
      headline: title,
      message: message
    }];

    this.props.dispatch(actions.updateAlert(newAlert));
  }

  /*
   * Clears alerts.
   */
  clear() {
    this.props.dispatch(actions.updateAlert([]));
  }

  /*
   * Renders component.
   */
  render() {
    const date = new Date();
    const data = DocumentView.initializeData(this.props['GLOBAL_DATA']);

    const mapFieldData = (data, property) => {
      return {
        defaultValue: data[property],
        onChange: event => data[property] = event.target.value
      };
    };

    return (
      <>
        <AlertList
          position="bottom-right"
          alerts={this.props.EDITOR_ALERT}
          timeout={2000}
          dismissTitle={this.getLocalizedString(locale.ALERT_DISMISS)}
          onDismiss={this.clear}
        />
        <Container fluid={true} id="editor">
          <Row>
            <Col xs={12}>
              <Container id="page">
                <div id="header">
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('first_name')}
                                     {...mapFieldData(data, 'firstname')}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('last_name')}
                                     {...mapFieldData(data, 'lastname')}/>
                      </InputGroup>
                    </Col>
                    <Col sm={6} md={3} className="d-none d-sm-block title">
                      {this.getLocalizedTitle('resume')}
                    </Col>
                    <Col md={3} id="profile-image" className="d-none d-md-block text-right">
                      {this.createRowData(data, 'profile_image', this.getLocalizedTitle, this.getLocalizedField)}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('address')}
                                     {...mapFieldData(data.address, 'street_address')}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('zip_code')}
                                     {...mapFieldData(data.address, 'zipcode')}/>
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('city')}
                                     {...mapFieldData(data.address, 'city')}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('email')}
                                     {...mapFieldData(data.contact_info, 'email')}/>
                      </InputGroup>
                    </Col>
                    <Col sm={6} className="d-none d-sm-block">
                      {date.toLocaleDateString(this.getLocalizedString(locale.GLOBAL_LANGUAGE_ISO))}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <InputGroup size="sm">
                        <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                     placeholder={this.getLocalizedField('phone')}
                                     {...mapFieldData(data.contact_info, 'phone')}/>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6}>
                      <Button size="sm" block
                              onClick={() => this.postPartialData('basic_info', data)}>{this.getLocalizedString(locale.GLOBAL_UPDATE_INFORMATION)}</Button>
                    </Col>
                  </Row>
                </div>
                <div id="content">
                  {
                    [
                      'bio',
                      'experience',
                      'education',
                      'projects',
                      'titles',
                      'misc',
                      'references'
                    ].map(
                      key => this.createRowData(data, key)
                    )
                  }
                </div>
              </Container>
            </Col>
          </Row>
        </Container>
        <Modal size="lg" show={!!this.getDialogType()} centered onHide={this.onDialogHide}>
          <Modal.Header closeButton>
            <Modal.Title className="mr-auto">{this.getLocalizedTitle(this.getDialogType())}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.getContent(data ? data : {})}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onDialogHide}>
              {this.getLocalizedString(locale.GLOBAL_CLOSE)}
            </Button>
            <Button variant="primary" onClick={() => this.onSaveChanges(data)}>
              {this.getLocalizedString(locale.GLOBAL_SAVE_CHANGES)}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  /*
   * Initializes user data.
   */
  static initializeData(data) {
    /*
      NOTICE: Test data can be injected here!

      Remove existing defaultData value and replace it with provided test data.

      const defaultData = {TEST DATA};
      -- or --
      const defaultData = JSON.parse(`{TEST_DATA}`);
    */

    const defaultData = {
      firstname: '',
      lastname: '',
      address: {
        street_address: '',
        zipcode: '',
        city: '',
        visible: true
      },
      contact_info: {
        email: '',
        phone: '',
        visible: true
      },
      bio: {
        visible: true
      },
      experience: {
        data: [],
        visible: true
      },
      education: {
        data: [],
        visible: true
      },
      references: {
        data: [],
        visible: true
      },
      projects: {
        data: [],
        visible: true
      },
      titles: {
        data: [],
        visible: true
      },
      misc: {
        data: [],
        visible: true
      }
    };

    return DocumentView.isObject(data) ? {...defaultData, ...data} : defaultData;
  }

  /*
   * Gets visibility icon state.
   */
  static getIconState(data, key) {
    let icon = 'fa-eye';

    if (this.isObject(data) && this.isObject(data[key])) {
      icon = data[key].visible ? 'fa-eye-slash' : icon;
    }

    return `fa ${icon}`;
  }

  /*
   * Deep-copies object structure.
   */
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

  /*
   * Checks if given parameter is object.
   */
  static isObject(object) {
    return object instanceof Object && typeof object === 'object';
  }
}

export default connect(data => data.Document)(DocumentView);
