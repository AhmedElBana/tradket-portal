import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import LogoutHeader from "./../../../containers/DefaultLayout/LogoutHeader";
import './Website.scss';
import Logo from "./../../../assets/img/brand/logo.png";

class Login extends Component {
  render() {
    return (
      <div className="website-page">
        <LogoutHeader />
        <img className="logoImg" src={Logo} alt="logo" />
      </div>
    );
  }
}

export default Login;
