import React, { Component } from 'react';
import { Alert, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {auth} from '../../../tools/Auth';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import successImg from "./../../../assets/img/success.png";
import Waiting from "./../../../views/Waiting/waiting";
import "./Customer.scss";
import FullTable from './../../CustomComponents/FullTable/FullTable';
import table_struc from './table_struc/table_struc.json';
import filter_struc from './table_struc/filters_struc.json';
import group_table_struc from './group_table_struc/table_struc.json';
import group_filter_struc from './group_table_struc/filters_struc.json';
let final_filter_struc = filter_struc;

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

class Customer extends Component {
  constructor(props){
    super(props);
    this.state = {
        branches: [],
        staff: [],
        //add modal
        addPath: "/api/customer/create",
        addModalWaiting: false,
        addModal: false,
        addModalError: false,
        addModalFaildMessage: "",
        addModalSuccess: false,
        branches: [],
        addForm: {
          name: "",
          phoneNumber: ""
        },
        //add group modal
        addGroupPath: "/api/customerGroup/create",
        addGroupModalWaiting: false,
        addGroupModal: false,
        addGroupModalError: false,
        addGroupModalFaildMessage: "",
        addGroupModalSuccess: false,
        branches: [],
        addGroupForm: {
          name: ""
        },
        //public
        publicError: false,
        logout: false,
    }; 
  }
  componentDidMount(){
    
  }
  //add modal
  toggleAddModal = (e) => {
    e.preventDefault();
    let addFormData = this.state.addForm;
    addFormData.name= "";
    addFormData.address= "";
    addFormData.phoneNumber= "";
    addFormData.type= "";
    this.setState({
      addModal: !this.state.addModal,
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  handleAddInputChange(inputName,event){
    let addFormData = this.state.addForm;
    addFormData[inputName] = event.target.value;
    this.setState({addForm: addFormData},()=>{
    })
  }
  handleAddSubmit = (event) => {
    //get form data
    let userObj = {
      "name": this.state.addForm.name,
      "phoneNumber": this.state.addForm.phoneNumber
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
  addModalReset(e){
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
                  <p>تم إنشاء العميل بنجاح.</p>
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
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="name"
                            value={this.state.addForm.name}
                            onChange={(e) => this.handleAddInputChange("name", e)}
                            validations={[required]}
                            placeholder="اسم العميل"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="phoneNumber"
                            value={this.state.addForm.phoneNumber}
                            onChange={(e) => this.handleAddInputChange("phoneNumber",e)}
                            validations={[required, phoneNumber]} 
                            placeholder="رقم هاتف العميل"
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
                <VButton className="btn btn-info">إنشاء</VButton>
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
  //add group modal
  toggleAddGroupModal = (e) => {
    e.preventDefault();
    let addGroupFormData = this.state.addGroupForm;
    addGroupFormData.name= "";
    this.setState({
      addGroupModal: !this.state.addGroupModal,
      addGroupForm: addGroupFormData,
      addGroupModalWaiting: false, 
      addGroupModalSuccess: false, 
      addGroupModalError: false, 
      addGroupModalFaildMessage: ""
    });
  }
  handleAddGroupInputChange(inputName,event){
    let addGroupFormData = this.state.addGroupForm;
    addGroupFormData[inputName] = event.target.value;
    this.setState({addGroupForm: addGroupFormData},()=>{
    })
  }
  handleAddGroupSubmit = (event) =>    {
    event.preventDefault();
    //get form data
    let userObj = {
      "name": this.state.addGroupForm.name
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({addGroupModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.addGroupPath,
          config,
          userData,
          (resp) => {
            this.setState({addGroupModalSuccess: true ,addGroupModalWaiting:false},()=>{
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
                this.setState({addGroupModalWaiting: false, addGroupModalError: true, addGroupModalFaildMessage: error.response.data.message});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
    });
  }
  addGroupModalReset(e){
    e.preventDefault();
    let addGroupFormData= this.state.addGroupForm;
    this.setState({
      addGroupForm: addGroupFormData,
      addGroupModalWaiting: false, 
      addGroupModalSuccess: false, 
      addGroupModalError: false, 
      addGroupModalFaildMessage: ""
    });
  }
  renderAddGroupModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.addGroupModal} toggle={this.toggleAddGroupModal}>
        <VForm onSubmit={this.handleAddGroupSubmit} >
          <ModalHeader toggle={this.toggleAddGroupModal}>
          مجموعة جديدة 
          </ModalHeader>
          <ModalBody>
          {this.state.addGroupModalError?
              <div>
                <Alert color="danger">
                  {this.state.addGroupModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.addGroupModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <p>تم إنشاء المجموعة بنجاح.</p>
                </div>
              :
                <div >
                {this.state.addGroupModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="name"
                            value={this.state.addGroupForm.name}
                            onChange={(e) => this.handleAddGroupInputChange("name", e)}
                            validations={[required]}
                            placeholder="اسم المجموعة"
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
          {this.state.addGroupModalSuccess || this.state.addGroupModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.addGroupModalSuccess || this.state.addGroupModalWaiting || this.state.addGroupModalError?
                null
              : 
                <VButton className="btn btn-info">إنشاء</VButton>
              }
              {this.state.addGroupModalError?
                <button className="accept-btn btn btn-default" onClick={this.addGroupModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleAddGroupModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
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
            {(JSON.parse(localStorage.userData).permissions.includes("142") || JSON.parse(localStorage.userData).permissions.includes("144")) &&
              <Row>
                <div className="x_panel small center btn-space">
                  {JSON.parse(localStorage.userData).permissions.includes("142") &&
                    <button onClick={this.toggleAddModal} type="button" className="btn">
                      عميل جديدة
                    </button>
                  }
                  {this.renderAddModal()}
                  {JSON.parse(localStorage.userData).permissions.includes("144") &&
                    <button onClick={this.toggleAddGroupModal} type="button" className="btn">
                      مجموعة جديدة
                    </button>
                  }
                  {this.renderAddGroupModal()}
                </div>
              </Row>
            }
            <div>
              <FullTable name="customers" path={"/api/customer/list"} table={table_struc} filters={final_filter_struc} />
            </div>
            <div>
              <FullTable name="customerGroup" path={"/api/customerGroup/list"} table={group_table_struc} filters={group_filter_struc} />
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