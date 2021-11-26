import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import {auth} from '../../../tools/Auth';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import "./Customer.scss";
import FullTable from './../../CustomComponents/FullTable/FullTable';
import table_struc from './table_struc/table_struc.json';
import details_struc from './table_struc/details_struc.json';
import filter_struc from './table_struc/filters_struc.json';
let final_filter_struc = filter_struc;

class Customer extends Component {
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
              <FullTable name="customers" path={"/api/customer/list"} table={table_struc} filters={final_filter_struc} />
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

export default Customer;