import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Col, Container, Row} from "react-bootstrap";
import {Button, ButtonToolbar} from "react-bootstrap";

import Timeline from "react-visjs-timeline";
import * as actions from "../actions/TimelineActions";
import locale from '../locales';

import henkilo from '../testdata/henkilo'

import './TimelineView.css';

export class TimelineView extends Component {
  constructor(props) {
    super(props);

    this.updateView = this.updateView.bind(this);
    this.getTimelineItems = this.getTimelineItems.bind(this);
    this.getTimelineOptions = this.getTimelineOptions.bind(this);
    this.getTimeLineGroups = this.getTimeLineGroups.bind(this);

    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.GLOBAL_LANGUAGE !== prevProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(this.props.GLOBAL_LANGUAGE);
    }
  }

  updateView(value) {
    return event => this.props.dispatch(actions[event.target.id](!value));
  }

  getTimelineItems(data) {
    const GROUP_WORK = 1;
    const GROUP_EDUCATION = 2;
    const GROUP_PROJECTS = 3;
    let work = [];
    let projects = [];
    let education = [];

    for(let prop of data.experience.data) {
      if(prop.visible) {
        work.push({
          start: new Date(prop.startdate * 1000),
          end: new Date(prop.enddate * 1000),
          content: prop.title,
          title: `<h5>${prop.title}</h5><p>${prop.name}<br/>${prop.description}</p>`,
          group: GROUP_WORK,
          className: 'timeline-item-work'
        });
      }
    }

    for(let prop of data.achievements_and_projects.data) {
      if(prop.visible) {
        projects.push({
          start: new Date(prop.completion_date * 1000),
          type: 'box',
          title: `<h5>${prop.name}</h5><p>${prop.description}</p>`,
          content: prop.name,
          group: GROUP_PROJECTS,
          className: 'timeline-item-projects'
        });
      }
    }

    for(let prop of data.courses_and_education.data) {
      if(prop.visible) {
        education.push({
          start: new Date(prop.startdate * 1000),
          end: new Date(prop.enddate * 1000),
          title: `<h5>${prop.type === 'education'? prop.field_name:prop.course_name}</h5><p>${prop.type === 'education'?prop.school_name:prop.provider_name}</p>`,
          content: `${prop.type === 'education'? prop.field_name:prop.course_name}`,
          group: GROUP_EDUCATION,
          className: 'timeline-item-education'
        });
      }
    }

    return work.concat(projects,education);
  }

  getTimeLineGroups() {
    return [
      {
        id: 1,
        content: 'Work',
        visible: this.props.SHOW_WORK
      },
      {
        id: 2,
        content: 'Education',
        visible: this.props.SHOW_EDUCATION
      },
      {
        id: 3,
        content: 'Projects',
        visible: this.props.SHOW_PROJECTS
      }
    ];
  }

  getTimelineOptions() {
    return {
      width: '100%',
      stack: true,
      showMajorLabels: true,
      showCurrentTime: true,
      min: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 100), // Current date - 100 years
      max: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // Current date + one year
      zoomMin: 1000 * 60 * 60 * 24 * 7, // One week
      zoomMax: 1000 * 60 * 60 * 24 * 365 * 25, // 25 years
    };
  }

  render() {
    const propertyWork = {
      text: this.getLocalizedString(this.props.SHOW_WORK ? locale.TIMELINE_SHOW_WORK : locale.TIMELINE_HIDE_WORK),
      variant: this.props.SHOW_WORK ? "info" : "secondary"
    };

    const propertyEducation = {
      text: this.getLocalizedString(this.props.SHOW_EDUCATION ? locale.TIMELINE_SHOW_EDUCATION : locale.TIMELINE_HIDE_EDUCATION),
      variant: this.props.SHOW_EDUCATION ? "info" : "secondary"
    };

    const propertyProjects = {
      text: this.getLocalizedString(this.props.SHOW_PROJECTS ? locale.TIMELINE_SHOW_PROJECTS : locale.TIMELINE_HIDE_PROJECTS),
      variant: this.props.SHOW_PROJECTS ? "info" : "secondary"
    };


    return (
      <div id="background">
        <Container id="page">
          <Row>
            <Col xs={12}>
              <ButtonToolbar>
                <Button id="showWork" variant={propertyWork.variant} onClick={this.updateView(this.props.SHOW_WORK)}>{propertyWork.text}</Button>
                <Button id="showEducation" variant={propertyEducation.variant} onClick={this.updateView(this.props.SHOW_EDUCATION)}>{propertyEducation.text}</Button>
                <Button id="showProjects" variant={propertyProjects.variant} onClick={this.updateView(this.props.SHOW_PROJECTS)}>{propertyProjects.text}</Button>
              </ButtonToolbar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} id="timeline">
              <Timeline items={this.getTimelineItems(henkilo)} options={this.getTimelineOptions()} groups={this.getTimeLineGroups()}/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(TimelineView);