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
                  حدث خطا ما ، يرجي المحاوله في وقت لاحق.
                </Alert>
            :
              this.state.waiting ?
                <Waiting height="200px"/>
              :
                <div>
                  <div className="head_div">
                    <p>التفاصيل الكاملة</p>
                  </div>
                  <div className="body_div">
                    <div className="custom_prod_full">
                      <h3>بيانات عامة</h3>
                      <p><span>رقم المنتج</span>: {this.state.data._id}</p>
                      <p><span>رقم الطلب</span>: {this.state.data.order}</p>
                      <p><span>الاسم</span>: {this.state.data.name}</p>
                      <p><span>الوصف</span>: {this.state.data.description}</p>
                      {perms.includes("132") ? <p><span>السعر</span>: {this.state.data.price}</p> : <p></p>}
                      <p><span>العدد</span>: {this.state.data.quantity}</p>
                      <p><span>الحالة</span>: {dependencies.custom_status(this.state.data.status)}</p>
                      <p><span>تاريخ التسليم المتفق عليه</span>: {dependencies.custom_date_format(this.state.data.deadline)}</p>
                      <p><span>الفرع</span>: {this.state.data.branch.name}</p>
                      <p><span>المصنع</span>: {this.state.data.materials_branch.name}</p>
                      <p><span>تاريخ الانشاء</span>: {dependencies.custom_date_format(this.state.data.created_at)}</p>
                      <p><span>انشاء بواسطة</span>: {this.state.data.created_from.name}</p>
                      <p><span>تاريخ بدا العمل</span>: {this.state.data.accepted_at ? dependencies.custom_date_format(this.state.data.accepted_at) : "-"}</p>
                      <p><span>بدا العمل بواسطة</span>: {this.state.data.accepted_from ? this.state.data.accepted_from.name : "-"}</p>
                      <p><span>تاريخ اكتمال العمل</span>: {this.state.data.ready_at ? dependencies.custom_date_format(this.state.data.ready_at) : "-"}</p>
                      <p><span>اكتمل العمل بواسطة</span>: {this.state.data.ready_from ? this.state.data.ready_from.name : "-"}</p>
                      <p><span>تاريخ التسليم</span>: {this.state.data.delivered_at ? dependencies.custom_date_format(this.state.data.delivered_at) : "-"}</p>
                      <p><span>تم التسليم بواسطة</span>: {this.state.data.delivered_from ? this.state.data.delivered_from.name : "-"}</p>
                      <>
                        <h3>العميل</h3>
                        <p><span>الاسم</span>: {this.state.data.customer && this.state.data.customer.name ? this.state.data.customer.name : " - "}</p>
                        <p><span>رقم الهاتف</span>: {this.state.data.customer && this.state.data.customer.phoneNumber ? this.state.data.customer.phoneNumber : " - "}</p>
                        <p><span>رقم العميل</span>: {this.state.data.customer && this.state.data.customer._id ? this.state.data.customer._id : " - "}</p>
                      </>
                      <h3>الخامات</h3>
                      {Object.keys(this.state.data.materials_details).map((key, index)=>{
                        return(
                          <div className={Object.keys(this.state.data.materials_details).length != (index + 1) ? "materials_details_div" : "materials_details_div last"}>
                            <p><span>الاسم</span>: {this.state.data.materials_details[key].full_data.name}</p>
                            <p><span>العدد</span>: {this.state.data.materials_details[key].used_quantity}</p>
                            <p><span>رقم الخامة</span>: {key}</p>
                          </div>
                        )
                      })}
                      <h3>الخصائص</h3>
                      {Object.keys(this.state.data.features).map((key)=>{
                        return(
                          <p><span>{key}</span>: {this.state.data.features[key]}</p>
                        )
                      })}
                      {this.state.data.images && this.state.data.images.length > 0 &&
                        <>
                          <h3>الصور</h3>
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
