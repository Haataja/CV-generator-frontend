import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from "../actions/DocumentActions";

class Document extends Component {
  render() {
    return null;
  }
}

export default connect(data => data.Document)(Document);
