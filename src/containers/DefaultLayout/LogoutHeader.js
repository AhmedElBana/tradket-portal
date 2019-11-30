import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/brand/logo.png'

class LogoutHeader extends Component {
  render() {
    return (
      <div className="LogoutHeader">
        <a href="/">
          <img className="logo" alt="logo" src={logo} />
        </a>
        <div className="btns_div">
          <a href="/portal/login" className="btn_b">Log In</a>
          <a href="/portal/register" className="btn_w">Sign Up</a>
        </div>
      </div>
    );
  }
}

export default LogoutHeader;
