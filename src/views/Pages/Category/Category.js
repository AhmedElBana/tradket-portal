import React, { Component } from 'react';
import { Alert, Col, Input, Table, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup,Label} from 'reactstrap';
import {auth} from '../../../tools/Auth';
import {dependencies} from '../../../tools/Dependencies';
import ReactPaginate from 'react-paginate';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Category.scss";
import successImg from "./../../../assets/img/success.png"

import Waiting from "./../../../views/Waiting/waiting";

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
let emailError= "يرجي ادخال بريد الكتروني صحيح.";
const email = (value) => {
  if (!validator.isEmail(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {emailError}
            </Alert>
          </div>;
  }
};
let fullNameError = "يرجي ادخال الاسم بالكامل"
const fullName = (value) => {
  var patt = new RegExp("[a-zA-Zا-ى]+ [a-zA-Zا-ى]+");
  if (!patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {fullNameError}
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


class Staff extends Component {
  constructor(props){
    super(props);
    this.state = {
        //users
        table: {
          headers: ["الرقم","اسم القسم"]
        },
        CategoriesTablePath: "/api/category/list",
        totalLength: 0,
        PageNumber: 0,
        PageSize: 10,
        CategoriesWaiting: true,
        showCategoriesDetails: false,
        selectedCategory: {},
        //details
        SubcategoriesPath: "/api/subCategory/list",
        detailsWaiting:true,
        subcategories: [],
        //add modal
        addCategoryPath: "/api/category/create",
        addModalWaiting: false,
        addModal: false,
        addModalError: false,
        addModalFaildMessage: "",
        addModalSuccess: false,
        branches: [],
        addForm: {
          name: ""
        },
        //subAdd modal
        subAddPath: "/api/subCategory/create",
        subAddModalWaiting: false,
        subAddModal: false,
        subAddModalError: false,
        subAddModalFaildMessage: "",
        subAddModalSuccess: false,
        subAddForm: {
          name: ""
        },
        //edit modal
        editPath: "/api/category/edit",
        editModalWaiting: false,
        editModal: false,
        editModalError: false,
        editModalFaildMessage: "",
        editModalSuccess: false,
        editForm: {
          name: ""
        },
        //editSub modal
        editSubPath: "/api/subCategory/edit",
        selectedSubcategory: {},
        editSubModalWaiting: false,
        editSubModal: false,
        editSubModalError: false,
        editSubModalFaildMessage: "",
        editSubModalSuccess: false,
        editSubForm: {
          name: ""
        },
        //public
        publicError: false,
        logout: false,
    };
    //list Categories
    this.requestCategories = this.requestCategories.bind(this);
    this.renderCategoriesBlock = this.renderCategoriesBlock.bind(this);
    this.categoryDetailsRef = React.createRef();
    this.handelRowClick = this.handelRowClick.bind(this);
    this.renderCategoriesTable = this.renderCategoriesTable.bind(this);
    this.renderCategoryDetails = this.renderCategoryDetails.bind(this);
    this.handleTablePageChange = this.handleTablePageChange.bind(this);
    this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
    //details
    this.requestSubcategories = this.requestSubcategories.bind(this);
    //add Category
    this.renderAddModal = this.renderAddModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.handleAddInputChange = this.handleAddInputChange.bind(this);
    this.handleAddCategorySubmit = this.handleAddCategorySubmit.bind(this);
    this.addModalReset = this.addModalReset.bind(this);
    //add Subcategory
    this.renderSubAddModal = this.renderSubAddModal.bind(this);
    this.toggleSubAddModal = this.toggleSubAddModal.bind(this);
    this.handleSubAddInputChange = this.handleSubAddInputChange.bind(this);
    this.handleSubAddCategorySubmit = this.handleSubAddCategorySubmit.bind(this);
    this.subAddModalReset = this.subAddModalReset.bind(this);
    //edit Category
    this.renderEditModal = this.renderEditModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.handleEditInputChange = this.handleEditInputChange.bind(this);
    this.handleEditCategorySubmit = this.handleEditCategorySubmit.bind(this);
    this.editModalReset = this.editModalReset.bind(this);
    //edit Subcategory
    this.handelSubClick = this.handelSubClick.bind(this);
    this.renderEditSubModal = this.renderEditSubModal.bind(this);
    this.toggleEditSubModal = this.toggleEditSubModal.bind(this);
    this.handleEditSubInputChange = this.handleEditSubInputChange.bind(this);
    this.handleEditSubCategorySubmit = this.handleEditSubCategorySubmit.bind(this);
    this.editSubModalReset = this.editSubModalReset.bind(this);

    this.loadDefaultData();
    
  }
  loadDefaultData(){
    //load first 10 records
    let startFilters = {
      "page": this.state.PageNumber + 1,
      "page_size": this.state.PageSize
    }
    this.requestCategories(startFilters);
  }
  handleTablePageChange(page) {
    this.setState({PageNumber: page.selected, CategoriesWaiting: true, showCategoriesDetails: false},()=>{
      let filters = {
        page: this.state.PageNumber + 1,
        page_size: this.state.PageSize,
        token: auth.getMerchantToken()
      }
      this.requestCategories(filters);
    });
  }
  handleTableSizeChange(event){
    let maxPageNum = Math.ceil(this.state.totalLength/event.target.value) - 1;
    if(this.state.PageNumber > maxPageNum){
      this.setState({PageSize: event.target.value, PageNumber: maxPageNum, CategoriesWaiting: true},()=>{
        let filters = {
          page: this.state.PageNumber + 1,
          page_size: this.state.PageSize,
          token: auth.getMerchantToken()
        }
        this.requestCategories(filters);
      });
    }else{
      this.setState({PageSize: event.target.value, CategoriesWaiting: true},()=>{
        let filters = {
          page: this.state.PageNumber + 1,
          page_size: this.state.PageSize,
          token: auth.getMerchantToken()
        }
        this.requestCategories(filters);
      });
    }
  }
  requestCategories(filters){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
    },
      params: {
        ...this.state.currentFilters,
        ...filters
      }
    }
    httpClient.get(
        this.state.CategoriesTablePath,
        config,
        (resp) => {
          let categories = resp.data.data.result;
          this.setState({CategoriesData: categories, totalLength: resp.data.data.total, CategoriesWaiting: false},()=>{
          });
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
  renderCategoriesTable(){
    return(
      <div>
        <Table className="usersTable mainTable">
          <thead>
            <tr>
              {this.state.table.headers.map((ele,index)=>{
                return <th key={index}>{ele}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.CategoriesData.map((ele,index)=>{
              return(
                <tr key={ele._id}  onClick={()=> this.handelRowClick(ele,index)} className={this.state.showCategoriesDetails && (ele._id == this.state.selectedCategory._id)? "selectedRow": ""}>
                  <td>{ele._id}</td>
                  <td>{ele.name}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
  renderCategoriesBlock(){
    return(
      <div>
        <Row>
          <div className="x_panel">
            <div className="x_title">
              <h2>الاقسام</h2>
              <div className="ButtonsDiv">
                {JSON.parse(localStorage.userData).permissions.includes("108")?
                  <button onClick={this.toggleAddModal} type="button" className="btn">
                    قسم جديد
                  </button>:null
                }
              </div>  
            </div>
            <div className="x_content">
              {this.state.CategoriesWaiting?
                <Waiting height="605px" />
              : 
                <div className="">
                  <div className="tableLength">
                        <select className="tradket_select" onChange={this.handleTableSizeChange} value={this.state.PageSize}>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                    </div>
                      <div className="currentTableDiv">
                        {this.renderCategoriesTable()}
                      </div>
                      <ReactPaginate
                        pageCount={Math.ceil(this.state.totalLength/this.state.PageSize)}
                        marginPagesDisplayed={2}
                        onPageChange={this.handleTablePageChange}
                        forcePage={this.state.PageNumber}
                        containerClassName="paginationList"
                        nextLabel="التالي"
                        previousLabel="السابق"
                      />
                </div>
              }
            </div>
          </div>
        </Row>
        {this.state.showCategoriesDetails?
          this.renderCategoryDetails()
        :
          null
        }
      </div>
    )
  }
  //dedtails
  handelRowClick(user,index){
    //reset collapse open 
      if(this.state.showCategoriesDetails){
        if(user._id === this.state.selectedCategory._id){
          this.setState({showCategoriesDetails: false});
        }else{
          this.setState({selectedCategory: user, detailsWaiting: true},()=>{
            this.requestSubcategories(user._id);
            //scroll to transaction details
            window.scrollTo({
              top:this.categoryDetailsRef.current.offsetTop, 
              behavior: "smooth"   // Optional, adds animation
            })
          });
        }
      }else{
        this.setState({selectedCategory: user, showCategoriesDetails: true, detailsWaiting: true},()=>{
          //scroll to transaction details
          this.requestSubcategories(user._id);
          window.scrollTo({
            top:this.categoryDetailsRef.current.offsetTop, 
            behavior: "smooth"   // Optional, adds animation
          })
        });
      }
  }
  requestSubcategories(categoryId){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
    },
      params: {
        "page_size": 1000,
        "category_id": categoryId
      }
    }
    httpClient.get(
        this.state.SubcategoriesPath,
        config,
        (resp) => {
          let subcategories = resp.data.data.result;
          console.log(subcategories)
          this.setState({subcategories: subcategories, detailsWaiting: false});
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
  renderCategoryDetails(){
    return(
      <Row>
        <div className="x_panel"  ref={this.categoryDetailsRef}>
          <div className="x_title details">
            <h2>{this.state.selectedCategory.name}</h2>
            <div className="ButtonsDiv">
              {JSON.parse(localStorage.userData).permissions.includes("109")?
                  <button onClick={this.toggleEditModal} type="button" className="btn">
                    تعديل
                  </button>:null
              }
              {JSON.parse(localStorage.userData).permissions.includes("108")?
                  <button onClick={this.toggleSubAddModal} type="button" className="btn">
                    اضافة قسم فرعي
                  </button>:null
              }
              <button onClick={() => this.setState({showCategoriesDetails:false})} type="button" className="accept-btn btn btn-secondary close_btn">
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>           
          </div>
          <div className="x_content Category">
            <br/>
            {this.state.detailsWaiting?
              <Waiting height="150px" />
              :
              <div>
                <div className="modal_details">
                  <span className="title">الرقم</span><span className="value">{this.state.selectedCategory._id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">اسم القسم</span><span className="value">{this.state.selectedCategory.name}</span>
                </div>
                <div className="modal_details">
                  <span className="title">الاقسام الفرعية</span><span className="value">
                    {this.state.subcategories.length === 0?
                      <span> - </span>
                    :
                      <span>
                        {this.state.subcategories.map((subcategory)=>{
                          return(
                            <span className="table_block subcategory">
                              {subcategory.name}
                              <i className="fa fa-pencil edit_btn" onClick={(e)=>{this.handelSubClick(subcategory,e)}} ></i>
                            </span>
                          )
                        })}
                      </span>
                    }
                  </span>
                </div>
                
              </div>
            }
          </div>
        </div> 
      </Row>
    );
  }
  //add modal
  toggleAddModal(e){
    e.preventDefault();
    let addFormData = this.state.addForm;
    addFormData.name= "";
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
    this.setState({addForm: addFormData})
  }
  handleAddCategorySubmit(event){
    //get form data
    let userObj = {
      "name": this.state.addForm.name
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
          this.state.addCategoryPath,
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
        <VForm onSubmit={this.handleAddCategorySubmit} >
          <ModalHeader toggle={this.toggleAddModal}>
            قسم جديد
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
                  <p>تم إنشاء القسم بنجاح.</p>
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
                            placeholder="اسم القسم"
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
  //subAdd modal
  toggleSubAddModal(e){
    e.preventDefault();
    let subAddFormData = this.state.subAddForm;
    subAddFormData.name= "";
    this.setState({
      subAddModal: !this.state.subAddModal,
      subAddForm: subAddFormData,
      subAddModalWaiting: false, 
      subAddModalSuccess: false, 
      subAddModalError: false, 
      subAddModalFaildMessage: ""
    });
  }
  handleSubAddInputChange(inputName,event){
    let subAddFormData = this.state.subAddForm;
    subAddFormData[inputName] = event.target.value;
    this.setState({subAddForm: subAddFormData})
  }
  handleSubAddCategorySubmit(event){
    //get form data
    let userObj = {
      "category_id": this.state.selectedCategory._id,
      "name": this.state.subAddForm.name
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({subAddModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.subAddPath,
          config,
          userData,
          (resp) => {
            this.setState({subAddModalSuccess: true ,subAddModalWaiting:false},()=>{
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
                this.setState({subAddModalWaiting: false, subAddModalError: true, subAddModalFaildMessage: error.response.data.message});
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
  subAddModalReset(e){
    e.preventDefault();
    let subAddFormData= this.state.subAddForm;
    this.setState({
      subAddForm: subAddFormData,
      subAddModalWaiting: false, 
      subAddModalSuccess: false, 
      subAddModalError: false, 
      subAddModalFaildMessage: ""
    });
  }
  renderSubAddModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.subAddModal} toggle={this.toggleSubAddModal}>
        <VForm onSubmit={this.handleSubAddCategorySubmit} >
          <ModalHeader toggle={this.toggleSubAddModal}>
            قسم فرعي جديد
          </ModalHeader>
          <ModalBody>
          {this.state.subAddModalError?
              <div>
                <Alert color="danger">
                  {this.state.subAddModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.subAddModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم إنشاء القسم الفرع بنجاح.</p>
                </div>
              :
                <div >
                {this.state.subAddModalWaiting?
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
                            value={this.state.subAddForm.name}
                            onChange={(e) => this.handleSubAddInputChange("name", e)}
                            validations={[required]}
                            placeholder="اسم القسم الفرعي"
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
          {this.state.subAddModalSuccess || this.state.subAddModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.subAddModalSuccess || this.state.subAddModalWaiting || this.state.subAddModalError?
                null
              : 
                <VButton className="btn btn-info">إنشاء</VButton>
              }
              {this.state.subAddModalError?
                <button className="accept-btn btn btn-default" onClick={this.subAddModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleSubAddModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //edit modal
  toggleEditModal(e){
    e.preventDefault();
    let editFormData = this.state.editForm;
    editFormData.name= this.state.selectedCategory.name;
    this.setState({
      editModal: !this.state.editModal,
      editForm: editFormData,
      editModalWaiting: false, 
      editModalSuccess: false, 
      editModalError: false, 
      editModalFaildMessage: ""
    });
  }
  handleEditInputChange(inputName,event){
    let editFormData = this.state.editForm;
    editFormData[inputName] = event.target.value;
    this.setState({editForm: editFormData})
  }
  handleEditCategorySubmit(event){
    //get form data
    let userObj = {
      "category_id": this.state.selectedCategory._id,
      "name": this.state.editForm.name
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({editModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.editPath,
          config,
          userData,
          (resp) => {
            this.setState({editModalSuccess: true ,editModalWaiting:false},()=>{
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
                this.setState({editModalWaiting: false, editModalError: true, editModalFaildMessage: error.response.data.message});
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
  editModalReset(e){
    e.preventDefault();
    let editFormData= this.state.editForm;
    this.setState({
      editForm: editFormData,
      editModalWaiting: false, 
      editModalSuccess: false, 
      editModalError: false, 
      editModalFaildMessage: ""
    });
  }
  renderEditModal(){
    return(
      <Modal className="usersModal modal-lg" isOpen={this.state.editModal} toggle={this.toggleEditModal}>
        <VForm onSubmit={this.handleEditCategorySubmit} >
          <ModalHeader toggle={this.toggleEditModal}>
            تعديل قسم
          </ModalHeader>
          <ModalBody>
          {this.state.editModalError?
              <div>
                <Alert color="danger">
                  {this.state.editModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.editModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم تعديل القسم بنجاح.</p>
                </div>
              :
                <div >
                {this.state.editModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="editModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="name"
                            value={this.state.editForm.name}
                            onChange={(e) => this.handleEditInputChange("name", e)}
                            validations={[required]}
                            placeholder="اسم القسم"
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
          {this.state.editModalSuccess || this.state.editModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.editModalSuccess || this.state.editModalWaiting || this.state.editModalError?
                null
              : 
                <VButton className="btn btn-info">تعديل</VButton>
              }
              {this.state.editModalError?
                <button className="accept-btn btn btn-default" onClick={this.editModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleEditModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //editSub modal
  handelSubClick(subcategory,e){
    this.setState({selectedSubcategory: subcategory},()=>{
      this.toggleEditSubModal(e)
    })
  }
  toggleEditSubModal(e){
    e.preventDefault();
    let editSubFormData = this.state.editSubForm;
    editSubFormData.name= this.state.selectedSubcategory.name;
    this.setState({
      editSubModal: !this.state.editSubModal,
      editSubForm: editSubFormData,
      editSubModalWaiting: false, 
      editSubModalSuccess: false, 
      editSubModalError: false, 
      editSubModalFaildMessage: ""
    });
  }
  handleEditSubInputChange(inputName,event){
    let editSubFormData = this.state.editSubForm;
    editSubFormData[inputName] = event.target.value;
    this.setState({editSubForm: editSubFormData})
  }
  handleEditSubCategorySubmit(event){
    //get form data
    let userObj = {
      "subCategory_id": this.state.selectedSubcategory._id,
      "name": this.state.editSubForm.name
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({editSubModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.editSubPath,
          config,
          userData,
          (resp) => {
            this.setState({editSubModalSuccess: true ,editSubModalWaiting:false},()=>{
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
                this.setState({editSubModalWaiting: false, editSubModalError: true, editSubModalFaildMessage: error.response.data.message});
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
  editSubModalReset(e){
    e.preventDefault();
    let editSubFormData= this.state.editSubForm;
    this.setState({
      editSubForm: editSubFormData,
      editSubModalWaiting: false, 
      editSubModalSuccess: false, 
      editSubModalError: false, 
      editSubModalFaildMessage: ""
    });
  }
  renderEditSubModal(){
    return(
      <Modal className="usersModal modal-lg" isOpen={this.state.editSubModal} toggle={this.toggleEditSubModal}>
        <VForm onSubmit={this.handleEditSubCategorySubmit} >
          <ModalHeader toggle={this.toggleEditSubModal}>
            تعديل قسم فرعي
          </ModalHeader>
          <ModalBody>
          {this.state.editSubModalError?
              <div>
                <Alert color="danger">
                  {this.state.editSubModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.editSubModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم تعديل القسم الفرعي بنجاح.</p>
                </div>
              :
                <div >
                {this.state.editSubModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="editSubModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="name"
                            value={this.state.editSubForm.name}
                            onChange={(e) => this.handleEditSubInputChange("name", e)}
                            validations={[required]}
                            placeholder="اسم القسم الفرعي"
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
          {this.state.editSubModalSuccess || this.state.editSubModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.editSubModalSuccess || this.state.editSubModalWaiting || this.state.editSubModalError?
                null
              : 
                <VButton className="btn btn-info">تعديل</VButton>
              }
              {this.state.editSubModalError?
                <button className="accept-btn btn btn-default" onClick={this.editSubModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleEditSubModal}>إلغاء</button>
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
          <div>
            {this.renderCategoriesBlock()}
            {this.renderAddModal()}
            {this.renderEditModal()}
            {this.renderEditSubModal()}
            {this.renderSubAddModal()}
          </div>
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

export default Staff;
