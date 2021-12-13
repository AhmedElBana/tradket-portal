import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import {httpClient} from './../../../tools/HttpClient';
import LogoutHeader from "./../../../containers/DefaultLayout/LogoutHeader";

import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VButton from 'react-validation/build/button';
import validator from 'validator';
import successImg from "./../../../assets/img/success.png";
import "./Forget.scss";

import Waiting from "./../../../views/Waiting/waiting";

let requiredError = "هذا الحقل إجباري."
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
let emailError= "يرجي ادخال بريد الكتروني صحيح.";
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
let codeError= "Please enter valid verify code.";
const code = (value) => {
  var patt = new RegExp("^[0-9]*$");
  if (isNaN(value) || value.toString().trim().length !== 5 || !patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {codeError}
            </Alert>
          </div>;
  }
};
let PasswordNameError = <span>ادخل كلمة مرور اكثر صعوبة<br/> <b>ملاحظة</b>: ادخل حروف كبير و ارقام و علامات خاصة</span>
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
let RePasswordNameError = "يجب إدخال نفس كلمة المرور."
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

class Forget extends Component {
  constructor(props){
    super(props);
    this.state = {
        waiting: false,
        error: false,
        errorMessage: "",
        step: 1,
        form: {
          email: "",
          code: "",
          password: "",
          confirmPassword: "",
        }
    };
    this.renderStep1 = this.renderStep1.bind(this);
    this.requestCode = this.requestCode.bind(this);
    this.renderStep2 = this.renderStep2.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
    this.renderStep3 = this.renderStep3.bind(this);
    this.changepass = this.changepass.bind(this);
    this.renderStep4 = this.renderStep4.bind(this);
  }
  handleFormChange(field, e){
    let oldForm = this.state.form;
    oldForm[field] = e.target.value;
    this.setState({form: oldForm})
  }
  renderStep1(){
    return(
      <VForm onSubmit={this.requestCode}>
        <Col>
          <div className="tradketInputGroup">
            <VInput type="text" className="tradket_b_i"
              autoComplete="off"
              name="email"
              autoFocus={true}
              value={this.state.form.email}
              onChange={(e) => this.handleFormChange("email", e)}
              validations={[required, email]}
              placeholder="البريد الالكتروني"
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
        <VButton className="btn">التالي</VButton>  
      </VForm>
    )
  }
  requestCode(){
    this.setState({waiting: true},()=>{
      //send request
      let dataObj = {
        "email": this.state.form.email
      };
      let config = {
          headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
          }
      };
      let data = JSON.stringify(dataObj);
      httpClient.post(
          "/api/users/forgotpassword",
          config,
          data,
          (resp) => {
            this.setState({waiting:false, step: 2, error: false, errorMessage: ""})
          },
          (error) => {
            //end waiting and print error message
            if(error.response){
              if(error.response.status === 400){
                this.setState({waiting:false, error: true, errorMessage: error.response.data.message});
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
  renderStep2(){
    return(
      <VForm onSubmit={this.verifyCode}>
        <Col>
          <p className="verifyText">تم إرسال كود تحقق للبريد الالكتروني <br/> {this.state.form.email}</p>
          <div className="tradketInputGroup">
            <VInput type="text" className="tradket_b_i"
              autoComplete="off"
              name="code"
              autoFocus={true}
              value={this.state.form.code}
              onChange={(e) => this.handleFormChange("code", e)}
              validations={[required, code]}
              placeholder="كود التحقق"
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
        <VButton className="btn">تاكيد</VButton>  
      </VForm>
    )
  }
  verifyCode(){
    this.setState({waiting: true},()=>{
      //send request
      let dataObj = {
        "email": this.state.form.email,
        "code": this.state.form.code
      };
      let config = {
          headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
          }
      };
      let data = JSON.stringify(dataObj);
      httpClient.post(
          "/api/users/verifycode",
          config,
          data,
          (resp) => {
            this.setState({waiting:false, step: 3, token: resp.data.data.token, error: false, errorMessage: ""})
          },
          (error) => {
            //end waiting and print error message
            if(error.response){
              if(error.response.status === 400){
                this.setState({waiting:false, error: true, errorMessage: error.response.data.message});
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
  renderStep3(){
    return(
      <VForm onSubmit={this.changepass}>
        <Col>
          <div className="tradketInputGroup">
            <VInput type="password" className="tradket_b_i"
              id="Password"
              autoComplete="off"
              autoFocus={true}
              name="password"
              value={this.state.form.password}
              onChange={(e) => this.handleFormChange("password", e)}
              validations={[required, Password]}
              placeholder="كلمة المرور الجديدة"
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
              placeholder="تاكيد كلمة المرور"
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
        <VButton className="btn">تاكيد</VButton>  
      </VForm>
    )
  }
  changepass(){
    this.setState({waiting: true},()=>{
      //send request
      let dataObj = {
        "password": this.state.form.password
      };
      let config = {
          headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
              "x-auth": this.state.token
          }
      };
      let data = JSON.stringify(dataObj);
      httpClient.post(
          "/api/users/changepassword",
          config,
          data,
          (resp) => {
            this.setState({waiting:false, step: 4, error: false, errorMessage: ""})
          },
          (error) => {
            //end waiting and print error message
            if(error.response){
              if(error.response.status === 400){
                this.setState({waiting:false, error: true, errorMessage: error.response.data.message});
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
  renderStep4(){
    return(
      <div className="resetPasswordSuccesDiv">
        <img src={successImg} alt="succes"/>
        {/* <h1>Congratulations</h1> */}
        <p>تم تغير كلمة المرور بنجاح.</p>
        
        <div>
          <a href="/portal/login" className="btn">ابدا العمل</a>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="resetpass">
        <LogoutHeader />
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" md="9" lg="8" xl="7">
              <div className="tradket_model">
                {this.state.step === 4?
                  null
                :
                  <div className="head">
                    <p>اعادة تعين كلمة المرور</p>
                  </div>
                }
                <div className="body">
                  {this.state.waiting?
                    <Waiting  height='130px'/>
                  :
                    <div>
                      {this.state.step === 1?
                        this.renderStep1()
                      : 
                        null
                      }
                      {this.state.step === 2?
                        this.renderStep2()
                      : 
                        null
                      }
                      {this.state.step === 3?
                        this.renderStep3()
                      : 
                        null
                      }
                      {this.state.step === 4?
                        this.renderStep4()
                      : 
                        null
                      }
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

export default Forget;
