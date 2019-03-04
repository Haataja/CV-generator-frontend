import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from "react-bootstrap/Nav";
import NavBar from 'react-bootstrap/Navbar';
import NavDropdown from "react-bootstrap/NavDropdown";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import finnish_flag from './images/finnish_placeholder.png'
import british_flag from './images/british_placeholder.png'
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavbarToggle from "react-bootstrap/NavbarToggle";

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
        break;
      case '5':
        console.log('Language to Finnish');
        break;

    }
    console.log(eventKey);
  }

  render() {
    return (
      <div id="ribbon">
        <NavBar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <NavbarBrand className="brand-cv-generator">CV-generator</NavbarBrand>
          <NavbarToggle aria-controls="responsive-navbar-nav"/>
          <NavbarCollapse>
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
                  <img className="Flag" src={british_flag} width={50} height={30} alt="Logo English" />
                  English
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey='5'>
                  <img className="Flag"  src={finnish_flag} width={50} height={30} alt="Logo Finnish" />
                  Finnish
                </Nav.Link>
              </Nav.Item>
            </Nav>

          </NavbarCollapse>
        </NavBar>
      </div>
    );
  }
}

export default connect(data => data.Ribbon)(Ribbon);