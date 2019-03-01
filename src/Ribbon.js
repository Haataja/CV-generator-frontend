import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

import './Ribbon.css'

class Ribbon extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
    }

    render() {
        return (

        <div>
            <ButtonToolbar/>
                <Button variant="primary">Document</Button>
            <ButtonToolbar/>
        </div>

        );
    }
}

export default Ribbon;