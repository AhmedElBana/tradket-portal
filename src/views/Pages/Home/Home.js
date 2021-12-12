import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Home.scss";

import Waiting from "./../../../views/Waiting/waiting";
import { auth } from '../../../tools/Auth';

const perms = JSON.parse(localStorage.userData).permissions;

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
        waiting: true,
        info: {},
        error: false,
        errorMessage: "",
    };
  }
  componentDidMount(){
    if(perms.includes("136")){
      this.load_info();
    }
  }
  load_info = () => {
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      }
    }
    httpClient.get(
        "/api/store/info",
        config,
        (resp) => {
          this.setState({waiting: false, info: resp.data.data});
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
  render() {
    return (
      <div className="Home">
        <Row>
          {perms.includes("136") &&
            <div className="home_headers">
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
                      <p>بيانات عامة</p>
                    </div>
                    <div className="insights_body_div">
                      <div>
                          <p>المساحة المسموحة للصور</p>
                          <span>{this.state.info.imagesStorageLimit.toFixed(2)}MB</span>
                      </div>
                      <div>
                          <p>مساحة الصور المستخدمة</p>
                          <span>{this.state.info.imagesStorage.toFixed(2)}MB</span>
                      </div>
                      <div>
                          <p>الرسائل المتوفرة</p>
                          <span>{this.state.info.availableSMS}</span>
                      </div>
                      <div>
                          <p>الرسائل المستخدمة</p>
                          <span>{this.state.info.usedSMS}</span>
                      </div>
                    </div>
                  </div>
              }
            </div>
          }
        </Row>
      </div>
    );
  }
}

export default Home;
