import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import LogoutHeader from "./../../../containers/DefaultLayout/LogoutHeader";
import validator from 'validator';
import "./Login.scss";

import Waiting from "./../../../views/Waiting/waiting";


class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
        waiting: false,
        error: false,
        errorMessage: "",
        identifier: "",
        firstIdentifier: true,
        password: "",
        firstPassword: true
    };
    this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormValidate = this.handleFormValidate.bind(this);
    this.handleFormValidateChange = this.handleFormValidateChange.bind(this);
    this.removeFormErr = this.removeFormErr.bind(this);
    this.login = this.login.bind(this);
  }
  handleIdentifierChange(e){
    this.setState({identifier: e.target.value},()=>{
      if(!this.state.firstIdentifier){
        this.handleFormValidateChange("identifier")
      }
    });
  }
  handlePasswordChange(e){
    this.setState({password: e.target.value},()=>{
      if(!this.state.firstPassword){
        this.handleFormValidateChange("password")
      }
    });
  }
  removeFormErr(e){
    this.setState({identifier: e.target.value, error: false, errorMessage: ""});
  }
  handleFormValidate(field){
    var patt = new RegExp("^(01)([0-9]*)$");
    //validation
    if(field === "identifier" && this.state.firstIdentifier){
      if(this.state.identifier === ""){
        this.setState({firstIdentifier: false, error: true, errorMessage: "يجب إدخال رقم الهاتف او البريد الالكتروني"})
      }else if((!validator.isEmail(this.state.identifier)) && (isNaN(this.state.identifier) || this.state.identifier.toString().trim().length !== 11 || !patt.test(this.state.identifier))){
        this.setState({firstIdentifier: false, error: true, errorMessage: "يرجي ادخال رقم هاتف او بريد الكتروني صحيح."})
      }else{
        this.setState({firstIdentifier: false, error: false, errorMessage: ""})
      }
    }else if(field === "password" && this.state.firstPassword){
      if(this.state.password === ""){
        this.setState({firstPassword: false, error: true, errorMessage: "يجب إدخال كلمة المرور."})
      }else if(this.state.password.length < 6){
        this.setState({firstPassword: false, error: true, errorMessage: "كلمة المرور يجب ان تكون اكبر من ٦ حروف."})
      }else{
        this.setState({firstPassword: false, error: false, errorMessage: ""})
      }
    }
  }
  handleFormValidateChange(field){
    var patt = new RegExp("^(01)([0-9]*)$");
    //validation
    if(field === "identifier" && !this.state.firstIdentifier){
      if(this.state.identifier === ""){
        this.setState({error: true, errorMessage: "يجب إدخال رقم الهاتف او البريد الالكتروني"})
      }else if((!validator.isEmail(this.state.identifier)) && (isNaN(this.state.identifier) || this.state.identifier.toString().trim().length !== 11 || !patt.test(this.state.identifier))){
        this.setState({error: true, errorMessage: "يرجي ادخال رقم هاتف او بريد الكتروني صحيح."})
      }else{
        this.setState({error: false, errorMessage: ""})
      }
    }else if(field === "password" && !this.state.firstPassword){
      if(this.state.password === ""){
        this.setState({error: true, errorMessage: "يجب إدخال كلمة المرور."})
      }else if(this.state.password.length < 6){
        this.setState({error: true, errorMessage: "كلمة المرور يجب ان تكون اكبر من ٦ حروف."})
      }else{
        this.setState({error: false, errorMessage: ""})
      }
    }
  }
  login(){
    this.setState({waiting: true},()=>{
      //send request
      let dataObj = {
        "identifier": this.state.identifier,
        "password": this.state.password
      };
      let config = {
          headers: {
              //"Cache-Control": "no-cache",
              "Content-Type": "application/json",
          }
      };
      let data = JSON.stringify(dataObj);
      httpClient.post(
          "/api/users/login_v2",
          config,
          data,
          (resp) => {
            localStorage.token = resp.data.data.token;
            localStorage.userData = JSON.stringify(resp.data.data.userData);
            window.location.reload();
          },
          (error) => {
            //end waiting and print error message
            if(error.response){
              if(error.response.status === 401){
                this.setState({waiting:false, error: true, errorMessage: "بيانات غير صحيحة."});
              }else{
                this.setState({waiting:false, error: true, errorMessage: "حدث خطا ما ، يرجي المحاوله في وقت لاحق."});
              }
            }else{
              this.setState({waiting:false, error: true, errorMessage: "حدث خطا ما ، يرجي المحاوله في وقت لاحق."});
            }
          }
      );
    });
  }
  render() {
    return (
      <div className="Login">
        <LogoutHeader />
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" md="9" lg="8" xl="7">
              <div className="tradket_model">
                <div className="head">
                  <p>تسجيل دخول</p>
                </div>
                <div className="body">
                  {this.state.waiting?
                    <Waiting  height='190px'/>
                  :
                    <div>
                      <Input label="رقم الهاتف او البريد الالكتروني" type="identifier"
                        required
                        className="tradket_input"
                        floatingLabel={true} 
                        autoFocus={true}
                        value={this.state.identifier} 
                        onChange={this.handleIdentifierChange}
                        onBlur={()=> this.handleFormValidate("identifier")}
                      />
                      <Input label="كلمة المرور" type="password" 
                        required
                        minLength={6}
                        className="tradket_input"
                        floatingLabel={true}
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        onBlur={()=> this.handleFormValidate("password")}
                      />  
                      {this.state.error?
                      <Alert color="danger" className="sm_alert" >{this.state.errorMessage}</Alert>
                    : 
                      null
                    }
                    <br/>
                    {this.state.identifier === "" || this.state.password === "" || this.state.error?
                      <button disabled className="btn">تسجيل دخول</button>  
                    :
                      <button className="btn" onClick={this.login}>تسجيل دخول</button>  
                    }
                    <div className="login-signup-forget">
                      <Row>
                        <Col xs="12" sm="6" md="6" lg="6" xl="6">
                          <a href="/portal/register">حساب جديد</a>
                        </Col>
                        <Col xs="12" sm="6" md="6" lg="6" xl="6">
                          <a href="/portal/forget">نسيت كلمة المرور</a>
                        </Col>
                      </Row>
                    </div>
                    </div>
                  }         
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
