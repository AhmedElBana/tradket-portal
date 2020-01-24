import React, { Component } from 'react';
import { Alert, Col, Container, Table, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup,Label} from 'reactstrap';
import {auth} from '../../../tools/Auth';
import {dependencies} from '../../../tools/Dependencies';
import ReactPaginate from 'react-paginate';
import { AppSwitch } from '@coreui/react';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VButton from 'react-validation/build/button';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Staff.scss";
import permsObj from "./permsObj.json";
import successImg from "./../../../assets/img/success.png"

import Waiting from "./../../../views/Waiting/waiting";

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
  let password = document.getElementById("addPassword").value;
  if (!validator.equals(value,password)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {RePasswordNameError}
            </Alert>
          </div>;
  }
}
class Staff extends Component {
  constructor(props){
    super(props);
    this.state = {
        //users
        table: {
          headers: ["User name","Email","Phone Number","Active"]
        },
        usersTablePath: "/api/staff/list",
        integData: [],
        totalLength: 0,
        PageNumber: 0,
        PageSize: 10,
        usersWaiting: true,
        detailsWaiting:false,
        showUsersDetails: false,
        selectedUser: {},
        //add modal
        addStaffPath: "/api/staff/create",
        addModalWaiting: false,
        addModal: false,
        addModalError: false,
        addModalFaildMessage: "",
        addModalSuccess: false,
        addForm: {
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          perms: []
        },
        //public
        publicError: false,
        logout: false,
    };
    //list user
    this.requestUsers = this.requestUsers.bind(this);
    this.renderUsersBlock = this.renderUsersBlock.bind(this);
    this.userDetailsRef = React.createRef();
    //this.handelRowClick = this.handelRowClick.bind(this);
    this.renderUsersTable = this.renderUsersTable.bind(this);
    //this.renderUserDetails = this.renderUserDetails.bind(this);
    this.handleTablePageChange = this.handleTablePageChange.bind(this);
    this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
    //add user
    this.renderAddModal = this.renderAddModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.handleAddInputChange = this.handleAddInputChange.bind(this);
    this.handleAddPermsChange = this.handleAddPermsChange.bind(this);
    this.handleAddProductSubmit = this.handleAddProductSubmit.bind(this);
    this.addModalReset = this.addModalReset.bind(this);
    //validation
    this.oneOfMany = this.oneOfMany.bind(this);
    this.oneOfManyEdit = this.oneOfManyEdit.bind(this);

    this.loadDefaultData();
  }
  //validation
  oneOfMany = (value) => {
    if (this.state.addForm.perms.length === 0) {
      return <div className="simple-alert">
              <i className="fa fa-exclamation-circle"></i>
              <Alert color="danger">
                Please select one permission at least.
              </Alert>
            </div>;
    }
  };
  oneOfManyEdit = (value) => {
    if (this.state.editForm.perms.length === 0) {
      return <div className="simple-alert">
              <i className="fa fa-exclamation-circle"></i>
              <Alert color="danger">
                Please select one permission at least.
              </Alert>
            </div>;
    }
  }
  loadDefaultData(){
    //load first 10 records
    let startFilters = {
      "page": this.state.PageNumber + 1,
      "page_size": this.state.PageSize
    }
    this.requestUsers(startFilters);
  }
  handleTablePageChange(page) {
    this.setState({PageNumber: page.selected, usersWaiting: true, showUsersDetails: false},()=>{
      let filters = {
        page: this.state.PageNumber + 1,
        page_size: this.state.PageSize,
        token: auth.getMerchantToken()
      }
      this.requestUsers(filters);
    });
  }
  handleTableSizeChange(event){
    let maxPageNum = Math.ceil(this.state.totalLength/event.target.value) - 1;
    if(this.state.PageNumber > maxPageNum){
      this.setState({PageSize: event.target.value, PageNumber: maxPageNum, usersWaiting: true},()=>{
        let filters = {
          page: this.state.PageNumber + 1,
          page_size: this.state.PageSize,
          token: auth.getMerchantToken()
        }
        this.requestUsers(filters);
      });
    }else{
      this.setState({PageSize: event.target.value, usersWaiting: true},()=>{
        let filters = {
          page: this.state.PageNumber + 1,
          page_size: this.state.PageSize,
          token: auth.getMerchantToken()
        }
        this.requestUsers(filters);
      });
    }
  }
  requestUsers(filters){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
    },
      params: {
        ...this.state.currentFilters,
        ...filters
      }
    }
    httpClient.get(
        this.state.usersTablePath,
        config,
        (resp) => {
          let users = resp.data.data.result;
          console.log(resp.data)
          this.setState({usersData: users, totalLength: resp.data.data.total, usersWaiting: false},()=>{
          });
        },
        (error) => {
          if(error.response){
            if(error.response.status === 401){
              this.setState({logout: true});
            }else{
              this.setState({publicError: true});
            }
          }else{
            this.setState({publicError: true});
          }
        }
    )
  }
  renderUsersTable(){
    return(
      <div>
        <Table className="usersTable mainTable">
          <thead>
            <tr>
              {this.state.table.headers.map((ele,index)=>{
                return <th key={index}>{ele}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.usersData.map((ele,index)=>{
              return(
                <tr key={ele.id}>
                  <td>{ele.name}</td>
                  <td>{ele.email}</td>
                  <td>{ele.phoneNumber}</td>
                  <td>{dependencies.boolName(ele.active)}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
  renderUsersBlock(){
    return(
      <div>
        <Row>
          <div className="x_panel">
            <div className="x_title">
              <h2>Staff</h2>
              <div className="ButtonsDiv">
                {JSON.parse(localStorage.userData).permissions.includes("101")?
                  <button onClick={this.toggleAddModal} type="button" className="btn">
                    New Staff
                  </button>:null
                }
              </div>  
            </div>
            <div className="x_content">
              {this.state.usersWaiting?
                <Waiting height="605px" />
              : 
                <div className="">
                  <div className="tableLength">
                        <select className="tradket_select" onChange={this.handleTableSizeChange} value={this.state.PageSize}>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                    </div>
                      <div className="currentTableDiv">
                        {this.renderUsersTable()}
                      </div>
                      <ReactPaginate
                        pageCount={Math.ceil(this.state.totalLength/this.state.PageSize)}
                        marginPagesDisplayed={2}
                        onPageChange={this.handleTablePageChange}
                        forcePage={this.state.PageNumber}
                        containerClassName="paginationList"
                        nextLabel="Next"
                        previousLabel="Previous"
                      />
                </div>
              }
            </div>
          </div>
        </Row>
      </div>
    )
  }
  //add modal
  toggleAddModal(e){
    e.preventDefault();
    let addFormData = this.state.addForm;
    addFormData.email= "";
    addFormData.password= "";
    addFormData.confirmPassword = "";
    addFormData.perms= [];
    this.setState({
      addModal: !this.state.addModal,
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  handleAddInputChange(inputName,event){
    let addFormData = this.state.addForm;
    addFormData[inputName] = event.target.value;
    this.setState({addForm: addFormData},()=>{
    })
  }
  handleAddPermsChange(value){
    let addFormData = this.state.addForm;
    if(addFormData.perms.includes(value)){
      addFormData.perms.splice(addFormData.perms.indexOf(value), 1); 
    }else{
      addFormData.perms.push(value);
    }
    if(addFormData.perms.includes("101") || addFormData.perms.includes("102") || addFormData.perms.includes("103")){
      if(!addFormData.perms.includes("100")){
        addFormData.perms.push("100");
      }
    }
    if(addFormData.perms.includes("105") || addFormData.perms.includes("106") || addFormData.perms.includes("107")){
      if(!addFormData.perms.includes("104")){
        addFormData.perms.push("104");
      }
    }
    if(addFormData.perms.includes("109") || addFormData.perms.includes("110")){
      if(!addFormData.perms.includes("108")){
        addFormData.perms.push("108");
      }
    }
    if(addFormData.perms.includes("112") || addFormData.perms.includes("113") || addFormData.perms.includes("114")){
      if(!addFormData.perms.includes("111")){
        addFormData.perms.push("111");
      }
    }
    if(addFormData.perms.includes("116") || addFormData.perms.includes("117") || addFormData.perms.includes("118")){
      if(!addFormData.perms.includes("115")){
        addFormData.perms.push("115");
      }
    }
    if(addFormData.perms.includes("120") || addFormData.perms.includes("121") || addFormData.perms.includes("122")){
      if(!addFormData.perms.includes("119")){
        addFormData.perms.push("119");
      }
    }
    if(addFormData.perms.includes("124") || addFormData.perms.includes("125") || addFormData.perms.includes("126")){
      if(!addFormData.perms.includes("123")){
        addFormData.perms.push("123");
      }
    }
    if(addFormData.perms.includes("128") || addFormData.perms.includes("129") || addFormData.perms.includes("130")){
      if(!addFormData.perms.includes("127")){
        addFormData.perms.push("127");
      }
    }
    this.setState({addForm: addFormData},()=>{
      console.log(this.state.addForm)
    })
  }
  handleAddProductSubmit(event){
    //get form data
    let userObj = {
      "name": this.state.addForm.name,
      "email": this.state.addForm.email,
      "phoneNumber": this.state.addForm.phoneNumber,
      "password": this.state.addForm.password,
      "permissions": this.state.addForm.perms.join(),
      "branches": "test"
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({addModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.addStaffPath,
          config,
          userData,
          (resp) => {
            this.setState({addModalSuccess: true ,addModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
            });
          },
          (error) => {
            if(error.response){
              console.log(error.response)
              if(error.response.status === 401){
                this.setState({logout: true});
              }else if(error.response.status === 400){
                this.setState({addModalWaiting: false, addModalError: true, addModalFaildMessage: error.response.data.message});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
    });
    event.preventDefault();
  }
  addModalReset(e){
    e.preventDefault();
    let addFormData= this.state.addForm;
    // addFormData.email= "";
    // addFormData.password= "";
    // addFormData.confirmPassword = "";
    // addFormData.perms= [];
    this.setState({
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  renderAddModal(){
    return(
      <Modal className="usersModal modal-lg" isOpen={this.state.addModal} toggle={this.toggleAddModal}>
        <VForm onSubmit={this.handleAddProductSubmit} >
          <ModalHeader toggle={this.toggleAddModal}>
            <span className="fa fa-plus"></span>
            New Staff
          </ModalHeader>
          <ModalBody>
          {this.state.addModalError?
              <div>
                <Alert color="danger">
                  {this.state.addModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.addModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>your Staff has been created successfully.</p>
                </div>
              :
                <div >
                {this.state.addModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="name"
                            value={this.state.addForm.name}
                            onChange={(e) => this.handleAddInputChange("name", e)}
                            validations={[required, fullName]}
                            placeholder="Full Name"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="email"
                            value={this.state.addForm.email}
                            onChange={(e) => this.handleAddInputChange("email",e)}
                            validations={[required, email]} 
                            placeholder="Email"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="phoneNumber"
                            value={this.state.addForm.phoneNumber}
                            onChange={(e) => this.handleAddInputChange("phoneNumber",e)}
                            validations={[required, phoneNumber]} 
                            placeholder="phone Number"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="password" className="tradket_b_i"
                            id="addPassword"
                            autoComplete="off"
                            name="password"
                            value={this.state.addForm.password}
                            onChange={(e) => this.handleAddInputChange("password",e)}
                            validations={[required, Password]} 
                            placeholder="Staff password"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="password" className="tradket_b_i"
                            autoComplete="off"
                            name="confirmPassword"
                            value={this.state.addForm.confirmPassword}
                            onChange={(e) => this.handleAddInputChange("confirmPassword",e)}
                            validations={[required, RePassword]} 
                            placeholder="Confirm password"
                          />
                        </div>
                      </Col>
                    </Row>
                    <VInput type="hidden" validations={[this.oneOfMany]} />
                    <Row>
                        
                        <Col sm="12" className="inputeDiv">
                          <br/>
                          <Row className="perms_div">
                            {Object.keys(permsObj).map((key)=>{
                              return(
                                <Col key={key} sm="6" className="inputeDiv">
                                  <div className="perms_group">
                                    <div className="head">{key}</div>
                                    {permsObj[key].map((perm)=>{
                                      return(
                                        <FormGroup key={perm.id} >
                                          <AppSwitch className={'mx-1'} variant={'pill'} color={'info'}
                                            onChange={(e) => this.handleAddPermsChange(perm.id,e)}
                                            checked={this.state.addForm.perms.includes(perm.id)}
                                            disabled={
                                              (perm.id === "100"? 
                                                ((this.state.addForm.perms.includes("101") || this.state.addForm.perms.includes("102") || this.state.addForm.perms.includes("103"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "104"? 
                                                ((this.state.addForm.perms.includes("105") || this.state.addForm.perms.includes("106") || this.state.addForm.perms.includes("107"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "108"? 
                                                ((this.state.addForm.perms.includes("109") || this.state.addForm.perms.includes("110"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "111"? 
                                                ((this.state.addForm.perms.includes("112") || this.state.addForm.perms.includes("113") || this.state.addForm.perms.includes("114"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "115"? 
                                                ((this.state.addForm.perms.includes("116") || this.state.addForm.perms.includes("117") || this.state.addForm.perms.includes("118"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                                (perm.id === "119"? 
                                                  ((this.state.addForm.perms.includes("120") || this.state.addForm.perms.includes("121") || this.state.addForm.perms.includes("122"))? true: false) 
                                                : 
                                                  false) 
                                            ||
                                                (perm.id === "123"? 
                                                  ((this.state.addForm.perms.includes("124") || this.state.addForm.perms.includes("125") || this.state.addForm.perms.includes("126"))? true: false) 
                                                : 
                                                  false) 
                                            ||
                                                (perm.id === "127"? 
                                                  ((this.state.addForm.perms.includes("128") || this.state.addForm.perms.includes("129") || this.state.addForm.perms.includes("130"))? true: false) 
                                                : 
                                                  false) 
                                          }
                                            name={perm}
                                          />
                                          {perm.name}
                                        </FormGroup>
                                      )
                                    })}
                                  </div>
                                </Col>
                              )
                            })}
                          </Row>
                        </Col>
                      </Row>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          {this.state.addModalSuccess || this.state.addModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.addModalSuccess || this.state.addModalWaiting || this.state.addModalError?
                null
              : 
                <VButton className="btn btn-info">Add</VButton>
              }
              {this.state.addModalError?
                <button className="accept-btn btn btn-default" onClick={this.addModalReset}>Try again</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleAddModal}>Cancel</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  renderBody(){
    return(
      <div className="products-page">
        {this.state.publicError?
          <div scroll="no" className="mainErrorDiv">
            <Alert color="danger">
              Oops! Something went wrong. If this problem persists, please contact your service provider.
            </Alert>
          </div>
        :
          <div>
            {this.renderUsersBlock()}
            {this.renderAddModal()}
          </div>
        }
      </div>
    )
  }
  render() {
    return (
      this.state.logout?
        auth.logout()
      :
        this.renderBody()
    );
  }
}

export default Staff;
