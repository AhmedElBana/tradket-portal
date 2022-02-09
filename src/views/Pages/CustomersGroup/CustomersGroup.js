import React, { Component } from 'react';
import { Alert, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import successImg from "./../../../assets/img/success.png";
import validator from 'validator';
import "./CustomersGroup.scss";
import Waiting from "./../../../views/Waiting/waiting";
import { auth } from '../../../tools/Auth';
import { dependencies } from '../../../tools/Dependencies';

let requiredError = "هذا الحقل إجباري."
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
let phoneNameError = "يرجي ادخال رقم هاتف صحيح."
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

const perms = JSON.parse(localStorage.userData).permissions;

class CustomersGroup extends Component {
  constructor(props){
    super(props);
    this.state = {
      //add modal
      addPath: "/api/customerGroup/add",
      addModalWaiting: false,
      addModal: false,
      addModalError: false,
      addModalFaildMessage: "",
      addModalSuccess: false,
      branches: [],
      addForm: {
        customer_id: ""
      },
      // remove customer
      removePath: "/api/customerGroup/remove",
      removeModalWaiting: false,
      removeModal: false,
      removeModalError: false,
      removeModalFaildMessage: "",
      removeModalSuccess: false,
      removeForm: {
        selected_customer: {}
      },
      // public
      waiting: true,
      data: {},
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
        "group_id": this.props.match.params.id
      }
    }
    httpClient.get(
        "/api/customerGroup/customers",
        config,
        (resp) => {
          this.setState({waiting: false, data: resp.data.data});
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
  //add modal
  toggleAddModal = (e) => {
    e.preventDefault();
    let addFormData = this.state.addForm;
    addFormData.customer_id= "";
    this.setState({
      addModal: !this.state.addModal,
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  handleAddInputChange = (inputName,value) => {
    let addFormData = this.state.addForm;
    addFormData[inputName] = value.value;
    this.setState({addForm: addFormData},()=>{
      console.log(this.state.addForm)
    })
  }
  handleAddSubmit = (event) => {
    //get form data
    let userObj = {
      "group_id": this.props.match.params.id,
      "customer_id": this.state.addForm.customer_id
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({addModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.addPath,
          config,
          userData,
          (resp) => {
            this.setState({addModalSuccess: true ,addModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
            });
          },
          (error) => {
            if(error.response){
              if(error.response.status === 401){
                this.setState({logout: true});
              }else if(error.response.status === 400){
                this.setState({addModalWaiting: false, addModalError: true, addModalFaildMessage: error.response.data.message});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
    });
    event.preventDefault();
  }
  addModalReset = (e) => {
    e.preventDefault();
    let addFormData= this.state.addForm;
    this.setState({
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  loadOptions = (inputValue) =>
    new Promise((resolve) => {
      //request data
      let config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        },
        params: {
          "phoneNumber": inputValue
        }
      }
      httpClient.get(
          "/api/customer/list",
          config,
          (resp) => {
            if(resp.data.data && resp.data.data.result){
              let final_arr = [];
              resp.data.data.result.map((ele) => {
                final_arr.push({ value: ele._id, label: `${ele.name} - ${ele.phoneNumber}` })
              })
              resolve(final_arr);
            }else{
              resolve([]);
            }
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
  });
  renderAddModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.addModal} toggle={this.toggleAddModal}>
        <VForm onSubmit={this.handleAddSubmit} >
          <ModalHeader toggle={this.toggleAddModal}>
            عميل جديد
          </ModalHeader>
          <ModalBody>
          {this.state.addModalError?
              <div>
                <Alert color="danger">
                  {this.state.addModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.addModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم إضافة العميل بنجاح.</p>
                </div>
              :
                <div >
                {this.state.addModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <AsyncSelect 
                            placeholder="بحث برقم الهاتف"
                            loadOptions={this.loadOptions} 
                            onChange={this.handleChange}
                            onChange={(value) => this.handleAddInputChange("customer_id", value)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          {this.state.addModalSuccess || this.state.addModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.addModalSuccess || this.state.addModalWaiting || this.state.addModalError?
                null
              : 
                this.state.addForm.customer_id != "" ? <VButton className="btn btn-info">إضافة</VButton> : null
              }
              {this.state.addModalError?
                <button className="accept-btn btn btn-default" onClick={this.addModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleAddModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //remove modal
  toggleRemoveModal = (e, new_customer) => {
    e.preventDefault();
    let removeFormData = this.state.removeForm;
    if(new_customer){
      removeFormData.selected_customer= {...new_customer}
    }else{
      removeFormData.selected_customer= {}
    }
    this.setState({
      removeModal: !this.state.removeModal,
      removeForm: removeFormData,
      removeModalWaiting: false, 
      removeModalSuccess: false, 
      removeModalError: false, 
      removeModalFaildMessage: ""
    });
  }
  handleRemoveSubmit = (event) => {
    //get form data
    let userObj = {
      "group_id": this.props.match.params.id,
      "customer_id": this.state.removeForm.selected_customer._id
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({removeModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.removePath,
          config,
          userData,
          (resp) => {
            this.setState({removeModalSuccess: true ,removeModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
            });
          },
          (error) => {
            if(error.response){
              if(error.response.status === 401){
                this.setState({logout: true});
              }else if(error.response.status === 400){
                this.setState({removeModalWaiting: false, removeModalError: true, removeModalFaildMessage: error.response.data.message});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
    });
    event.preventDefault();
  }
  removeModalReset = (e) => {
    e.preventDefault();
    let removeFormData= this.state.removeForm;
    removeFormData.selected_customer = {}
    this.setState({
      removeForm: removeFormData,
      removeModalWaiting: false, 
      removeModalSuccess: false, 
      removeModalError: false, 
      removeModalFaildMessage: ""
    });
  }
  renderRemoveModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.removeModal} toggle={this.toggleRemoveModal}>
        <VForm onSubmit={this.handleRemoveSubmit} >
          <ModalHeader toggle={this.toggleRemoveModal}>
            حذف عميل من المجموعة
          </ModalHeader>
          <ModalBody>
          {this.state.removeModalError?
              <div>
                <Alert color="danger">
                  {this.state.removeModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.removeModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم حذف العميل بنجاح.</p>
                </div>
              :
                <div >
                {this.state.removeModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    هل انت متاكد من حذف العميل ( {this.state.removeForm.selected_customer.name} - {this.state.removeForm.selected_customer.phoneNumber} )
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          {this.state.removeModalSuccess || this.state.removeModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.removeModalSuccess || this.state.removeModalWaiting || this.state.removeModalError?
                null
              : 
                <VButton className="btn btn-info">حذف</VButton>
              }
              {this.state.removeModalError?
                <button className="accept-btn btn btn-default" onClick={this.removeModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleRemoveModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  renderBody(){
    return(
      <div className="CustomersGroup-page">
        <div>
          <Row>
            <div className="x_panel">
              <div className="x_title">
                <h2>تفاصيل المجموعة</h2>
                <div className="ButtonsDiv">
                  {JSON.parse(localStorage.userData).permissions.includes("145") &&
                    <button onClick={this.toggleAddModal} type="button" className="btn">
                      إضافة عميل للمجموعة
                    </button>
                  }
                  {this.renderAddModal()}
                </div>  
              </div>
              <div className="x_content">
                {this.state.waiting?
                  <Waiting height="605px" />
                : 
                  <div className="">
                    {this.renderRemoveModal()}
                    {this.state.data.map((customer) => {
                      return (
                        <div className="customer_block">
                          <span className="remove_customer" onClick={(e) => {this.toggleRemoveModal(e, customer)}}>
                            <i className="fa fa-window-close" />
                          </span>
                          <p><span>رقم العميل :</span>{customer._id}</p>
                          <p><span>اسم العميل :</span>{customer.name}</p>
                          <p><span>رقم الهاتف :</span>{customer.phoneNumber}</p>
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
          </Row>
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

export default CustomersGroup;