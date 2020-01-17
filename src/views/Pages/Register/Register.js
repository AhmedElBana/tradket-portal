import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import LogoutHeader from "./../../../containers/DefaultLayout/LogoutHeader";

import {httpClient} from './../../../tools/HttpClient';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
// import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import validator from 'validator';
import Waiting from "./../../../views/Waiting/waiting";
import successImg from "./../../../assets/img/success.png"
import './Register.css';

let requiredError = "This field is required."
const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {requiredError}
            </Alert>
          </div>;
  }
};
let fullNameError = "Please enter your full name."
const fullName = (value) => {
  var patt = new RegExp("[a-zA-Zا-ى]+ [a-zA-Zا-ى]+");
  if (!patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {fullNameError}
            </Alert>
          </div>;
  }
};
let phoneNameError = "Please enter valid phone number  (11 number)."
const phoneNumber = (value) => {
  var patt = new RegExp("^(01)([0-9]*)$");
  if (isNaN(value) || value.toString().trim().length !== 11 || !patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {phoneNameError}
            </Alert>
          </div>;
  }
}
let storePhoneNumberError = "Please enter more than 5 numbers."
const storePhoneNumber = (value) => {
  var patt = new RegExp("^[0-9]*$");
  if (isNaN(value) || value.toString().trim().length < 5 || !patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {storePhoneNumberError}
            </Alert>
          </div>;
  }
}
let emailError= "Please enter valid email.";
const email = (value) => {
  if (!validator.isEmail(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {emailError}
            </Alert>
          </div>;
  }
};
// Password validation
let PasswordNameError = <span>Please add more difficulty to your password.<br/> <b>Hint</b>: add special characters, numbers and capital letters.</span>
const Password = (value) => {
  var patt = new RegExp("^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20})$");
  if (!patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {PasswordNameError}
            </Alert>
          </div>;
  }
}
let RePasswordNameError = "Please enter the same password as above."
const RePassword = (value) => {
  let password = document.getElementById("Password").value;
  if (!validator.equals(value,password)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {RePasswordNameError}
            </Alert>
          </div>;
  }
}

class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
        waiting: false,
        error: false,
        errorMessage: "",
        succes: false,
        form: {
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          storeName: "",
          storePhoneNumber: ""
        }
    };
    this.handleFormChange = this.handleFormChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }
  handleFormChange(fieldName ,e){
    let oldStateForm = this.state.form;
    oldStateForm[fieldName] = e.target.value;
    this.setState({form: oldStateForm},()=>{
      console.log(this.state)
    });
  }
  signUp(){
    this.setState({waiting: true},()=>{
      //send request
      let dataObj = {
          "name": this.state.form.name,
          "email": this.state.form.email,
          "phoneNumber": this.state.form.phoneNumber,
          "password": this.state.form.password,
          "language": "en",
          "storeName": this.state.form.storeName,
          "storePhoneNumber": this.state.form.storePhoneNumber
      };
      let config = {
          headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
          }
      };
      let data = JSON.stringify(dataObj);
      httpClient.post(
          "/api/users/admin/create",
          config,
          data,
          (resp) => {
            console.log(resp.data)
            localStorage.token = resp.data.data.token;
            localStorage.userData = JSON.stringify(resp.data.data.userData);
            //window.location.reload();
            this.setState({waiting: false, succes: true})
          },
          (error) => {
            //end waiting and print error message
            if(error.response){
              if(error.response.status === 400){
                this.setState({waiting:false, error: true, errorMessage: error.response.data.message});
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
      <div>
        <LogoutHeader />
        <div className="signup">
          <Container>
            <Row className="justify-content-center">
              <Col xs="12" md="9" lg="8" xl="7">
                <div className="tradket_model">
                  {this.state.succes?
                    null
                  :
                    <div className="head">
                      <p>Sign Up</p>
                    </div>
                  }
                  <div className="body">
                    {this.state.waiting?
                      <Waiting  height='440px'/>
                    : 
                      <div>
                        {this.state.succes?
                          <div className="singupSuccesDiv">
                            <img src={successImg} alt="succes"/>
                            <h1>Congratulations</h1>
                            <p>your account has been created successfully.<br/> now you can start managing <br/> your whole business.</p>
                            
                            <div>
                              <a href="/portal" className="btn">Get Start</a>
                            </div>
                          </div>
                        :
                          <VForm onSubmit={this.signUp}>
                            <Col>
                              <div className="tradketInputGroup">
                                <VInput type="text" className="tradket_b_i"
                                  autoComplete="off"
                                  autoFocus={true}
                                  name="name"
                                  value={this.state.form.name}
                                  onChange={(e) => this.handleFormChange("name", e)}
                                  validations={[required, fullName]}
                                  placeholder="Full Name"
                                />
                              </div>
                              <div className="tradketInputGroup">
                                <VInput type="text" className="tradket_b_i"
                                  autoComplete="off"
                                  name="storeName"
                                  value={this.state.form.storeName}
                                  onChange={(e) => this.handleFormChange("storeName", e)}
                                  validations={[required]}
                                  placeholder="Business Name"
                                />
                              </div>
                              <div className="tradketInputGroup">
                                <VInput type="text" className="tradket_b_i"
                                  autoComplete="off"
                                  name="email"
                                  value={this.state.form.email}
                                  onChange={(e) => this.handleFormChange("email", e)}
                                  validations={[required, email]}
                                  placeholder="Email"
                                />
                              </div>
                              <div className="tradketInputGroup">
                                <VInput type="text" className="tradket_b_i"
                                  autoComplete="off"
                                  name="phoneNumber"
                                  value={this.state.form.phoneNumber}
                                  onChange={(e) => this.handleFormChange("phoneNumber", e)}
                                  validations={[required, phoneNumber]}
                                  placeholder="Phone Number"
                                />
                              </div>
                              <div className="tradketInputGroup">
                                <VInput type="text" className="tradket_b_i"
                                  autoComplete="off"
                                  name="storePhoneNumber"
                                  value={this.state.form.storePhoneNumber}
                                  onChange={(e) => this.handleFormChange("storePhoneNumber", e)}
                                  validations={[required, storePhoneNumber]}
                                  placeholder="Business Phone Number"
                                />
                              </div>
                              <div className="tradketInputGroup">
                                <VInput type="password" className="tradket_b_i"
                                  id="Password"
                                  autoComplete="off"
                                  name="password"
                                  value={this.state.form.password}
                                  onChange={(e) => this.handleFormChange("password", e)}
                                  validations={[required, Password]}
                                  placeholder="Password"
                                />
                              </div>
                              <div className="tradketInputGroup">
                                <VInput type="password" className="tradket_b_i"
                                  id="confirmPassword"
                                  autoComplete="off"
                                  name="confirmPassword"
                                  value={this.state.form.confirmPassword}
                                  onChange={(e) => this.handleFormChange("confirmPassword", e)}
                                  validations={[required, RePassword]}
                                  placeholder="Confirm Password"
                                />
                              </div>
                            </Col>
                          {this.state.error?
                            <Col>
                              <div className="tradketInputGroup">
                                <Alert color="danger">{this.state.errorMessage}</Alert>
                              </div>                      
                            </Col>
                          : 
                            null
                          }
                          <br/>
                          <VButton className="btn" onClick={this.login}>Sign Up</VButton>  
                          <div>
                            <br/>
                            <Row className="justify-content-center">
                              <Col xs="12" sm="6" md="6" lg="6" xl="6">
                                <a href="/portal/login">Do you have an account? LOG IN</a>
                              </Col>
                            </Row>
                          </div>
                        </VForm>
                        }
                      </div>
                    }         
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Register;
