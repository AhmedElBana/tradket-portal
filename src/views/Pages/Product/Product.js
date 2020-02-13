import React, { Component } from 'react';
import { Alert, Col, Input, Table, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup,Label} from 'reactstrap';
import {auth} from '../../../tools/Auth';
import {dependencies} from '../../../tools/Dependencies';
import ReactPaginate from 'react-paginate';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import {httpClient} from './../../../tools/HttpClient';
import validator from 'validator';
import "./Product.scss";
import successImg from "./../../../assets/img/success.png"

import Waiting from "./../../../views/Waiting/waiting";

let requiredError = "This field is required."
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
let emailError= "Please enter valid email.";
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
let fullNameError = "Please enter your full name."
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
let phoneNameError = "Please enter valid phone number  (more than 4 number)."
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
let NumberError = "Please enter valid number  (more than 0)."
const NumberV = (value) => {
  // var patt = new RegExp("^(01)([0-9]*)$");
  if (isNaN(value) || value <= 0) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {NumberError}
            </Alert>
          </div>;
  }
}


class Product extends Component {
  constructor(props){
    super(props);
    this.state = {
        //users
        table: {
          headers: ["ID","name","Price","Quantity","Active"]
        },
        detailsHeaders: ["Branch ID","Branch Name","Quantity"],
        usersTablePath: "/api/product/list",
        integData: [],
        totalLength: 0,
        PageNumber: 0,
        PageSize: 10,
        usersWaiting: true,
        detailsWaiting:false,
        showUsersDetails: false,
        selectedUser: {},
        //add modal
        addStaffPath: "/api/productGroup/create",
        addModalWaiting: false,
        addModal: false,
        addModalError: false,
        addModalFaildMessage: "",
        addModalSuccess: false,
        branches: [],
        selectedFeatures: [],
        selectedSubProductFeatures: ["5e432510729b9c2480d50ed0","5e432532729b9c2480d50ed1"],
        SubProducts: [],
        addForm: {
          _id: "",
          name: "",
          branch_id: "",
          category_id: "",
          subCategory_id: "",
          price: "",
          quantity: "",
          description: "",
          features: {}
        },
        //edit modal
        editPath: "/api/branch/edit",
        editModalWaiting: false,
        editModal: false,
        editModalError: false,
        editModalFaildMessage: "",
        editModalSuccess: false,
        editBranches: [],
        editForm: {
          name: "",
          address: "",
          phoneNumber: "",
          type: ""
        },
        //addMore modal
        addMoreStaffPath: "/api/product/add",
        addMoreModalWaiting: false,
        addMoreModal: false,
        addMoreModalError: false,
        addMoreModalFaildMessage: "",
        addMoreModalSuccess: false,
        addMoreForm: {
          quantity: "",
          branch: ""
        },
        //deactivate modal
        deactivateModalWaiting: false,
        deactivateModal: false,
        deactivateModalError: false,
        deactivateModalFaildMessage: "",
        deactivateModalSuccess: false,
        //activate modal
        activateModalWaiting: false,
        activateModal: false,
        activateModalError: false,
        activateModalFaildMessage: "",
        activateModalSuccess: false,
        //branches
        brancesLoaded: false,
        branchName: {},
        fullBranchs: [],
        //categories
        categoriesLoaded: false,
        categoriesName: {},
        fullCategories: [],
        //subCategories
        subCategoriesLoaded: false,
        subCategoriesName: {},
        fullSubCategories: [],
        //features
        featuresLoaded: false,
        fullFeatures: [],
        features_ids: {},
        //public
        publicError: false,
        logout: false,
    };
    //list user
    this.requestUsers = this.requestUsers.bind(this);
    this.renderUsersBlock = this.renderUsersBlock.bind(this);
    this.userDetailsRef = React.createRef();
    this.handelRowClick = this.handelRowClick.bind(this);
    this.renderUsersTable = this.renderUsersTable.bind(this);
    this.renderUserDetails = this.renderUserDetails.bind(this);
    this.handleTablePageChange = this.handleTablePageChange.bind(this);
    this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
    //add user
    this.renderAddModal = this.renderAddModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.handleAddInputChange = this.handleAddInputChange.bind(this);
    this.handleAddProductSubmit = this.handleAddProductSubmit.bind(this);
    this.addModalReset = this.addModalReset.bind(this);
    this.onSelectFeaturesForm = this.onSelectFeaturesForm.bind(this);
    this.onSelectSubProductForm = this.onSelectSubProductForm.bind(this);
    this.renderAddFormSubProducts = this.renderAddFormSubProducts.bind(this);
    //edit user
    this.renderEditModal = this.renderEditModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.handleEditInputChange = this.handleEditInputChange.bind(this);
    this.handleEditUserSubmit = this.handleEditUserSubmit.bind(this);
    this.editModalReset = this.editModalReset.bind(this);
    //addMore user
    this.renderAddMoreModal = this.renderAddMoreModal.bind(this);
    this.toggleAddMoreModal = this.toggleAddMoreModal.bind(this);
    this.handleAddMoreInputChange = this.handleAddMoreInputChange.bind(this);
    this.handleAddMoreProductSubmit = this.handleAddMoreProductSubmit.bind(this);
    this.addMoreModalReset = this.addMoreModalReset.bind(this);
    //deactivate modal
    this.renderDeactivateModal = this.renderDeactivateModal.bind(this);
    this.toggleDeactivateModal = this.toggleDeactivateModal.bind(this);
    this.handleDeactivateUserSubmit = this.handleDeactivateUserSubmit.bind(this);
    this.DeactivateModalReset = this.DeactivateModalReset.bind(this);
    //activate modal
    this.renderActivateModal = this.renderActivateModal.bind(this);
    this.toggleActivateModal = this.toggleActivateModal.bind(this);
    this.handleActivateUserSubmit = this.handleActivateUserSubmit.bind(this);
    this.ActivateModalReset = this.ActivateModalReset.bind(this);

    this.requestBranches = this.requestBranches.bind(this);
    this.requestCategories = this.requestCategories.bind(this);
    this.requestSubCategories = this.requestSubCategories.bind(this);
    this.requestFeatures = this.requestFeatures.bind(this);
    this.loadDefaultData();
    
  }
  loadDefaultData(){
    //load first 10 records
    let startFilters = {
      "page": this.state.PageNumber + 1,
      "page_size": this.state.PageSize
    }
    this.requestUsers(startFilters);
    this.requestBranches();
    this.requestCategories();
    this.requestSubCategories();
    this.requestFeatures();
  }
  requestBranches(){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "page_size": "1000"
      }
    }
    httpClient.get(
        "/api/branch/list",
        config,
        (resp) => {
          let branches = {};
          resp.data.data.result.map((branch)=>{
            branches[branch._id] = branch.name;
          })
          this.setState({branchName: branches, fullBranchs: resp.data.data.result, brancesLoaded: true});
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
  requestCategories(){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "page_size": "1000"
      }
    }
    httpClient.get(
        "/api/category/list",
        config,
        (resp) => {
          let categories = {};
          resp.data.data.result.map((category)=>{
            categories[category._id] = category.name;
          })
          this.setState({categoriesName: categories, fullCategories: resp.data.data.result, categoriesLoaded: true});
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
  requestSubCategories(){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "page_size": "10000"
      }
    }
    httpClient.get(
        "/api/subCategory/list",
        config,
        (resp) => {
          let subCategories = {};
          resp.data.data.result.map((subCategory)=>{
            subCategories[subCategory._id] = subCategory.name;
          })
          this.setState({subCategoriesName: subCategories, fullSubCategories: resp.data.data.result, subCategoriesLoaded: true});
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
  requestFeatures(){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "page_size": "1000"
      }
    }
    httpClient.get(
        "/api/feature/list",
        config,
        (resp) => {
          let features = {}
          resp.data.data.result.map((feature)=>{
            features[feature._id] = feature
          })
          this.setState({features_ids: features,fullFeatures: resp.data.data.result, featuresLoaded: true});
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
  handleTablePageChange(page) {
    this.setState({PageNumber: page.selected, usersWaiting: true, showUsersDetails: false},()=>{
      let filters = {
        page: this.state.PageNumber + 1,
        page_size: this.state.PageSize,
        token: auth.getMerchantToken()
      }
      this.requestUsers(filters);
    });
  }
  handleTableSizeChange(event){
    let maxPageNum = Math.ceil(this.state.totalLength/event.target.value) - 1;
    if(this.state.PageNumber > maxPageNum){
      this.setState({PageSize: event.target.value, PageNumber: maxPageNum, usersWaiting: true},()=>{
        let filters = {
          page: this.state.PageNumber + 1,
          page_size: this.state.PageSize,
          token: auth.getMerchantToken()
        }
        this.requestUsers(filters);
      });
    }else{
      this.setState({PageSize: event.target.value, usersWaiting: true},()=>{
        let filters = {
          page: this.state.PageNumber + 1,
          page_size: this.state.PageSize,
          token: auth.getMerchantToken()
        }
        this.requestUsers(filters);
      });
    }
  }
  requestUsers(filters){
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
        this.state.usersTablePath,
        config,
        (resp) => {
          let users = resp.data.data.result;
          console.log(resp.data.data.result)
          this.setState({usersData: users, totalLength: resp.data.data.total, usersWaiting: false},()=>{
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
  renderUsersTable(){
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
            {this.state.usersData.map((ele,index)=>{
              return(
                <tr key={ele._id}  onClick={()=> this.handelRowClick(ele,index)} className={this.state.showUserDetails && (ele._id == this.state.selectedUser._id)? "selectedRow": ""}>
                  <td>{ele._id}</td>
                  <td>{ele.name}</td>
                  <td>{ele.price}</td>
                  <td>{ele.quantity}</td>
                  <td>{dependencies.boolName(ele.active)}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
  renderUsersBlock(){
    return(
      <div>
        <Row>
          <div className="x_panel">
            <div className="x_title">
              <h2>Products</h2>
              <div className="ButtonsDiv">
                {JSON.parse(localStorage.userData).permissions.includes("116")?
                  <button onClick={this.toggleAddModal} type="button" className="btn">
                    New Product
                  </button>:null
                }
              </div>  
            </div>
            <div className="x_content">
              {this.state.usersWaiting || !this.state.brancesLoaded?
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
                        {this.renderUsersTable()}
                      </div>
                      <ReactPaginate
                        pageCount={Math.ceil(this.state.totalLength/this.state.PageSize)}
                        marginPagesDisplayed={2}
                        onPageChange={this.handleTablePageChange}
                        forcePage={this.state.PageNumber}
                        containerClassName="paginationList"
                        nextLabel="Next"
                        previousLabel="Previous"
                      />
                </div>
              }
            </div>
          </div>
        </Row>
        {this.state.showUserDetails?
          this.renderUserDetails()
        :
          null
        }
      </div>
    )
  }
  //dedtails
  handelRowClick(user,index){
    //reset collapse open 
      if(this.state.showUserDetails){
        if(user._id === this.state.selectedUser._id){
          this.setState({showUserDetails: false});
        }else{
          this.setState({selectedUser: user},()=>{
            //scroll to transaction details
            window.scrollTo({
              top:this.userDetailsRef.current.offsetTop, 
              behavior: "smooth"   // Optional, adds animation
            })
          });
        }
      }else{
        this.setState({selectedUser: user, showUserDetails: true},()=>{
          //scroll to transaction details
          window.scrollTo({
            top:this.userDetailsRef.current.offsetTop, 
            behavior: "smooth"   // Optional, adds animation
          })
        });
      }
  }
  renderUserDetails(){
    return(
      <Row>
        <div className="x_panel"  ref={this.userDetailsRef}>
          <div className="x_title details">
            <h2>{this.state.selectedUser.name}</h2>
            <div className="ButtonsDiv">
              {JSON.parse(localStorage.userData).permissions.includes("116")?
                  <button onClick={this.toggleAddMoreModal} type="button" className="btn">
                    More Quantity
                  </button>:null
              }
              {/* 
                {JSON.parse(localStorage.userData).permissions.includes("116")?
                  <button onClick={this.toggleEditModal} type="button" className="btn">
                    Edit
                  </button>:null
                }
                {JSON.parse(localStorage.userData).permissions.includes("107")?
                  <span>
                    {this.state.selectedUser.active?
                      <button onClick={this.toggleDeactivateModal} type="button" className="btn">
                        Deacttivate
                      </button>
                    :
                      <button onClick={this.toggleActivateModal} type="button" className="btn">
                        Acttivate
                      </button>
                    }
                  </span>:null
              } */}
              <button onClick={() => this.setState({showUserDetails:false})} type="button" className="accept-btn btn btn-secondary close_btn">
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>           
          </div>
          <div className="x_content">
            <br/>
            {this.state.detailsWaiting?
              <Waiting height="300px" />
              :
              <div>
                <div className="modal_details">
                  <span className="title">Product ID</span><span className="value">{this.state.selectedUser._id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Group ID</span><span className="value">{this.state.selectedUser.group_id}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Name</span><span className="value">{this.state.selectedUser.name}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Price</span><span className="value">{this.state.selectedUser.price}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Quantity</span><span className="value">{this.state.selectedUser.quantity}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Active</span><span className="value">{dependencies.boolName(this.state.selectedUser.active)}</span>
                </div>
                <div className="modal_details">
                  <span className="title">Branches Map</span>
                  <div className="product_map">
                    <Table className="usersTable mainTable">
                      <thead>
                        <tr>
                          {this.state.detailsHeaders.map((ele,index)=>{
                            return <th key={index}>{ele}</th>
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(this.state.selectedUser["map"]).map((_id,index)=>{
                          return(
                            <tr key={_id}>
                              <td>{_id}</td>
                              <td>{this.state.branchName[_id]}</td>
                              <td>{this.state.selectedUser["map"][_id]}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
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
    addFormData._id= "";
    addFormData.name= "";
    addFormData.branch_id= "";
    addFormData.category_id= "";
    addFormData.subCategory_id= "";
    addFormData.price= "";
    addFormData.quantity= "";
    addFormData.description= "";
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
  handleAddProductSubmit(event){
    //get form data
    var bodyFormData = new FormData();
    bodyFormData.set('name', this.state.addForm.name);
    bodyFormData.set('branch_id', this.state.addForm.branch_id);
    bodyFormData.set('category_id', this.state.addForm.category_id);
    bodyFormData.set('price', this.state.addForm.price);
    bodyFormData.set('quantity', this.state.addForm.quantity);
    bodyFormData.set('description', this.state.addForm.description);
    if(this.state.addForm._id !== ""){
      bodyFormData.set('_id', this.state.addForm._id);
    }
    if(this.state.addForm.subCategory_id !== ""){
      bodyFormData.set('subCategory_id', this.state.addForm.subCategory_id);
    }
    let features = {}
    if(document.querySelectorAll("#addFormFeatures select").length > 0){
      let elements = document.querySelectorAll("#addFormFeatures select");
      elements.forEach.call(elements, function(ele) {
        features[ele.name] = ele.value;
      });
      console.log(JSON.stringify(features))
      bodyFormData.set('features',JSON.stringify(features) );
    }
    //start waiting
    this.setState({addModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.addStaffPath,
          config,
          bodyFormData,
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
  onSelectFeaturesForm(optionsList) {
    let optionsArr = [];
    optionsList.map((ele)=>{
      optionsArr.push(ele._id)
    })
    this.setState({selectedFeatures: optionsArr},()=>{
      console.log(this.state)
    })
  }
  onSelectSubProductForm(optionsList) {
    let optionsArr = [];
    optionsList.map((ele)=>{
      optionsArr.push(ele._id)
    })
    this.setState({selectedSubProductFeatures: optionsArr},()=>{
      console.log(this.state)
    })
  }
  renderAddFormSubProducts(){
    let optionsNumber = 1;
    this.state.selectedSubProductFeatures.map((feature_id)=>{
      if(this.state.features_ids[feature_id]){
        optionsNumber *= this.state.features_ids[feature_id].options.length;
        this.state.features_ids[feature_id].options.map((option)=>{
          console.log(option)
        })
      }
    })
    let opttionsArr = [];
    //"features": {"size": 44,"color": "black"}
    for(let n = 0; n < optionsNumber; n++){
      opttionsArr.push({"features": {}})
    }
    this.state.selectedSubProductFeatures.map((feature_id,index)=>{
      if(this.state.features_ids[feature_id]){
        let prevSize = 1;
        if(index > 0){
          this.state.selectedSubProductFeatures.map((subFeature_id,subIndex)=>{
            if(subIndex < index){
              prevSize *= this.state.features_ids[subFeature_id].options.length;
            }
          })
        }
        let patchSize = optionsNumber / (this.state.features_ids[feature_id].options.length * prevSize);
        console.log("prevSize: " + prevSize)
        console.log("patchSize: " + patchSize)
        console.log("option: " + this.state.features_ids[feature_id].options.length)
        for(let z = 0; z < prevSize; z++){
          this.state.features_ids[feature_id].options.map((option, optionIndex)=>{
            for(let x = 0; x < patchSize; x++){
              opttionsArr[(z * patchSize * this.state.features_ids[feature_id].options.length) + (optionIndex * patchSize) + x].features[this.state.features_ids[feature_id].name] = option;
            }
          })
        }
      }
    })
    console.log(opttionsArr)
    opttionsArr.map((ele)=>{
      console.log(ele.features)
    })
    return (<div>{optionsNumber} <br/> </div>)
  }
  renderAddModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.addModal} toggle={this.toggleAddModal}>
        <VForm onSubmit={this.handleAddProductSubmit} >
          <ModalHeader toggle={this.toggleAddModal}>
            New Product
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
                  <h1>Congratulations</h1>
                  <p>Your Product has been created successfully.</p>
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
                            name="id"
                            value={this.state.addForm._id}
                            onChange={(e) => this.handleAddInputChange("_id", e)}
                            validations={[]}
                            placeholder="Prouct ID (optional)"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="name"
                            value={this.state.addForm.name}
                            onChange={(e) => this.handleAddInputChange("name", e)}
                            validations={[required]}
                            placeholder="Prouct Name"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VSelect type="select" name="branch" className="tradket_b_s"
                            value={this.state.addForm.branch_id}
                            onChange={(e) => this.handleAddInputChange("branch_id",e)}
                            validations={[required]} 
                          >
                            <option value="" disabled>Select Branch</option>
                            {this.state.fullBranchs.map((branch)=>{
                              return(
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                              )
                            })}
                          </VSelect>
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VSelect type="select" name="category" className="tradket_b_s"
                            value={this.state.addForm.category_id}
                            onChange={(e) => this.handleAddInputChange("category_id",e)}
                            validations={[required]} 
                          >
                            <option value="" disabled>Select Category</option>
                            {this.state.fullCategories.map((category)=>{
                              return(
                                <option key={category._id} value={category._id}>{category.name}</option>
                              )
                            })}
                          </VSelect>
                        </div>
                      </Col>
                      {this.state.addForm.category_id == ""?
                        <Col sm="12" className="inputeDiv">
                          <div className="tradketInputGroup full_width">
                            <VSelect type="select" name="subCategory" className="tradket_b_s"
                            >
                              <option value="" disabled>Select Category First</option>
                            </VSelect>
                          </div>
                        </Col>
                      :
                        <Col sm="12" className="inputeDiv">
                          <div className="tradketInputGroup full_width">
                            <VSelect type="select" name="subCategory" className="tradket_b_s"
                              value={this.state.addForm.subCategory_id}
                              onChange={(e) => this.handleAddInputChange("subCategory_id",e)}
                              validations={[]} 
                            >
                              <option value="" disabled>Select SubCategory (optional)</option>
                              {this.state.fullSubCategories.map((subCategory)=>{
                                if(this.state.addForm.category_id == subCategory.category_id){
                                  return(<option key={subCategory._id} value={subCategory._id}>{subCategory.name}</option>)
                                }
                              })}
                            </VSelect>
                          </div>
                        </Col>
                      }
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="price"
                            value={this.state.addForm.price}
                            onChange={(e) => this.handleAddInputChange("price", e)}
                            validations={[required, NumberV]}
                            placeholder="Price"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="quantity"
                            value={this.state.addForm.quantity}
                            onChange={(e) => this.handleAddInputChange("quantity", e)}
                            validations={[required, NumberV]}
                            placeholder="Quantity"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="description"
                            value={this.state.addForm.description}
                            onChange={(e) => this.handleAddInputChange("description", e)}
                            validations={[required]}
                            placeholder="Description"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                        <Multiselect
                          data={this.state.fullFeatures}
                          valueField='_id'
                          textField='name'
                          placeholder="Features (optional)"
                          onChange={this.onSelectFeaturesForm}
                          required
                          defaultValue={this.state.selectedFeatures}
                        />
                        </div>
                      </Col>
                      <div id="addFormFeatures" className="addFormFeatures">
                        {this.state.selectedFeatures.map((feature_id) => {
                          return(
                            <div key={feature_id} className="singleFeature">
                              <Col xs="12" className="inputeDiv">
                                <div className="tradketInputGroup full_width">
                                  <VSelect type="select" className="tradket_b_s"
                                    // value={this.state.addForm.type}
                                    // onChange={(e) => this.handleAddInputChange("type",e)}
                                    validations={[required]} 
                                    name={this.state.features_ids[feature_id].name}
                                  >
                                    <option value="" disabled>Select {this.state.features_ids[feature_id].name}</option>
                                    {this.state.features_ids[feature_id].options.map((option)=>{
                                      return (<option key={option} value={option}>{option}</option>)
                                    })}
                                  </VSelect>
                                </div>
                              </Col>
                            </div>
                          )
                        })}
                      </div>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                        <Multiselect
                          data={this.state.fullFeatures}
                          valueField='_id'
                          textField='name'
                          placeholder="Sub Products (optional)"
                          onChange={this.onSelectSubProductForm}
                          required
                          defaultValue={this.state.selectedSubProductFeatures}
                        />
                        </div>
                      </Col>
                      {this.renderAddFormSubProducts()}
                      {/* <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="address"
                            value={this.state.addForm.address}
                            onChange={(e) => this.handleAddInputChange("address",e)}
                            validations={[required]} 
                            placeholder="Address"
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
                            placeholder="phone Number"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VSelect type="select" name="type" className="tradket_b_s"
                            value={this.state.addForm.type}
                            onChange={(e) => this.handleAddInputChange("type",e)}
                            validations={[required]} 
                          >
                            <option value="" disabled>Select Type</option>
                            <option value="branch">Branch</option>
                            <option value="warehouse">Warehouse</option>
                          </VSelect>
                        </div>
                      </Col> */}
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
                <VButton className="btn btn-info">Add</VButton>
              }
              {this.state.addModalError?
                <button className="accept-btn btn btn-default" onClick={this.addModalReset}>Try again</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleAddModal}>Cancel</button>
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
    editFormData.name= this.state.selectedUser.name;
    editFormData.address= this.state.selectedUser.address;
    editFormData.phoneNumber= this.state.selectedUser.phoneNumber;
    editFormData.type= this.state.selectedUser.type;
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
  handleEditUserSubmit(event){
    //get form data
    let userObj = {
      "branch_id": this.state.selectedUser._id,
      "name": this.state.editForm.name,
      "address": this.state.editForm.address,
      "phoneNumber": this.state.editForm.phoneNumber,
      "type": this.state.editForm.type
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
        <VForm onSubmit={this.handleEditUserSubmit} >
          <ModalHeader toggle={this.toggleEditModal}>
            Edit Staff
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
                  <h1>Congratulations</h1>
                  <p>your Branch has been Edited successfully.</p>
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
                            placeholder="Full Name"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="address"
                            value={this.state.editForm.address}
                            onChange={(e) => this.handleEditInputChange("address",e)}
                            validations={[required]} 
                            placeholder="address"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            name="phoneNumber"
                            value={this.state.editForm.phoneNumber}
                            onChange={(e) => this.handleEditInputChange("phoneNumber",e)}
                            validations={[required, phoneNumber]} 
                            placeholder="phone Number"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VSelect type="select" name="type" className="tradket_b_s"
                            value={this.state.editForm.type}
                            onChange={(e) => this.handleEditInputChange("type",e)}
                            validations={[required]} 
                          >
                            <option value="" disabled>Select Type</option>
                            <option value="branch">Branch</option>
                            <option value="warehouse">Warehouse</option>
                          </VSelect>
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
                <VButton className="btn btn-info">Edit</VButton>
              }
              {this.state.editModalError?
                <button className="accept-btn btn btn-default" onClick={this.editModalReset}>Try again</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleEditModal}>Cancel</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //addMore modal
  toggleAddMoreModal(e){
    e.preventDefault();
    let addMoreFormData = this.state.addMoreForm;
    addMoreFormData.quantity= "";
    addMoreFormData.branch= "";
    this.setState({
      addMoreModal: !this.state.addMoreModal,
      addMoreForm: addMoreFormData,
      addMoreModalWaiting: false, 
      addMoreModalSuccess: false, 
      addMoreModalError: false, 
      addMoreModalFaildMessage: ""
    });
  }
  handleAddMoreInputChange(inputName,event){
    let addMoreFormData = this.state.addMoreForm;
    addMoreFormData[inputName] = event.target.value;
    this.setState({addMoreForm: addMoreFormData},()=>{
      console.log(this.state.addMoreForm)
    })
  }
  handleAddMoreProductSubmit(event){
    //get form data
    let userObj = {
      "_id": this.state.selectedUser._id,
      "quantity": this.state.addMoreForm.quantity,
      "branch_id": this.state.addMoreForm.branch
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({addMoreModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.addMoreStaffPath,
          config,
          userData,
          (resp) => {
            this.setState({addMoreModalSuccess: true ,addMoreModalWaiting:false},()=>{
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
                this.setState({addMoreModalWaiting: false, addMoreModalError: true, addMoreModalFaildMessage: error.response.data.message});
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
  addMoreModalReset(e){
    e.preventDefault();
    let addMoreFormData= this.state.addMoreForm;
    this.setState({
      addMoreForm: addMoreFormData,
      addMoreModalWaiting: false, 
      addMoreModalSuccess: false, 
      addMoreModalError: false, 
      addMoreModalFaildMessage: ""
    });
  }
  renderAddMoreModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.addMoreModal} toggle={this.toggleAddMoreModal}>
        <VForm onSubmit={this.handleAddMoreProductSubmit} >
          <ModalHeader toggle={this.toggleAddMoreModal}>
            More Quantity
          </ModalHeader>
          <ModalBody>
          {this.state.addMoreModalError?
              <div>
                <Alert color="danger">
                  {this.state.addMoreModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.addMoreModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>Quantity Added to the Selected Branch Successfully.</p>
                </div>
              :
                <div >
                {this.state.addMoreModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addMoreModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VInput type="text" className="tradket_b_i"
                            autoComplete="off"
                            autoFocus={true}
                            name="quantity"
                            value={this.state.addMoreForm.quantity}
                            onChange={(e) => this.handleAddMoreInputChange("quantity", e)}
                            validations={[required, NumberV]}
                            placeholder="Quantity"
                          />
                        </div>
                      </Col>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <VSelect type="select" name="type" className="tradket_b_s"
                            value={this.state.addMoreForm.branch}
                            onChange={(e) => this.handleAddMoreInputChange("branch",e)}
                            validations={[required]} 
                          >
                            <option value="" disabled>Select Type</option>
                            {this.state.fullBranchs.map((branch)=>{
                              return(
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                              )
                            })}
                          </VSelect>
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
          {this.state.addMoreModalSuccess || this.state.addMoreModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.addMoreModalSuccess || this.state.addMoreModalWaiting || this.state.addMoreModalError?
                null
              : 
                <VButton className="btn btn-info">Add</VButton>
              }
              {this.state.addMoreModalError?
                <button className="accept-btn btn btn-default" onClick={this.addMoreModalReset}>Try again</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleAddMoreModal}>Cancel</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  } 
  //deactivate modal
  toggleDeactivateModal(){
    this.setState({
      deactivateModal: !this.state.deactivateModal,
      deactivateModalWaiting: false,
      deactivateModalSuccess: false,
      deactivateModalError: false,
      deactivateModalFaildMessage: ""
    });
  }
  handleDeactivateUserSubmit(event){
    //start waiting
    this.setState({deactivateModalWaiting: true},()=>{
      //send request
      let userObj = {
        "branch_id": this.state.selectedUser._id,
        "active": "false"
      };
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
          userObj,
          (resp) => {
            this.setState({deactivateModalSuccess: true ,deactivateModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
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
    });
    event.preventDefault();
  }
  DeactivateModalReset(){
    this.setState({
      deactivateModalWaiting: false,
      deactivateModalSuccess: false,
      deactivateModalError: false,
      deactivateModalFaildMessage: ""
    });
  }
  renderDeactivateModal(){
    return(
      <Modal isOpen={this.state.deactivateModal} toggle={this.toggleDeactivateModal}>
        <VForm >
          <ModalHeader toggle={this.toggleDeactivateModal}>
            Deactivate
          </ModalHeader>
          <ModalBody>
          {this.state.deactivateModalError?
              <div>
                <Alert color="danger">
                  Oops! Something went wrong. If this problem persists, please contact your service provider.
                </Alert>
              </div>
          :
            <div >
              {this.state.deactivateModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>your Branch has been Deactivated Successfully.</p>
                </div>
              :
                <div >
                {this.state.deactivateModalWaiting?
                  <Waiting height="150px" />
                :
                  <div className="deactivateModalBody">
                      <br/>
                <p>You are about to Deactivate Branch <b>{this.state.selectedUser.name}</b> . Please confirm deactivation or press cancel.</p>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          <ModalFooter>
            {this.state.deactivateModalSuccess || this.state.deactivateModalWaiting || this.state.deactivateModalError?
              null
            : 
              <VButton className="btn btn-danger" onClick={this.handleDeactivateUserSubmit} >Deactivate</VButton>
            }
            {this.state.deactivateModalError?
              <button className="accept-btn btn btn-default" onClick={this.deactivateModalReset}>Try Again</button>
            :
              null
            }
            <span className="accept-btn btn btn-default" onClick={this.toggleDeactivateModal}>Cancel</span>
          </ModalFooter>
        </VForm>
      </Modal>
    )
  }
  //activate modal
  toggleActivateModal(){
    this.setState({
      activateModal: !this.state.activateModal,
      activateModalWaiting: false,
      activateModalSuccess: false,
      activateModalError: false,
      activateModalFaildMessage: ""
    });
  }
  handleActivateUserSubmit(event){
    //start waiting
    this.setState({activateModalWaiting: true},()=>{
      //send request
      let userObj = {
        "branch_id": this.state.selectedUser._id,
        "active": "true"
      };
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      let data= {};
      httpClient.post(
          this.state.editPath,
          config,
          userObj,
          (resp) => {
            this.setState({activateModalSuccess: true ,activateModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
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
    });
    event.preventDefault();
  }
  ActivateModalReset(){
    this.setState({
      activateModalWaiting: false,
      activateModalSuccess: false,
      activateModalError: false,
      activateModalFaildMessage: ""
    });
  }
  renderActivateModal(){
    return(
      <Modal isOpen={this.state.activateModal} toggle={this.toggleActivateModal}>
        <VForm >
          <ModalHeader toggle={this.toggleActivateModal}>
            Activate
          </ModalHeader>
          <ModalBody>
          {this.state.activateModalError?
              <div>
                <Alert color="danger">
                  Oops! Something went wrong. If this problem persists, please contact your service provider.
                </Alert>
              </div>
          :
            <div >
              {this.state.activateModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  <h1>Congratulations</h1>
                  <p>Your Branch has been Activated Successfully.</p>
                </div>
              :
                <div >
                {this.state.activateModalWaiting?
                  <Waiting height="150px" />
                :
                  <div className="activateModalBody">
                    <br/>
                    <p>You are about to Activate user <b>{this.state.selectedUser.name}</b> . Please confirm activation or press cancel.</p>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          <ModalFooter>
            {this.state.activateModalSuccess || this.state.activateModalWaiting || this.state.activateModalError?
              null
            : 
              <VButton className="btn btn-danger" onClick={this.handleActivateUserSubmit} >Activate</VButton>
            }
            {this.state.activateModalError?
              <button className="accept-btn btn btn-default" onClick={this.activateModalReset}>Try Again</button>
            :
              null
            }
            <span className="accept-btn btn btn-default" onClick={this.toggleActivateModal}>Cancel</span>
          </ModalFooter>
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
              Oops! Something went wrong. If this problem persists, please contact your service provider.
            </Alert>
          </div>
        :
          <div>
            {this.renderUsersBlock()}
            {this.renderAddModal()}
            {this.renderAddMoreModal()}
            {this.renderEditModal()}
            {this.renderDeactivateModal()}
            {this.renderActivateModal()}
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

export default Product;
