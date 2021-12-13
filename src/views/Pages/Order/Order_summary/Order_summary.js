import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../../tools/HttpClient';
import "./Order_summary.scss";
import { auth } from './../../../../tools/Auth';
import Waiting from '../../../Waiting/waiting';
import { DatePicker } from 'rsuite';
import { isBefore,add, isAfter} from 'date-fns';
import "rsuite/dist/styles/rsuite-default.css";

class Order_summary extends Component {
  constructor(props){
    super(props);
    this.state = {
        start_date: new Date(new Date().setHours(0, 0, 0, 0)),
        end_date: new Date(),
        branch: "",
        staff: "",
        summary: {},
        show_update: false,
        //public
        waiting: true,
        publicError: false,
        logout: false,
    }; 
  }
  componentDidMount(){
      this.requestSummary();
  }
  requestSummary = () => {
    //request data
    let filters = {};
    if(this.state.branch != ""){
      filters.branch_id = this.state.branch
    }
    if(this.state.staff != ""){
      filters.staff_id = this.state.staff
    }
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "date_from": this.state.start_date,
        "date_to": this.state.end_date,
        ...filters
      }
    }
    httpClient.get(
        "/api/order/summary",
        config,
        (resp) => {
          this.setState({
            summary: resp.data,
            waiting: false,
            show_update: false
          })
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
  disabledDate = (date) => {
      let start_date = new Date(this.state.start_date);
      const MinDates = add(start_date, {days:30});
      if (this.state.start_date === "") {
          return true
      }else if(isBefore(date,start_date) || isAfter(date, new Date().setHours(23,59,59,0))){
          return true
      }else if (isAfter(date, MinDates)){
          return true
      }
      else{
          return false
      }
  }
  handleStartDateChange = (value) => {
      let start_date = this.state.start_date;
      let end_date = this.state.end_date;
      if(value == null){
        start_date = new Date(new Date().setHours(0, 0, 0, 0));
        end_date = new Date();
      }else{
          start_date = value.toISOString();
      }
      this.setState({
        start_date: start_date,
        end_date: end_date,
        show_update: true
      })
  }
  handleEndDateChange = (date) => {
      let end_date = this.state.end_date;
      if(date !== null){
          if(date.getFullYear() === new Date(end_date).getFullYear() && date.getMonth() === new Date(end_date).getMonth() && date.getDate() === new Date(end_date).getDate()){
            end_date = date.toISOString();
          }else{
              if(date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate()){
                  date.setHours(new Date().getHours(), new Date().getMinutes() , new Date().getSeconds(), 0);
                  end_date = date.toISOString();
              }else{
                  date.setHours(23, 59, 59, 0);
                  end_date = date.toISOString();
              }
          }
      }else {
        end_date = new Date();
      }
      this.setState({end_date: end_date, show_update: true})
  }
  handleBranchChange = (e) =>{
    this.setState({
      branch: e.target.value,
      show_update: true
    })
  }
  handleStaffChange = (e) =>{
    this.setState({
      staff: e.target.value,
      show_update: true
    })
  }
  handleUpdate = (e) => {
    e.preventDefault();
    this.setState({waiting: true},()=>{
      this.requestSummary();
    })
  }
  renderBody(){
    return(
      <div className="row">
        <div className="orders_headers">
          {this.state.publicError?
              <Alert color="danger">
                حدث خطا ما ، يرجي المحاوله في وقت لاحق.
              </Alert>
          :
            this.state.waiting ?
              <Waiting height="100px" width="50px" />
            :
              <div>
                <div className="insights_head_div">
                  <p>ملخص الطلبات</p>
                  <div>
                    {this.state.show_update && <button onClick={this.handleUpdate} className="filterCompButton SubmitFButton btn btn-secondary">تحديث</button>}
                    <select onChange={this.handleBranchChange} value={this.state.branch}>
                      <option value="">كل الفروع</option>
                      {this.props.branches.map((branch)=>{
                        return(
                          <option value={branch.value}>{branch.text}</option>
                        )
                      })}
                    </select>
                    <select onChange={this.handleStaffChange} value={this.state.staff}>
                      <option value="">كل الموظفين</option>
                      {this.props.staff.map((staff)=>{
                        return(
                          <option value={staff.value}>{staff.text}</option>
                        )
                      })}
                    </select>
                    <DatePicker
                        name={"end_date"}
                        size="lg"
                        placeholder={"الي تاريخ"}
                        disabledDate={(date) => this.disabledDate(date)}
                        placement="bottomEnd"
                        block
                        limitEndYear={3}
                        format="YYYY-MM-DD HH:mm:ss"
                        value={this.state.end_date}
                        onChange={(value) => this.handleEndDateChange(value)}
                    />
                    <DatePicker
                        name={"start_date"}
                        size="lg"
                        placeholder={"من تاريخ"}
                        placement="bottomStart" 
                        block
                        limitEndYear={3}
                        disabledDate={date => isAfter(date, new Date())}
                        format="YYYY-MM-DD HH:mm:ss"
                        value={this.state.start_date}
                        onChange={(value) => this.handleStartDateChange(value)}
                    />
                  </div>
                </div>
                <div className="insights_body_div">
                  <div>
                      <p>اجمالي مبلغ الطلبات</p>
                      <span>{this.state.summary.total_success_amount}EGP</span>
                  </div>
                  <div>
                      <p>اجمالي عدد الطلبات</p>
                      <span>{this.state.summary.total_count}</span>
                  </div>
                  <div>
                      <p>الطلبات الناجحة</p>
                      <span>{this.state.summary.total_success_count}</span>
                  </div>
                  <div>
                      <p>الطلبات الملغية</p>
                      <span>{this.state.summary.total_canceled_count}</span>
                  </div>
                  <div>
                      <p>الطلبات المرتجعه</p>
                      <span>{this.state.summary.total_returned_count}</span>
                  </div>
                </div>
              </div>
          }
        </div>
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

export default Order_summary;