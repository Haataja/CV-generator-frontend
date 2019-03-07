import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Col, Container, Row} from "react-bootstrap";
import './Timeline.css';


export class Timeline extends Component {
  render() {
    return (
      <div id="background">
        <Container id="page">

        </Container>
      </div>
    );
  }
}

export default connect(data => data.Timeline)(Timeline);