import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Home.scss";

import Waiting from "./../../../views/Waiting/waiting";


class Home extends Component {
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
      <div className="Home">
        <Row>
          Home
        </Row>
      </div>
    );
  }
}

export default Home;
