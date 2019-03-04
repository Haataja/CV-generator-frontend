import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

export class Ribbon extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

  }

  handleSelect(eventKey) {
    console.log(eventKey);
  }

  render() {
    return (
      <div id="ribbon">
        <Nav variant='pills' onSelect={this.handleSelect}>
          <NavDropdown title='Document'>
            <NavDropdown.Item eventKey='1'>Edit CV</NavDropdown.Item>
            <NavDropdown.Item eventKey='2'>Print CV</NavDropdown.Item>
          </NavDropdown>
          <Nav.Item>
            <Nav.Link eventKey='3'>Timeline</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    );
  }
}

export default connect(data => data.Ribbon)(Ribbon);