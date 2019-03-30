import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Nav, Navbar, NavDropdown, NavbarBrand} from 'react-bootstrap';

import * as actions from '../actions/RibbonActions';
import locale from '../locales';

import './Ribbon.css';

class Ribbon extends Component {
  constructor(props) {
    super(props);

    this.switchLanguage = this.switchLanguage.bind(this);
    this.login = this.login.bind(this);
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

  static handleSelect(eventKey) {
    if(eventKey === "publish") {
      window.location.href = "http://localhost:8080/api/pdf"
    } else {
      window.location.hash = `/${eventKey}`;
    }
  }

  login() {
    return <button className="btn btn-light" id="login_button">Login</button>
  }

  render() {
    return (
      <div id="ribbon">
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
          <NavbarBrand className="brand-cv-generator">CV-generator</NavbarBrand>
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
                {this.login()}
              </Nav.Item>
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
}

export default connect(data => data.Ribbon)(Ribbon);
