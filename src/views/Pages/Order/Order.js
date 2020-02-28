import React, { Component } from 'react';
import { Alert, Col, Input, Table, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup,Label} from 'reactstrap';
import {auth} from '../../../tools/Auth';
import {dependencies} from '../../../tools/Dependencies';
import ReactPaginate from 'react-paginate';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Order.scss";
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
let phoneNameError = "Please enter valid phone number  (more than 4 number)."
const phoneNumber = (value) => {
  // var patt = new RegExp("^(01)([0-9]*)$");
  if (isNaN(value) || value.toString().trim().length <= 4) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {phoneNameError}
            </Alert>
          </div>;
  }
}


class Order extends Component {
  constructor(props){
    super(props);
    this.state = {
        //users
        table: {
          headers: ["ID","Branch","Amount","Type","Created At","Customer","promo","State"]
        },
        detailsHeaders: ["Product ID","Name","Price","Quantity","Total"],
        usersTablePath: "/api/order/list",
        integData: [],
        totalLength: 0,
        PageNumber: 0,
        PageSize: 10,
        usersWaiting: true,
        detailsWaiting:false,
        showUsersDetails: false,
        selectedUser: {},
        //branches
        brancesLoaded: false,
        fullBranchs: [],
        branchName: {},
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

    this.requestBranches = this.requestBranches.bind(this); 
    this.loadDefaultData();
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
          let branches = {};
          resp.data.data.result.map((branch)=>{
            branches[branch._id] = branch.name;
          })
          this.setState({branchName: branches, fullBranchs: resp.data.data.result, brancesLoaded: true},()=>{
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
          console.log(users)
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
              let state = "";
              if(ele.canceled){
                state = "Canceled"
              }else if(ele.returned){
                state = "Returned"
              }else{
                state = "Completed"
              }
              return(
                <tr key={ele._id}  onClick={()=> this.handelRowClick(ele,index)} className={this.state.showUserDetails && (ele._id == this.state.selectedUser._id)? "selectedRow": ""}>
                  <td>{ele._id}</td>
                  <td>{this.state.branchName[ele.branch_id]}</td>
                  <td>{ele.total}</td>
                  <td>{ele.type}</td>
                  <td>{dependencies.custom_date_format(ele.createdDate)}</td>
                  <td>{ele.customer_name}</td>
                  <td>{dependencies.boolName(ele.promo)}</td>
                  <td>{state}</td>
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
              <h2>Orders</h2>
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
    let state = "";
    if(this.state.selectedUser.canceled){
      state = "Canceled"
    }else if(this.state.selectedUser.returned){
      state = "Returned"
    }else{
      state = "Completed"
    }
    return(
      <Row>
        <div className="x_panel ordersDetails"  ref={this.userDetailsRef}>
          <div className="x_title details">
            <h2>Order Details</h2>
            <div className="ButtonsDiv">
              <button onClick={() => this.setState({showUserDetails:false})} type="button" className="accept-btn btn btn-secondary close_btn">
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>           
          </div>
          <div className="x_content orders">
            <br/>
            {this.state.detailsWaiting?
              <Waiting height="300px" />
              :
              <div>
                <div className="modal_details">
                  <span className="title">ID</span><span className="value">{this.state.selectedUser._id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Type</span><span className="value">{this.state.selectedUser.type}</span>
                </div>
                <div className="modal_details">
                  <span className="title">State</span><span className="value">{state}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Branch</span><span className="value">{this.state.branchName[this.state.selectedUser.branch_id]}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Customer Id</span><span className="value">{this.state.selectedUser.customer_id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Customer Name</span><span className="value">{this.state.selectedUser.customer_name}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Customer Phone</span><span className="value">{this.state.selectedUser.customer_phoneNumber}</span>
                </div>
                <div className="modal_details">
                  <span className="title">create Date</span><span className="value">{dependencies.custom_date_format(this.state.selectedUser.createdDate)}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Creator ID</span><span className="value">{this.state.selectedUser.creator_id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Use Promo</span><span className="value">{dependencies.boolName(this.state.selectedUser.promo)}</span>
                </div>
                {this.state.selectedUser.promo?
                  <div>
                    <div className="modal_details">
                      <span className="title">Promo ID</span><span className="value">{this.state.selectedUser.promo_id}</span>
                    </div>
                  </div>
                :
                  null
                }
                <div className="modal_details">
                  <span className="title">Sub Total</span><span className="value">{this.state.selectedUser.subTotal}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Discount Value</span><span className="value">{this.state.selectedUser.discountValue}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Total</span><span className="value">{this.state.selectedUser.total}</span>
                </div>
                {this.state.selectedUser.type == "Return"?
                  <div className="modal_details">
                    <span className="title">Returned Amount</span><span className="value">{this.state.selectedUser.returnAmount}</span>
                  </div>
                :
                  null
                }
                {this.state.selectedUser.parentOrder?
                  <div className="modal_details">
                    <span className="title">Parent Order</span><span className="value">{this.state.selectedUser.parentOrder}</span>
                  </div>
                :
                  null
                }
                <div className="modal_details">
                  <span className="title">Bill</span>
                  <div className="product_map">
                    <Table className="usersTable mainTable">
                      <thead>
                        <tr>
                          {this.state.detailsHeaders.map((ele,index)=>{
                            return <th key={index}>{ele}</th>
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.selectedUser.bill.map((product,index)=>{
                          return(
                            <tr key={product._id}>
                              <td>{product._id}</td>
                              <td>{product.name}</td>
                              <td>{product.price}</td>
                              <td>{product.quantity}</td>
                              <td>{product.total}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
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

export default Order;
