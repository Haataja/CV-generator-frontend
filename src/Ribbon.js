import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

class Ribbon extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
    }

    render() {
        return <div>
            <h1>This is a test</h1>
        </div>
    }
}

export default Ribbon;