import React, { Component } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Custom_product_full.scss";
import Waiting from "./../../../views/Waiting/waiting";
import { auth } from '../../../tools/Auth';
import { dependencies } from '../../../tools/Dependencies';
import ImgPreview from 'img-preview';

const perms = JSON.parse(localStorage.userData).permissions;

class Custom_product_full extends Component {
  constructor(props){
    super(props);
    this.state = {
        waiting: true,
        data: {},
        final_img: [],
        publicError: false
    };
  }
  componentDidMount(){
    this.load_data();
  }
  load_data = () => {
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "_id": this.props.match.params.id
      }
    }
    httpClient.get(
        "/api/custom_product/full_details",
        config,
        (resp) => {
          let final_img = [];
          if(resp.data.data.images && resp.data.data.images.length > 0){
            resp.data.data.images.map((ele)=>{
              final_img.push({
                src: ele,
                w: 200,
                h: 200
              })
            })
          }
          this.setState({waiting: false, data: resp.data.data, final_img: final_img});
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
      <div className="Custom_product_full">
        <Row>
          <div className="tradket_section">
            {this.state.publicError?
                <Alert color="danger">
                  Oops! Something went wrong. If this problem persists, please contact your service provider.
                </Alert>
            :
              this.state.waiting ?
                <Waiting height="200px"/>
              :
                <div>
                  <div className="head_div">
                    <p>Custom Product Full Details</p>
                  </div>
                  <div className="body_div">
                    <div className="custom_prod_full">
                      <h3>General Details</h3>
                      <p><span>Product ID</span>: {this.state.data._id}</p>
                      <p><span>Order ID</span>: {this.state.data.order}</p>
                      <p><span>Name</span>: {this.state.data.name}</p>
                      <p><span>Description</span>: {this.state.data.description}</p>
                      {perms.includes("132") ? <p><span>Price</span>: {this.state.data.price}</p> : <p></p>}
                      <p><span>Quantity</span>: {this.state.data.quantity}</p>
                      <p><span>Status</span>: {this.state.data.status}</p>
                      <p><span>Deadline</span>: {dependencies.custom_date_format(this.state.data.deadline)}</p>
                      <p><span>Branch</span>: {this.state.data.branch.name}</p>
                      <p><span>Materials Branch</span>: {this.state.data.materials_branch.name}</p>
                      <p><span>Created At</span>: {dependencies.custom_date_format(this.state.data.created_at)}</p>
                      <p><span>Created From</span>: {this.state.data.created_from.name}</p>
                      <p><span>Accepted At</span>: {this.state.data.accepted_at ? dependencies.custom_date_format(this.state.data.accepted_at) : "-"}</p>
                      <p><span>Accepted From</span>: {this.state.data.accepted_from ? this.state.data.accepted_from.name : "-"}</p>
                      <p><span>Ready At</span>: {this.state.data.ready_at ? dependencies.custom_date_format(this.state.data.ready_at) : "-"}</p>
                      <p><span>Ready From</span>: {this.state.data.ready_from ? this.state.data.ready_from.name : "-"}</p>
                      <p><span>Delivered At</span>: {this.state.data.delivered_at ? dependencies.custom_date_format(this.state.data.delivered_at) : "-"}</p>
                      <p><span>Delivered From</span>: {this.state.data.delivered_from ? this.state.data.delivered_from.name : "-"}</p>
                      {perms.includes("132") && <>
                        <h3>Customer</h3>
                        <p><span>Name</span>: {this.state.data.customer.name}</p>
                        <p><span>Phone Number</span>: {this.state.data.customer.phoneNumber}</p>
                        <p><span>ID</span>: {this.state.data.customer._id}</p>
                      </>}
                      <h3>Materials</h3>
                      {Object.keys(this.state.data.materials_details).map((key, index)=>{
                        return(
                          <div className={Object.keys(this.state.data.materials_details).length != (index + 1) ? "materials_details_div" : "materials_details_div last"}>
                            <p><span>Name</span>: {this.state.data.materials_details[key].full_data.name}</p>
                            <p><span>Quantity</span>: {this.state.data.materials_details[key].used_quantity}</p>
                            <p><span>Material ID</span>: {key}</p>
                          </div>
                        )
                      })}
                      <h3>Features</h3>
                      {Object.keys(this.state.data.features).map((key)=>{
                        return(
                          <p><span>{key}</span>: {this.state.data.features[key]}</p>
                        )
                      })}
                      {this.state.data.images && this.state.data.images.length > 0 &&
                        <>
                          <h3>Images</h3>
                          <div className="ImageGallery_div">
                            <ImgPreview src={this.state.data.images}/>
                          </div>
                        </>
                      }
                    </div>
                    
                  </div>
                </div>
            }
          </div>
        </Row>
      </div>
    );
  }
}

export default Custom_product_full;
