import React, {Component} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import {HashRouter, Route, Switch} from 'react-router-dom';

import DocumentView from './DocumentView';
import TimelineView from './TimelineView';
import Ribbon from './Ribbon';

import './App.css';

export default class App extends Component {
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
              <Switch>
                <Route path="/timeline" component={TimelineView}/>
                <Route path="/" component={DocumentView}/>
              </Switch>
            </Col>
          </Row>
        </Container>
      </HashRouter>
    );
  }
}
