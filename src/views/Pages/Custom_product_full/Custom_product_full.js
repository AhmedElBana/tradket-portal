import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Custom_product_full.scss";

import Waiting from "./../../../views/Waiting/waiting";


class Custom_product_full extends Component {
  constructor(props){
    super(props);
    this.state = {
        waiting: false,
        error: false,
        errorMessage: "",
    };
  }
  
  render() {
    return (
      <div className="Custom_product_full">
        <Row>
          Custom_product_full {this.props.match.params.id}
        </Row>
      </div>
    );
  }
}

export default Custom_product_full;
