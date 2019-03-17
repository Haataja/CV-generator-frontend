import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Col, Container, Row} from "react-bootstrap";
import {Button, ButtonToolbar} from "react-bootstrap";

import Timeline from "react-visjs-timeline";
import * as actions from "../actions/TimelineActions";

import henkilo from '../testdata/henkilo'

import './TimelineView.css';

export class TimelineView extends Component {
  constructor(props) {
    super(props);

    this.updateView = this.updateView.bind(this);
    this.getTimelineItems = this.getTimelineItems.bind(this);
    this.getTimelineOptions = this.getTimelineOptions.bind(this);
  }

  updateView(value) {
    return event => this.props.dispatch(actions[event.target.id](!value));
  }

  getTimelineItems() {
    return [
      {
        start: new Date(2010, 7, 15),
        end: new Date(2016, 8, 2),  // end is optional
        content: 'Trajectory A'
      },
      {
        start: new Date(2010, 4, 11),
        end: new Date(2012, 3, 2),  // end is optional
        content: 'Trajectory B'
      },
      {
        start: new Date(2009, 7, 15),
        end: new Date(2010, 8, 2),  // end is optional
        content: 'Trajectory C'
      }
    ];
  }
  getTimelineOptions() {
    return {
      width: '100%',
      height: '300pt',
      stack: false,
      showMajorLabels: true,
      showCurrentTime: true,
      min: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 100), // Current date - 100 years
      max: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // Current date + one year
      zoomMin: 1000 * 60 * 60 * 24 * 7, // One week
      zoomMax: 1000 * 60 * 60 * 24 * 365 * 25, // 25 years
      type: 'background'
    };
  }

  render() {
    const propertyWork = {
      text: this.props.SHOW_WORK ? "Show work" : "Hide work",
      variant: this.props.SHOW_WORK ? "info" : "secondary"
    };

    const propertyEducation = {
      text: this.props.SHOW_EDUCATION ? "Show education" : "Hide education",
      variant: this.props.SHOW_EDUCATION ? "info" : "secondary"
    };

    const propertyProjects = {
      text: this.props.SHOW_PROJECTS ? "Show projects" : "Hide projects",
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
              <Timeline items={this.getTimelineItems()} options={this.getTimelineOptions()}/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(TimelineView);