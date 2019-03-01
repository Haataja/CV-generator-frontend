import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Document extends Component {
  render() {
    return null;
  }
}

export default connect(data => data.Document)(Document);