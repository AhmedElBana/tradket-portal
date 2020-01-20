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
        addModalWaiting: false,
        addModal: false,
        addModalError: false,
        addModalFaildMessage: "",
        addModalSuccess: false,
        addForm: {
          email: "",
          perms: []
        },
        addModalPerm: {
          form: {
              "email": "User Email",
              "perms": "Permissions",
              "orders": "Orders",
              "products": "Products",
              "transactions": "Transactions",
              "paymentIntegrations": "Payment Integrations",
              "iframes": "Iframes",
              "users": "Users",
              "transfers":"Transfers"
          }
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
                <button onClick={this.toggleAddModal} type="button" className="btn">
                  New Staff
                </button>
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
  toggleAddModal(){
    let addFormData = this.state.addForm;
    addFormData.email= "";
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
    if(addFormData.perms.includes("can create products") || addFormData.perms.includes("can update products") || addFormData.perms.includes("can delete products")){
      if(!addFormData.perms.includes("can view products")){
        addFormData.perms.push("can view products");
      }
    }
    if(addFormData.perms.includes("can create staff") || addFormData.perms.includes("can update staff") || addFormData.perms.includes("can delete staff")){
      if(!addFormData.perms.includes("can view staff")){
        addFormData.perms.push("can view staff");
      }
    }
    if(addFormData.perms.includes("can create payment integration") || addFormData.perms.includes("can update payment integration")){
      if(!addFormData.perms.includes("can view payment integration")){
        addFormData.perms.push("can view payment integration");
      }
    }
    if(addFormData.perms.includes("can create iframe") || addFormData.perms.includes("can update iframe") || addFormData.perms.includes("can delete iframe")){
      if(!addFormData.perms.includes("can view iframe")){
        addFormData.perms.push("can view iframe");
      }
    }
    if(addFormData.perms.includes("can create orders") || addFormData.perms.includes("can view products") || addFormData.perms.includes("can view transactions") || addFormData.perms.includes("can view orders")){
      if(!addFormData.perms.includes("can view payment integration")){
        addFormData.perms.push("can view payment integration");
      }
    }
    
    this.setState({addForm: addFormData},()=>{
    })
  }
  handleAddProductSubmit(event){
    //get form data
    let userObj = {
      "email": this.state.addForm.email,
      "group": "custom",
      "custom": this.state.addForm.perms
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({addModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.usersTablePath,
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
              if(error.response.status === 401){
                this.setState({logout: true});
              }else if(error.response.status === 400){
                this.setState({addModalWaiting: false, addModalError: true, addModalFaildMessage: "Please enter valid email."});
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
  addModalReset(){
    let addFormData= this.state.addForm;
    addFormData.email= "";
    addFormData.perms= [];
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
      <Modal className="usersModal" isOpen={this.state.addModal} toggle={this.toggleAddModal}>
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
                <Alert color="success">
                  Staff Added Successfully.
                </Alert>
              :
                <div >
                {this.state.addModalWaiting?
                  <Waiting height="150px" />
                :
                  <div className="addModalBody">
                    <br/>
                    <FormGroup>
                      <Row>
                        <Col sm="3">
                          <Label htmlFor="fullName" className="usersLabel">Email</Label>
                        </Col>
                        <Col sm="8" className="inputeDiv">
                          <VInput type="text" className="accept-input full-width-input"
                            autoComplete="off"
                            name="email"
                            value={this.state.addForm.email}
                            onChange={(e) => this.handleAddInputChange("email",e)}
                            validations={[required, email]} 
                            placeholder="Enter Staff Email"
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                    <VInput type="hidden" validations={[this.oneOfMany]} />
                    <Row>
                        <Col sm="3">
                          <Label htmlFor="fullName" className="usersLabel">Permsions</Label>
                        </Col>
                        <Col sm="8" className="inputeDiv">
                          <br/>
                          {Object.keys(permsObj).map((key)=>{
                            return(
                              <div key={key}>
                                <Label htmlFor="fullName">{this.state.addModalPerm.form[key]}</Label>
                                {permsObj[key].map((perm)=>{
                                  return(
                                    <FormGroup key={perm} >
                                      <AppSwitch className={'mx-1'} variant={'pill'} color={'info'}
                                        onChange={(e) => this.handleAddPermsChange(perm,e)}
                                        checked={this.state.addForm.perms.includes(perm)}
                                        disabled={
                                            (perm === "can view payment integration"? 
                                              ((this.state.addForm.perms.includes("can create orders") || this.state.addForm.perms.includes("can view products") || this.state.addForm.perms.includes("can view transactions") || this.state.addForm.perms.includes("can view orders"))? true: false) 
                                            : 
                                              false) 
                                          ||
                                            (perm === "can view products"? 
                                              ((this.state.addForm.perms.includes("can create products") || this.state.addForm.perms.includes("can update products") || this.state.addForm.perms.includes("can delete products"))? true: false) 
                                            : 
                                              false)
                                          ||
                                            (perm === "can view staff"? 
                                              ((this.state.addForm.perms.includes("can create staff") || this.state.addForm.perms.includes("can update staff") || this.state.addForm.perms.includes("can delete staff"))? true: false) 
                                            : 
                                              false)
                                          ||
                                            (perm === "can view payment integration"? 
                                              ((this.state.addForm.perms.includes("can create payment integration") || this.state.addForm.perms.includes("can update payment integration"))? true: false) 
                                            : 
                                              false)
                                          ||
                                            (perm === "can view iframe"? 
                                              ((this.state.addForm.perms.includes("can create iframe") || this.state.addForm.perms.includes("can update iframe") || this.state.addForm.perms.includes("can delete iframe"))? true: false) 
                                            : 
                                              false)
                                        }
                                        name={perm}
                                      />
                                      {dependencies.permsName(perm)}
                                    </FormGroup>
                                  )
                                })}
                              </div>
                            )
                          })}
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
