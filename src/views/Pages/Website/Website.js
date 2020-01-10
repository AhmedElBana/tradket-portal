import React, { Component } from 'react';
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
