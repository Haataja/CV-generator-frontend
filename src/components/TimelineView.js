import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Col, Container, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";

import Timeline from "react-visjs-timeline";
import * as actions from "../actions/TimelineActions";

import './TimelineView.css';

export class TimelineView extends Component {
  constructor(props) {
    super(props);

    this.updateView = this.updateView.bind(this);
    this.getTimelineItems = this.getTimelineItems.bind(this);
  }
  updateView(value) {
    return event => this.props.dispatch(actions[event.target.id](!value));
  }
  getTimelineItems() {
    return [
      {
        start: new Date(2010, 7, 15),
        end: new Date(2016, 8, 2),  // end is optional
        content: 'Trajectory A',
      },
      {
        start: new Date(2010, 4, 11),
        end: new Date(2012, 3, 2),  // end is optional
        content: 'Trajectory B',
      },
      {
        start: new Date(2009, 7, 15),
        end: new Date(2010, 8, 2),  // end is optional
        content: 'Trajectory C',
      }
    ];
  }
  getTimelineOptions() {
    return {
      width: '100%',
      height: '350px',
      stack: false,
      showMajorLabels: true,
      showCurrentTime: true,
      zoomMin: 1000000,
      type: 'background',
      format: {
        minorLabels: {
          minute: 'h:mma',
          hour: 'ha'
        }
      }
    };
  }
  render() {
    return (
      <div id="background">
        <Container id="page">
          <Row>
            <Col xs={12}>
              <Button id="showWork" variant={this.props.SHOW_WORK?"info":"secondary"} onClick={this.buttonClick}>{this.props.SHOW_WORK?"Show work": "Hide work"}</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="button-col">
              <Button id="showEducation" variant={this.props.SHOW_EDUCATION?"info":"secondary"} onClick={this.buttonClick}>{this.props.SHOW_EDUCATION?"Show education":"Hide education"}</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="button-col">
              <Button id="showProjects" variant={this.props.SHOW_PROJECTS?"info":"secondary"} onClick={this.buttonClick}>{this.props.SHOW_PROJECTS?"Show projects":"Hide projects"}</Button>
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