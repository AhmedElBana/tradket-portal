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
import "./Branch.scss";
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
          headers: ["Branch name","Phone Number","Type","Active"]
        },
        usersTablePath: "/api/branch/list",
        integData: [],
        totalLength: 0,
        PageNumber: 0,
        PageSize: 10,
        usersWaiting: true,
        detailsWaiting:false,
        showUsersDetails: false,
        selectedUser: {},
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

    this.loadDefaultData();
    
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
                  <td>{ele.phoneNumber}</td>
                  <td>{ele.type}</td>
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
              <h2>Branches</h2>
              {/* <div className="ButtonsDiv">
                {JSON.parse(localStorage.userData).permissions.includes("101")?
                  <button onClick={this.toggleAddModal} type="button" className="btn">
                    New Staff
                  </button>:null
                }
              </div>   */}
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
        {this.state.showUserDetails?
          this.renderUserDetails()
        :
          null
        }
      </div>
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
              {/* {JSON.parse(localStorage.userData).permissions.includes("102")?
                  <button onClick={this.toggleEditModal} type="button" className="btn">
                    Edit
                  </button>:null
              } */}
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
                  <span className="title">Phone</span><span className="value">{this.state.selectedUser.phoneNumber}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Address</span><span className="value">{this.state.selectedUser.address}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Active</span><span className="value">{dependencies.boolName(this.state.selectedUser.active)}</span>
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
