import React, {Component} from 'react';
import {connect} from "react-redux";

import {Container, Col, Row} from 'react-bootstrap';
import {HashRouter, Route, Switch} from 'react-router-dom';

import DocumentView from './DocumentView';
import TimelineView from './TimelineView';
import Ribbon from './Ribbon';

import * as actions from '../actions';

import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);

    this.origin = window.location.origin;
    if (process.env.NODE_ENV === 'development') {
      this.origin = this.origin.replace(/:\d+$/, ':8080');
    }
  }

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

  componentDidMount() {
    const processResponse = response => {
      if (response.ok) {
        return response.json();
      }

      // No content or unauthorized
      return {};
    };

    this.props.dispatch((dispatch) => {
      fetch(`${this.origin}/api/get/user`)
        .then(response => processResponse(response))
        .then((data) => dispatch(actions.saveData(data)));
    });
  }
}

export default connect(data => data)(App);
