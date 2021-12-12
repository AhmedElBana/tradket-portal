import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import {auth} from '../../../tools/Auth';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import "./Transfers.scss";
import DetailsButtons from './DetailsButtons/DetailsButtons';
import FullTable from './../../CustomComponents/FullTable/FullTable';
import table_struc from './table_struc/table_struc.json';
import details_struc from './table_struc/details_struc.json';
import filter_struc from './table_struc/filters_struc.json';
let final_filter_struc = filter_struc;

class Transfers extends Component {
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
  renderBody(){
    return(
      <div className="products-page">
        {this.state.publicError?
          <div scroll="no" className="mainErrorDiv">
            <Alert color="danger">
              حدث خطا ما ، يرجي المحاوله في وقت لاحق.
            </Alert>
          </div>
        :
          <>
            <div>
            <FullTable name="transfers" path={"/api/transfer/list"} table={table_struc} details={details_struc}  detailsButtons={<DetailsButtons/>}/>
              {/* <FullTable name="transfers" path={"/api/custom_product/list"} table={table_struc} filters={final_filter_struc} details={details_struc}  detailsButtons={<DetailsButtons/>} /> */}
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

export default Transfers;