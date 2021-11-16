import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import {auth} from '../../../tools/Auth';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import "./Custom_products_staff.scss";
import DetailsButtons from './DetailsButtons/DetailsButtons';
import FullTable from './../../CustomComponents/FullTable/FullTable';
import table_struc from './table_struc/table_struc.json';
import details_struc from './table_struc/details_struc.json';
import filter_struc from './table_struc/filters_struc.json';
let final_filter_struc = filter_struc;

class Custom_products_staff extends Component {
  constructor(props){
    super(props);
    this.state = {
        current_step: "new",
        //public
        publicError: false,
        logout: false,
    }; 
  }
  componentDidMount(){
    
  }
  current_step_change = (step) => {
    this.setState({current_step: step})
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
            <div className="row">
              <div className="custom_products_head">
                <div className={this.state.current_step == "new" ? "active" : ""} onClick={()=>{this.current_step_change("new")}}>New</div>
                <div className={this.state.current_step == "progress" ? "active" : ""} onClick={()=>{this.current_step_change("progress")}}>Progress</div>
                <div className={this.state.current_step == "ready" ? "active" : ""} onClick={()=>{this.current_step_change("ready")}}>Complate</div>
              </div>
            </div>
            <div>
              {this.state.current_step === "new" &&
                  <FullTable name="Custom_products_staff_new" path={"/api/custom_product/list?status=assigned"} table={table_struc} filters={final_filter_struc} details={details_struc}  detailsButtons={<DetailsButtons/>} />
              }
              {this.state.current_step === "progress" &&
                  <FullTable name="Custom_products_staff_progress" path={`/api/custom_product/list?status=accepted&accepted_from=${JSON.parse(localStorage.userData)._id}`} table={table_struc} filters={final_filter_struc} details={details_struc}  detailsButtons={<DetailsButtons/>} />
              }
              {this.state.current_step === "ready" &&
                  <FullTable name="Custom_products_staff_ready" path={`/api/custom_product/list?ready_from=${JSON.parse(localStorage.userData)._id}`} table={table_struc} filters={final_filter_struc} details={details_struc}  detailsButtons={<DetailsButtons/>} />
              }
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

export default Custom_products_staff;