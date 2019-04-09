import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Nav, Navbar, NavDropdown} from 'react-bootstrap';

import * as actions from '../actions/RibbonActions';
import locale from '../locales';

import './Ribbon.css';

class Ribbon extends Component {
  constructor(props) {
    super(props);

    this.switchLanguage = this.switchLanguage.bind(this);
    this.getLocalizedString = locale.getLocalizedString.bind(props.GLOBAL_LANGUAGE);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.GLOBAL_LANGUAGE !== nextProps.GLOBAL_LANGUAGE) {
      this.getLocalizedString = locale.getLocalizedString.bind(nextProps.GLOBAL_LANGUAGE);
    }
  }

  switchLanguage() {
    const language = locale.getNeighbourLanguage(this.props.GLOBAL_LANGUAGE, locale.GLOBAL_ID);

    this.props.dispatch(actions.global.setLanguage(language));
  }

  render() {
    return (
      <div id="ribbon">
        <Navbar fixed="top" expand="md" bg="dark" variant="dark">
          <Navbar.Brand>CV-generator</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" onSelect={Ribbon.handleSelect}>
              <NavDropdown title={this.getLocalizedString(locale.RIBBON_MENU_EDITOR)}>
                <NavDropdown.Item eventKey="editor">
                  {this.getLocalizedString(locale.RIBBON_EDIT_DOCUMENT)}
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="publish">
                  {this.getLocalizedString(locale.RIBBON_PUBLISH_DOCUMENT)}
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Item>
                <Nav.Link eventKey="timeline">
                  {this.getLocalizedString(locale.RIBBON_MENU_TIMELINE)}
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Nav onSelect={this.switchLanguage}>
              <Nav.Item>
                <Nav.Link eventKey="language" active>
                  {locale.getNeighbourLanguage(this.props.GLOBAL_LANGUAGE, locale.GLOBAL_TOGGLE_LANGUAGE)}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }

  static handleSelect(eventKey) {
    let origin = window.location.origin;

    if (process.env.NODE_ENV === 'development') {
      origin = origin.replace(/:\d+$/, ':8080');
    }

    if(eventKey === 'publish') {
      window.location.href = `${origin}/api/pdf`;
    } else {
      window.location.href = `${origin}/#/${eventKey}`;
    }
  }
}

export default connect(data => data.Ribbon)(Ribbon);
