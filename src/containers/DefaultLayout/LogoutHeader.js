import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/brand/logo.png'

class LogoutHeader extends Component {
  render() {
    console.log(window.location)
    return (
      <div className="LogoutHeader">
        <a href="/">
          <img className="logo" alt="logo" src={logo} />
        </a>
        <div className="btns_div">
          {window.location.pathname != "/portal/login"?
            <a href="/portal/login" className="btn_w">Log In</a>
          :
            null
          }
          {window.location.pathname != "/portal/register"?
            <a href="/portal/register" className="btn_w">Sign Up</a>
          :
            null
          }          
        </div>
      </div>
    );
  }
}

export default LogoutHeader;
