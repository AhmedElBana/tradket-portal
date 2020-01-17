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
        email: "",
        firstEmail: true,
        password: "",
        firstPassword: true
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormValidate = this.handleFormValidate.bind(this);
    this.handleFormValidateChange = this.handleFormValidateChange.bind(this);
    this.removeFormErr = this.removeFormErr.bind(this);
    this.login = this.login.bind(this);
  }
  handleEmailChange(e){
    this.setState({email: e.target.value},()=>{
      if(!this.state.firstEmail){
        this.handleFormValidateChange("email")
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
    this.setState({email: e.target.value, error: false, errorMessage: ""});
  }
  handleFormValidate(field){
    //validation
    if(field === "email" && this.state.firstEmail){
      if(this.state.email === ""){
        this.setState({firstEmail: false, error: true, errorMessage: "Email field is required."})
      }else if(!validator.isEmail(this.state.email)){
        this.setState({firstEmail: false, error: true, errorMessage: "Please enter valid email."})
      }else{
        this.setState({firstEmail: false, error: false, errorMessage: ""})
      }
    }else if(field === "password" && this.state.firstPassword){
      if(this.state.password === ""){
        this.setState({firstPassword: false, error: true, errorMessage: "Password field is required."})
      }else if(this.state.password.length < 6){
        this.setState({firstPassword: false, error: true, errorMessage: "Password must be more than 6 letters."})
      }else{
        this.setState({firstPassword: false, error: false, errorMessage: ""})
      }
    }
  }
  handleFormValidateChange(field){
    //validation
    if(field === "email" && !this.state.firstEmail){
      if(this.state.email === ""){
        this.setState({error: true, errorMessage: "Email field is required."})
      }else if(!validator.isEmail(this.state.email)){
        this.setState({error: true, errorMessage: "Please enter valid email."})
      }else{
        this.setState({error: false, errorMessage: ""})
      }
    }else if(field === "password" && !this.state.firstPassword){
      if(this.state.password === ""){
        this.setState({error: true, errorMessage: "Password field is required."})
      }else if(this.state.password.length < 6){
        this.setState({error: true, errorMessage: "Password must be more than 6 letters."})
      }else{
        this.setState({error: false, errorMessage: ""})
      }
    }
  }
  login(){
    this.setState({waiting: true},()=>{
      //send request
      let dataObj = {
        "email": this.state.email,
        "password": this.state.password
      };
      let config = {
          headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
          }
      };
      let data = JSON.stringify(dataObj);
      httpClient.post(
          "/api/users/login",
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
                this.setState({waiting:false, error: true, errorMessage: "Email or password is wrong."});
              }else{
                this.setState({waiting:false, error: true, errorMessage: "Oops! Something went wrong. If this problem persists, please contact your service provider."});
              }
            }else{
              this.setState({waiting:false, error: true, errorMessage: "Oops! Something went wrong. If this problem persists, please contact your service provider."});
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
                  <p>LOG IN</p>
                </div>
                <div className="body">
                  {this.state.waiting?
                    <Waiting  height='190px'/>
                  :
                    <div>
                      <Input label="Email" type="email"
                        required
                        className="tradket_input"
                        floatingLabel={true} 
                        autoFocus={true}
                        value={this.state.email} 
                        onChange={this.handleEmailChange}
                        onBlur={()=> this.handleFormValidate("email")}
                      />
                      <Input label="Password" type="password" 
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
                    {this.state.email === "" || this.state.password === "" || this.state.error?
                      <button disabled className="btn">Log In</button>  
                    :
                      <button className="btn" onClick={this.login}>Log In</button>  
                    }
                    <div className="login-signup-forget">
                      <Row>
                        <Col xs="12" sm="6" md="6" lg="6" xl="6">
                          <a href="/portal/register">Not a member? Sign up</a>
                        </Col>
                        <Col xs="12" sm="6" md="6" lg="6" xl="6">
                          <a href="/portal/forget">I can't remember my password</a>
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
