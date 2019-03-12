import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from "../actions/RibbonActions";

class Ribbon extends Component {
  render() {
    return null;
  }
}

export default connect(data => data.Ribbon)(Ribbon);
