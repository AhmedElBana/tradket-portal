import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import {auth} from '../../../tools/Auth';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import "./Payment.scss";
import Payment_summary from './Payment_summary/Payment_summary'
import FullTable from './../../CustomComponents/FullTable/FullTable';
import table_struc from './table_struc/table_struc.json';
import details_struc from './table_struc/details_struc.json';
import filter_struc from './table_struc/filters_struc.json';
let final_filter_struc = filter_struc;

class Payment extends Component {
  constructor(props){
    super(props);
    this.state = {
        branches: [],
        staff: [],
        //public
        publicError: false,
        logout: false,
    }; 
  }
  componentDidMount(){
    this.requestBranches();
    this.requestStaff();
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
          this.setState({branches: branches_options})
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
  requestStaff = () => {
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
        "/api/staff/list",
        config,
        (resp) => {
          let staff_options = [];
          resp.data.data.result.map((staff)=>{
            staff_options.push({"value": staff._id, "text": staff.name, "text_ar": staff.name})
          });
          let with_staff_final_filter_struc = [];
          final_filter_struc.map((ele) => {
            let current_ele = ele;
            if(current_ele.filterName == "creator_id"){
              current_ele.options = staff_options;
            }
            with_staff_final_filter_struc.push(current_ele);
          })
          final_filter_struc = [...with_staff_final_filter_struc]
          this.setState({staff: staff_options})
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
          <>
            <div>
              <Payment_summary branches={this.state.branches} staff={this.state.staff} />
            </div>
            <div>
              <FullTable name="payments" path={"/api/payment/list"} table={table_struc} filters={final_filter_struc} details={details_struc} />
            </div>
          </>
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

export default Payment;