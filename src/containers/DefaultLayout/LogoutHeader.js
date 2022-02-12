import React, { Component } from 'react';
import logo from '../../assets/img/brand/logo.png'

class LogoutHeader extends Component {
  render() {
    return (
      <div className="LogoutHeader">
        <a href="/">
          <img className="logo" alt="logo" src={logo} />
        </a>
        <div className="btns_div">
          {window.location.pathname !== "/portal/login"?
            <a href="/portal/login" className="btn_w">تسجيل دخول</a>
          :
            null
          }
          {/* {window.location.pathname !== "/portal/register"?
            <a href="/portal/register" className="btn_w">حساب جديد</a>
          :
            null
          }*/}
        </div>
      </div>
    );
  }
}

export default LogoutHeader;
