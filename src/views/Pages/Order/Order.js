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

import FullTable from './../../CustomComponents/FullTable/FullTable';
import table_struc from './table_struc/table_struc.json';
import details_struc from './table_struc/details_struc.json';
import filter_struc from './table_struc/filters_struc.json';
let final_filter_struc = filter_struc;

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
        //public
        publicError: false,
        logout: false,
    }; 
  }
  componentDidMount(){
    this.requestBranches();
  }
  requestBranches = () => {
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
          let branches_options = [];
          resp.data.data.result.map((branch)=>{
            branches_options.push({"value": branch._id, "text": branch.name, "text_ar": branch.name})
          });
          let with_branch_final_filter_struc = [];
          final_filter_struc.map((ele) => {
            let current_ele = ele;
            if(current_ele.filterName == "branch_id"){
              current_ele.options = branches_options;
            }
            with_branch_final_filter_struc.push(current_ele);
          })
          final_filter_struc = [...with_branch_final_filter_struc]
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
            {/* {this.renderUsersBlock()} */}
            <FullTable name="orders" path={"/api/order/list"} table={table_struc} filters={final_filter_struc} />
            {/* <FullTable name="orders" path={"/api/order/list"} table={table_struc} filters={filter_struc} details={details_struc}/> */}
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
