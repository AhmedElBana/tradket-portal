import React, { Component } from 'react';
import { Alert, Col, Input, Table, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup,Label} from 'reactstrap';
import {auth} from '../../../tools/Auth';
import {dependencies} from '../../../tools/Dependencies';
import ReactPaginate from 'react-paginate';
import { AppSwitch } from '@coreui/react';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VButton from 'react-validation/build/button';
import 'react-widgets/dist/css/react-widgets.css';
import Multiselect from 'react-widgets/lib/Multiselect';
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
  if (value != "" && !patt.test(value)) {
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
  if (value != "" && !validator.equals(value,password)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {RePasswordNameError}
            </Alert>
          </div>;
  }
}
const editRePassword = (value) => {
  let password = document.getElementById("editPassword").value;
  if (value != "" && !validator.equals(value,password)) {
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
          headers: ["User name","Email","Phone Number","Branches","Active"]
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
        branches: [],
        addForm: {
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          branches: [],
          perms: []
        },
        //edit modal
        editPath: "/api/staff/edit",
        editModalWaiting: false,
        editModal: false,
        editModalError: false,
        editModalFaildMessage: "",
        editModalSuccess: false,
        editBranches: [],
        editForm: {
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          branches: [],
          perms: []
        },
        //deactivate modal
        deactivateModalWaiting: false,
        deactivateModal: false,
        deactivateModalError: false,
        deactivateModalFaildMessage: "",
        deactivateModalSuccess: false,
        //activate modal
        activateModalWaiting: false,
        activateModal: false,
        activateModalError: false,
        activateModalFaildMessage: "",
        activateModalSuccess: false,
        //branches
        brancesLoaded: false,
        fullBranchs: [],
        //public
        publicError: false,
        logout: false,
    };
    //list user
    this.requestUsers = this.requestUsers.bind(this);
    this.renderUsersBlock = this.renderUsersBlock.bind(this);
    this.userDetailsRef = React.createRef();
    this.handelRowClick = this.handelRowClick.bind(this);
    this.renderUsersTable = this.renderUsersTable.bind(this);
    this.renderUserDetails = this.renderUserDetails.bind(this);
    this.handleTablePageChange = this.handleTablePageChange.bind(this);
    this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
    //add user
    this.renderAddModal = this.renderAddModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.handleAddInputChange = this.handleAddInputChange.bind(this);
    this.handleAddPermsChange = this.handleAddPermsChange.bind(this);
    this.handleAddProductSubmit = this.handleAddProductSubmit.bind(this);
    this.addModalReset = this.addModalReset.bind(this);
    this.onSelectBranchAddForm = this.onSelectBranchAddForm.bind(this);
    //edit user
    this.renderEditModal = this.renderEditModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.handleEditInputChange = this.handleEditInputChange.bind(this);
    this.handleEditPermsChange = this.handleEditPermsChange.bind(this);
    this.handleEditUserSubmit = this.handleEditUserSubmit.bind(this);
    this.editModalReset = this.editModalReset.bind(this);
    this.onSelectBranchEditForm = this.onSelectBranchEditForm.bind(this);
    //deactivate modal
    this.renderDeactivateModal = this.renderDeactivateModal.bind(this);
    this.toggleDeactivateModal = this.toggleDeactivateModal.bind(this);
    this.handleDeactivateUserSubmit = this.handleDeactivateUserSubmit.bind(this);
    this.DeactivateModalReset = this.DeactivateModalReset.bind(this);
    //activate modal
    this.renderActivateModal = this.renderActivateModal.bind(this);
    this.toggleActivateModal = this.toggleActivateModal.bind(this);
    this.handleActivateUserSubmit = this.handleActivateUserSubmit.bind(this);
    this.ActivateModalReset = this.ActivateModalReset.bind(this);
    //validation
    this.oneOfMany = this.oneOfMany.bind(this);
    this.oneOfManyEdit = this.oneOfManyEdit.bind(this);


    this.requestBranches = this.requestBranches.bind(this); 
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
    this.requestBranches();
  }
  requestBranches(){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "page_size": "1000"
      }
    }
    httpClient.get(
        "/api/branch/list",
        config,
        (resp) => {
          console.log(resp.data.data.result)
          let branches = [];
          resp.data.data.result.map((branch)=>{
            branches.push({"id": branch._id, "name": branch.name})
          })
          this.setState({branches: branches, fullBranchs: resp.data.data.result, brancesLoaded: true},()=>{
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
                <tr key={ele.id}  onClick={()=> this.handelRowClick(ele,index)} className={this.state.showUserDetails && (ele._id == this.state.selectedUser._id)? "selectedRow": ""}>
                  <td>{ele.name}</td>
                  <td>{ele.email}</td>
                  <td>{ele.phoneNumber}</td>
                  <td>{dependencies.branchesName(ele.branches, this.state.fullBranchs).map((name)=>{
                    return(<span className="table_block">{name}</span>)
                  })}</td>
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
                {JSON.parse(localStorage.userData).permissions.includes("101") && this.state.brancesLoaded?
                  <button onClick={this.toggleAddModal} type="button" className="btn">
                    New Staff
                  </button>:null
                }
              </div>  
            </div>
            <div className="x_content">
              {this.state.usersWaiting || !this.state.brancesLoaded?
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
        {this.state.showUserDetails?
          this.renderUserDetails()
        :
          null
        }
      </div>
    )
  }
  //add modal
  toggleAddModal(e){
    e.preventDefault();
    let addFormData = this.state.addForm;
    addFormData.name= "";
    addFormData.email= "";
    addFormData.phoneNumber= "";
    addFormData.password= "";
    addFormData.confirmPassword = "";
    addFormData.branches= [];
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
  onSelectBranchAddForm(optionsList) {
    console.log(optionsList)
    let addForm = this.state.addForm;
    let optionsArr = [];
    optionsList.map((ele)=>{
      optionsArr.push(ele.id)
    })
    addForm.branches = optionsArr;
    this.setState({addForm: addForm},()=>{
      console.log(this.state.addForm.branches)
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
    //custom
    if(addFormData.perms.includes("101") || addFormData.perms.includes("101") || addFormData.perms.includes("102") || addFormData.perms.includes("103")){
      if(!addFormData.perms.includes("104")){
        addFormData.perms.push("104");
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
      "branches": this.state.addForm.branches.join()
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
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                        <Multiselect
                          data={this.state.branches}
                          valueField='id'
                          textField='name'
                          placeholder="Staff Branches"
                          onChange={this.onSelectBranchAddForm}
                          required
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
                                                (this.state.addForm.perms.includes("100") || (this.state.addForm.perms.includes("101") || this.state.addForm.perms.includes("102") || this.state.addForm.perms.includes("103") || this.state.addForm.perms.includes("105") || this.state.addForm.perms.includes("106") || this.state.addForm.perms.includes("107"))? true: false) 
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
                <span>
                  {this.state.addForm.branches.length === 0?
                    <button disabled className="btn btn-info">Add</button>
                  :
                    <VButton className="btn btn-info">Add</VButton>
                  }
                </span>
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
   //edit modal
  toggleEditModal(e){
    e.preventDefault();
    console.log(this.state.selectedUser)
    let editFormData = this.state.editForm;
    editFormData.name= this.state.selectedUser.name;
    editFormData.email= this.state.selectedUser.email;
    editFormData.phoneNumber= this.state.selectedUser.phoneNumber;
    editFormData.password= "";
    editFormData.confirmPassword = "";
    editFormData.branches = [...this.state.selectedUser.branches];
    editFormData.perms= [...this.state.selectedUser.permissions];
    this.setState({
      editModal: !this.state.editModal,
      editForm: editFormData,
      editModalWaiting: false, 
      editModalSuccess: false, 
      editModalError: false, 
      editModalFaildMessage: ""
    },()=>{console.log(this.state)});
  }
  handleEditInputChange(inputName,event){
    let editFormData = this.state.editForm;
    editFormData[inputName] = event.target.value;
    this.setState({editForm: editFormData},()=>{
    })
  }
  onSelectBranchEditForm(optionsList) {
    console.log(optionsList)
    let editForm = this.state.editForm;
    let optionsArr = [];
    optionsList.map((ele)=>{
      optionsArr.push(ele.id)
    })
    editForm.branches = optionsArr;
    this.setState({editForm: editForm},()=>{
      console.log(this.state.editForm.branches)
    })
  }
  handleEditPermsChange(value){
    let editFormData = this.state.editForm;
    if(editFormData.perms.includes(value)){
      editFormData.perms.splice(editFormData.perms.indexOf(value), 1); 
    }else{
      editFormData.perms.push(value);
    }
    if(editFormData.perms.includes("101") || editFormData.perms.includes("102") || editFormData.perms.includes("103")){
      if(!editFormData.perms.includes("100")){
        editFormData.perms.push("100");
      }
    }
    if(editFormData.perms.includes("105") || editFormData.perms.includes("106") || editFormData.perms.includes("107")){
      if(!editFormData.perms.includes("104")){
        editFormData.perms.push("104");
      }
    }
    if(editFormData.perms.includes("109") || editFormData.perms.includes("110")){
      if(!editFormData.perms.includes("108")){
        editFormData.perms.push("108");
      }
    }
    if(editFormData.perms.includes("112") || editFormData.perms.includes("113") || editFormData.perms.includes("114")){
      if(!editFormData.perms.includes("111")){
        editFormData.perms.push("111");
      }
    }
    if(editFormData.perms.includes("116") || editFormData.perms.includes("117") || editFormData.perms.includes("118")){
      if(!editFormData.perms.includes("115")){
        editFormData.perms.push("115");
      }
    }
    if(editFormData.perms.includes("120") || editFormData.perms.includes("121") || editFormData.perms.includes("122")){
      if(!editFormData.perms.includes("119")){
        editFormData.perms.push("119");
      }
    }
    if(editFormData.perms.includes("124") || editFormData.perms.includes("125") || editFormData.perms.includes("126")){
      if(!editFormData.perms.includes("123")){
        editFormData.perms.push("123");
      }
    }
    if(editFormData.perms.includes("128") || editFormData.perms.includes("129") || editFormData.perms.includes("130")){
      if(!editFormData.perms.includes("127")){
        editFormData.perms.push("127");
      }
    }
    //custom
    if(editFormData.perms.includes("101") || editFormData.perms.includes("101") || editFormData.perms.includes("102") || editFormData.perms.includes("103")){
      if(!editFormData.perms.includes("104")){
        editFormData.perms.push("104");
      }
    }
    this.setState({editForm: editFormData},()=>{
      console.log(this.state.editForm)
    })
  }
  handleEditUserSubmit(event){
    //get form data
    let userObj = {
      "user_id": this.state.selectedUser._id,
      "name": this.state.editForm.name,
      "email": this.state.editForm.email,
      "phoneNumber": this.state.editForm.phoneNumber,
      "permissions": this.state.editForm.perms.join(),
      "branches": this.state.editForm.branches.join()
    };
    if(this.state.editForm.password != ""){
      userObj.password = this.state.editForm.password
    }
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({editModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.editPath,
          config,
          userData,
          (resp) => {
            this.setState({editModalSuccess: true ,editModalWaiting:false},()=>{
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
                this.setState({editModalWaiting: false, editModalError: true, editModalFaildMessage: error.response.data.message});
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
  editModalReset(e){
    e.preventDefault();
    let editFormData= this.state.editForm;
    // editFormData.email= "";
    // editFormData.password= "";
    // editFormData.confirmPassword = "";
    // editFormData.perms= [];
    this.setState({
      editForm: editFormData,
      editModalWaiting: false, 
      editModalSuccess: false, 
      editModalError: false, 
      editModalFaildMessage: ""
    });
  }
  renderEditModal(){
    return(
      <Modal className="usersModal modal-lg" isOpen={this.state.editModal} toggle={this.toggleEditModal}>
        <VForm onSubmit={this.handleEditUserSubmit} >
          <ModalHeader toggle={this.toggleEditModal}>
            Edit Staff
          </ModalHeader>
          <ModalBody>
          {this.state.editModalError?
              <div>
                <Alert color="danger">
                  {this.state.editModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.editModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>your Staff has been Edited successfully.</p>
                </div>
              :
                <div >
                {this.state.editModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="editModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="name"
                            value={this.state.editForm.name}
                            onChange={(e) => this.handleEditInputChange("name", e)}
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
                            value={this.state.editForm.email}
                            onChange={(e) => this.handleEditInputChange("email",e)}
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
                            value={this.state.editForm.phoneNumber}
                            onChange={(e) => this.handleEditInputChange("phoneNumber",e)}
                            validations={[required, phoneNumber]} 
                            placeholder="phone Number"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="password" className="tradket_b_i"
                            id="editPassword"
                            autoComplete="off"
                            name="password"
                            value={this.state.editForm.password}
                            onChange={(e) => this.handleEditInputChange("password",e)}
                            validations={[Password]} 
                            placeholder="Staff password"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="password" className="tradket_b_i"
                            autoComplete="off"
                            name="confirmPassword"
                            value={this.state.editForm.confirmPassword}
                            onChange={(e) => this.handleEditInputChange("confirmPassword",e)}
                            validations={[editRePassword]} 
                            placeholder="Confirm password"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                        <Multiselect
                          data={this.state.branches}
                          valueField='id'
                          textField='name'
                          placeholder="Staff Branches"
                          onChange={this.onSelectBranchEditForm}
                          required
                          defaultValue={this.state.editForm.branches}
                        />
                        </div>
                      </Col>
                    </Row>
                    <VInput type="hidden" validations={[this.oneOfManyEdit]} />
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
                                            onChange={(e) => this.handleEditPermsChange(perm.id,e)}
                                            checked={this.state.editForm.perms.includes(perm.id)}
                                            disabled={
                                              (perm.id === "100"? 
                                                ((this.state.editForm.perms.includes("101") || this.state.editForm.perms.includes("102") || this.state.editForm.perms.includes("103"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "104"? 
                                                (this.state.editForm.perms.includes("100") || (this.state.editForm.perms.includes("101") || this.state.editForm.perms.includes("102") || this.state.editForm.perms.includes("103") || this.state.editForm.perms.includes("105") || this.state.editForm.perms.includes("106") || this.state.editForm.perms.includes("107"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "108"? 
                                                ((this.state.editForm.perms.includes("109") || this.state.editForm.perms.includes("110"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "111"? 
                                                ((this.state.editForm.perms.includes("112") || this.state.editForm.perms.includes("113") || this.state.editForm.perms.includes("114"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                              (perm.id === "115"? 
                                                ((this.state.editForm.perms.includes("116") || this.state.editForm.perms.includes("117") || this.state.editForm.perms.includes("118"))? true: false) 
                                              : 
                                                false) 
                                            ||
                                                (perm.id === "119"? 
                                                  ((this.state.editForm.perms.includes("120") || this.state.editForm.perms.includes("121") || this.state.editForm.perms.includes("122"))? true: false) 
                                                : 
                                                  false) 
                                            ||
                                                (perm.id === "123"? 
                                                  ((this.state.editForm.perms.includes("124") || this.state.editForm.perms.includes("125") || this.state.editForm.perms.includes("126"))? true: false) 
                                                : 
                                                  false) 
                                            ||
                                                (perm.id === "127"? 
                                                  ((this.state.editForm.perms.includes("128") || this.state.editForm.perms.includes("129") || this.state.editForm.perms.includes("130"))? true: false) 
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
          {this.state.editModalSuccess || this.state.editModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.editModalSuccess || this.state.editModalWaiting || this.state.editModalError?
                null
              : 
                <span>
                  {this.state.editForm.branches.length === 0?
                    <button disabled className="btn btn-info">Edit</button>
                  :
                    <VButton className="btn btn-info">Edit</VButton>
                  }
                </span>
              }
              {this.state.editModalError?
                <button className="accept-btn btn btn-default" onClick={this.editModalReset}>Try again</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleEditModal}>Cancel</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //deactivate modal
  toggleDeactivateModal(){
    this.setState({
      deactivateModal: !this.state.deactivateModal,
      deactivateModalWaiting: false,
      deactivateModalSuccess: false,
      deactivateModalError: false,
      deactivateModalFaildMessage: ""
    });
  }
  handleDeactivateUserSubmit(event){
    //start waiting
    this.setState({deactivateModalWaiting: true},()=>{
      //send request
      let userObj = {
        "user_id": this.state.selectedUser._id,
        "active": "false"
      };
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      let data= {};
      httpClient.post(
          "/api/staff/edit",
          config,
          userObj,
          (resp) => {
            this.setState({deactivateModalSuccess: true ,deactivateModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
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
    });
    event.preventDefault();
  }
  DeactivateModalReset(){
    this.setState({
      deactivateModalWaiting: false,
      deactivateModalSuccess: false,
      deactivateModalError: false,
      deactivateModalFaildMessage: ""
    });
  }
  renderDeactivateModal(){
    return(
      <Modal isOpen={this.state.deactivateModal} toggle={this.toggleDeactivateModal}>
        <VForm >
          <ModalHeader toggle={this.toggleDeactivateModal}>
            Deactivate
          </ModalHeader>
          <ModalBody>
          {this.state.deactivateModalError?
              <div>
                <Alert color="danger">
                  Oops! Something went wrong. If this problem persists, please contact your service provider.
                </Alert>
              </div>
          :
            <div >
              {this.state.deactivateModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>your Staff has been Deactivated successfully.</p>
                </div>
              :
                <div >
                {this.state.deactivateModalWaiting?
                  <Waiting height="150px" />
                :
                  <div className="deactivateModalBody">
                      <br/>
                <p>You are about to Deactivate user <b>{this.state.selectedUser.name}</b> . Please confirm deactivation or press cancel.</p>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          <ModalFooter>
            {this.state.deactivateModalSuccess || this.state.deactivateModalWaiting || this.state.deactivateModalError?
              null
            : 
              <VButton className="btn btn-danger" onClick={this.handleDeactivateUserSubmit} >Deactivate</VButton>
            }
            {this.state.deactivateModalError?
              <button className="accept-btn btn btn-default" onClick={this.deactivateModalReset}>Try Again</button>
            :
              null
            }
            <span className="accept-btn btn btn-default" onClick={this.toggleDeactivateModal}>Cancel</span>
          </ModalFooter>
        </VForm>
      </Modal>
    )
  }
  //activate modal
  toggleActivateModal(){
    this.setState({
      activateModal: !this.state.activateModal,
      activateModalWaiting: false,
      activateModalSuccess: false,
      activateModalError: false,
      activateModalFaildMessage: ""
    });
  }
  handleActivateUserSubmit(event){
    //start waiting
    this.setState({activateModalWaiting: true},()=>{
      //send request
      let userObj = {
        "user_id": this.state.selectedUser._id,
        "active": "true"
      };
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      let data= {};
      httpClient.post(
          "/api/staff/edit",
          config,
          userObj,
          (resp) => {
            this.setState({activateModalSuccess: true ,activateModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
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
    });
    event.preventDefault();
  }
  ActivateModalReset(){
    this.setState({
      activateModalWaiting: false,
      activateModalSuccess: false,
      activateModalError: false,
      activateModalFaildMessage: ""
    });
  }
  renderActivateModal(){
    return(
      <Modal isOpen={this.state.activateModal} toggle={this.toggleActivateModal}>
        <VForm >
          <ModalHeader toggle={this.toggleActivateModal}>
            Activate
          </ModalHeader>
          <ModalBody>
          {this.state.activateModalError?
              <div>
                <Alert color="danger">
                  Oops! Something went wrong. If this problem persists, please contact your service provider.
                </Alert>
              </div>
          :
            <div >
              {this.state.activateModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>your Staff has been Activated successfully.</p>
                </div>
              :
                <div >
                {this.state.activateModalWaiting?
                  <Waiting height="150px" />
                :
                  <div className="activateModalBody">
                    <br/>
                    <p>You are about to Activate user <b>{this.state.selectedUser.name}</b> . Please confirm activation or press cancel.</p>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          <ModalFooter>
            {this.state.activateModalSuccess || this.state.activateModalWaiting || this.state.activateModalError?
              null
            : 
              <VButton className="btn btn-danger" onClick={this.handleActivateUserSubmit} >Activate</VButton>
            }
            {this.state.activateModalError?
              <button className="accept-btn btn btn-default" onClick={this.activateModalReset}>Try Again</button>
            :
              null
            }
            <span className="accept-btn btn btn-default" onClick={this.toggleActivateModal}>Cancel</span>
          </ModalFooter>
        </VForm>
      </Modal>
    )
  }
  //dedtails
  handelRowClick(user,index){
    //reset collapse open 
      if(this.state.showUserDetails){
        if(user._id === this.state.selectedUser._id){
          this.setState({showUserDetails: false});
        }else{
          this.setState({selectedUser: user},()=>{
            //scroll to transaction details
            window.scrollTo({
              top:this.userDetailsRef.current.offsetTop, 
              behavior: "smooth"   // Optional, adds animation
            })
          });
        }
      }else{
        this.setState({selectedUser: user, showUserDetails: true},()=>{
          //scroll to transaction details
          window.scrollTo({
            top:this.userDetailsRef.current.offsetTop, 
            behavior: "smooth"   // Optional, adds animation
          })
        });
      }
  }
  renderUserDetails(){
    return(
      <Row>
        <div className="x_panel"  ref={this.userDetailsRef}>
          <div className="x_title details">
            <h2>{this.state.selectedUser.name}</h2>
            <div className="ButtonsDiv">
              {JSON.parse(localStorage.userData).permissions.includes("102") && this.state.brancesLoaded?
                  <button onClick={this.toggleEditModal} type="button" className="btn">
                    Edit
                  </button>:null
              }
              {JSON.parse(localStorage.userData).permissions.includes("103")?
                  <span>
                    {this.state.selectedUser.active?
                      <button onClick={this.toggleDeactivateModal} type="button" className="btn">
                        Deacttivate
                      </button>
                    :
                      <button onClick={this.toggleActivateModal} type="button" className="btn">
                        Acttivate
                      </button>
                    }
                  </span>:null
              }
              <button onClick={() => this.setState({showUserDetails:false})} type="button" className="accept-btn btn btn-secondary close_btn">
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>           
          </div>
          <div className="x_content">
            <br/>
            {this.state.detailsWaiting?
              <Waiting height="300px" />
              :
              <div>
                <div className="modal_details">
                  <span className="title">ID</span><span className="value">{this.state.selectedUser._id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Name</span><span className="value">{this.state.selectedUser.name}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Email</span><span className="value">{this.state.selectedUser.email}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Phone</span><span className="value">{this.state.selectedUser.phoneNumber}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Active</span><span className="value">{dependencies.boolName(this.state.selectedUser.active)}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Branches</span><span className="value perms">{
                    dependencies.branchesName(this.state.selectedUser.branches, this.state.fullBranchs).map((name)=>{
                      return(<span className="table_block">{name}</span>)
                    })
                  }
                  </span>
                </div>
                <div className="modal_details">
                  <span className="title">Permisions</span><span className="value perms">{
                    this.state.selectedUser.permissions.map((perm)=>{
                      return(<span className="table_block">{dependencies.permsName(perm)}</span>)
                    })
                  }
                  </span>
                </div>
              </div>
            }
          </div>
        </div> 
      </Row>
    );
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
            {this.renderEditModal()}
            {this.renderDeactivateModal()}
            {this.renderActivateModal()}
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
