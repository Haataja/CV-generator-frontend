import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Nav, Navbar, NavDropdown, NavbarBrand} from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavbarToggle from "react-bootstrap/NavbarToggle";

import finnish_flag from './images/finnish_placeholder.png'
import british_flag from './images/british_placeholder.png'

import * as actions from '../actions'

import './Ribbon.css'

export class Ribbon extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    switch (eventKey) {
      case '1':
        console.log('Edit CV');
        break;
      case '2':
        console.log('Print CV');
        break;
      case '3':
        console.log('Timeline');
        break;
      case '4':
        console.log('Language to English');
        this.props.dispatch(actions.setLanguage('en'));
        break;
      case '5':
        console.log('Language to Finnish');
        this.props.dispatch(actions.setLanguage('fi'));
        break;

    }
    console.log(eventKey);
  }

  render() {
    return (
      <div id="ribbon">
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
          <NavbarBrand className="brand-cv-generator">CV-generator</NavbarBrand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" onSelect={this.handleSelect}>
              <NavDropdown title='Document'>
                <NavDropdown.Item eventKey='1'>Edit CV</NavDropdown.Item>
                <NavDropdown.Item eventKey='2'>Print CV</NavDropdown.Item>
              </NavDropdown>
              <Nav.Item>
                <Nav.Link eventKey='3'>Timeline</Nav.Link>
              </Nav.Item>
            </Nav>

            <Nav onSelect={this.handleSelect}>

              <Nav.Item>
                <Nav.Link eventKey='4'>
                  English
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey='5'>
                  Finnish
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
