import React, {Component} from 'react';
import {Container, Col, Row} from 'react-bootstrap';

import TimelineView from "./TimelineView";
import Ribbon from "./Ribbon";

import './App.css';
import DocumentView from "./DocumentView";
import {HashRouter, Route} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Container fluid={true}>
          <Row>
              <Col xs={12}>
                  <Ribbon/>
              </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Route path="/timeline" component={TimelineView}/>
              <Route path="/" component={DocumentView}/>
            </Col>
          </Row>
        </Container>
      </HashRouter>
    );
  }
}

export default App;
