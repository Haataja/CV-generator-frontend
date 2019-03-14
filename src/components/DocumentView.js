import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from "../actions/DocumentActions";

class DocumentView extends Component {
  render() {
    return null;
  }
}

export default connect(data => data.Document)(DocumentView);
