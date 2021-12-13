import React, { Component } from 'react';
import {
    Button,
    Col,
    Row,
    Table,
    FormGroup,
    Label,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Alert
  } from 'reactstrap';
  import VForm from 'react-validation/build/form';
  import VInput from 'react-validation/build/input';
  import VButton from 'react-validation/build/button';
  import validator from 'validator';
  
import { Link } from 'react-router-dom';
import { auth } from '../../../../tools/Auth';
import { httpClient } from '../../../../tools/HttpClient';
import Waiting from '../../../Waiting/waiting';
import successImg from "./../../../../assets/img/success.png"

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
class DetailsButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCanEdit: false,
            //start custom product
            startPath: "/api/custom_product/start",
            startModal: false,
            startModalWaiting: false,
            startSuccessfully: false,
            startFaild: false,
            startFaildMessage: "",
            //start_cancel custom product
            start_cancelPath: "/api/custom_product/start_cancel",
            start_cancelModal: false,
            start_cancelModalWaiting: false,
            start_cancelSuccessfully: false,
            start_cancelFaild: false,
            start_cancelFaildMessage: "",
            //complate custom product
            complatePath: "/api/custom_product/set_ready",
            complateModal: false,
            complateModalWaiting: false,
            complateSuccessfully: false,
            complateFaild: false,
            complateFaildMessage: "",
            loadWaiting: true,
            fullData: {},
            materialsForm: {},
            //ready_cancel custom product
            ready_cancelPath: "/api/custom_product/ready_cancel",
            ready_cancelModal: false,
            ready_cancelModalWaiting: false,
            ready_cancelSuccessfully: false,
            ready_cancelFaild: false,
            ready_cancelFaildMessage: "",
        };
    }
    componentDidMount(){
        this.handleUserPerms();
        if(this.props.selectedDetailsObj.status == "accepted"){
            this.load_data()
        }
    }
    handleUserPerms = () => {
        const perms = JSON.parse(localStorage.userData).permissions;
        this.setState({
            "userCanEdit": (perms.includes("134") || perms.includes("135"))
        })
    }
    load_data = () => {
        //request data
        let config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth": auth.getMerchantToken()
          },
          params: {
            "_id": this.props.selectedDetailsObj._id
          }
        }
        httpClient.get(
            "/api/custom_product/full_details",
            config,
            (resp) => {
              this.setState({loadWaiting: false, fullData: resp.data.data});
            },
            (error) => {
                if(error.response){
                    if(error.response.status === 401){
                      this.setState({logout: true});
                    }else if(error.response.status === 400){
                      this.setState({complateModalWaiting: false, loadWaiting: false, complateFaild: true, complateFaildMessage: "Something went wrong please try again later."});
                    }else{
                      this.setState({publicError: true});
                    }
                }else{
                    this.setState({publicError: true});
                }
            }
        )
    }
    startProduct = () => {
        //start start modal waiting
        this.setState({ startFaild: false, startFaildMessage: "", startModalWaiting: true }, () => {
            //send start request
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": auth.getMerchantToken()
                }
            }
            let product_obj = {
                "id": this.props.selectedDetailsObj._id
            }
            let productData = JSON.stringify(product_obj);
            httpClient.post(
                this.state.startPath,
                config,
                productData,
                (resp) => {
                    this.setState({ startModalWaiting: false, startSuccessfully: true }, () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    });
                },
                (error) => {
                    if(error.response){
                      if(error.response.status === 401){
                        this.setState({logout: true});
                      }else if(error.response.status === 400){
                        this.setState({startModalWaiting: false, startFaild: true, startFaildMessage: error.response.data.message});
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
    toggleStartModal = () => {
        this.setState({
            startModal: !this.state.startModal,
            startModalWaiting: false,
            startFaild: false,
            startFaildMessage: ""
        })
    }
    //start_cancel
    start_cancelProduct = () => {
        //start start_cancel modal waiting
        this.setState({ start_cancelFaild: false, start_cancelFaildMessage: "", start_cancelModalWaiting: true }, () => {
            //send start_cancel request
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": auth.getMerchantToken()
                }
            }
            let product_obj = {
                "id": this.props.selectedDetailsObj._id
            }
            let productData = JSON.stringify(product_obj);
            httpClient.post(
                this.state.start_cancelPath,
                config,
                productData,
                (resp) => {
                    this.setState({ start_cancelModalWaiting: false, start_cancelSuccessfully: true }, () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    });
                },
                (error) => {
                    if(error.response){
                      if(error.response.status === 401){
                        this.setState({logout: true});
                      }else if(error.response.status === 400){
                        this.setState({start_cancelModalWaiting: false, start_cancelFaild: true, start_cancelFaildMessage: error.response.data.message});
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
    toggleStart_cancelModal = () => {
        this.setState({
            start_cancelModal: !this.state.start_cancelModal,
            start_cancelModalWaiting: false,
            start_cancelFaild: false,
            start_cancelFaildMessage: ""
        })
    }
    // complate
    complateProduct = (e) => {
        e.preventDefault();
        //start complate modal waiting
        this.setState({ complateFaild: false, complateFaildMessage: "", complateModalWaiting: true }, () => {
            //send complate request
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": auth.getMerchantToken()
                }
            }
            let product_obj = {
                "id": this.props.selectedDetailsObj._id,
                "final_materials": this.state.materialsForm
            }
            let productData = JSON.stringify(product_obj);
            httpClient.post(
                this.state.complatePath,
                config,
                productData,
                (resp) => {
                    this.setState({ complateModalWaiting: false, complateSuccessfully: true }, () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    });
                },
                (error) => {
                    if(error.response){
                      if(error.response.status === 401){
                        this.setState({logout: true});
                      }else if(error.response.status === 400){
                        this.setState({complateModalWaiting: false, complateFaild: true, complateFaildMessage: error.response.data.message});
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
    toggleComplateModal = () => {
        let materialsForm = {};
        Object.keys(this.state.fullData.materials_details).map((ele)=>{
            materialsForm[ele] = this.state.fullData.materials_details[ele].used_quantity;
        })
        this.setState({
            materialsForm: materialsForm,
            complateModal: !this.state.complateModal,
            complateModalWaiting: false,
            complateFaild: false,
            complateFaildMessage: ""
        })
    }
    handleMaterials_change = (e, id) => {
        let materialsForm = {...this.state.materialsForm}
        materialsForm[id] = e.target.value;
        this.setState({materialsForm: materialsForm})
    }
    //ready_cancel
    ready_cancelProduct = () => {
        //start ready_cancel modal waiting
        this.setState({ ready_cancelFaild: false, ready_cancelFaildMessage: "", ready_cancelModalWaiting: true }, () => {
            //send ready_cancel request
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": auth.getMerchantToken()
                }
            }
            let product_obj = {
                "id": this.props.selectedDetailsObj._id
            }
            let productData = JSON.stringify(product_obj);
            httpClient.post(
                this.state.ready_cancelPath,
                config,
                productData,
                (resp) => {
                    this.setState({ ready_cancelModalWaiting: false, ready_cancelSuccessfully: true }, () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    });
                },
                (error) => {
                    if(error.response){
                      if(error.response.status === 401){
                        this.setState({logout: true});
                      }else if(error.response.status === 400){
                        this.setState({ready_cancelModalWaiting: false, ready_cancelFaild: true, ready_cancelFaildMessage: error.response.data.message});
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
    toggleReady_cancelModal = () => {
        this.setState({
            ready_cancelModal: !this.state.ready_cancelModal,
            ready_cancelModalWaiting: false,
            ready_cancelFaild: false,
            ready_cancelFaildMessage: ""
        })
    }
    renderDetailModals = () => {
        return (
            <div>
                {/* start Modal */}
                <Modal isOpen={this.state.startModal} toggle={this.toggleStartModal}>
                    <ModalHeader toggle={this.toggleStartModal}>بدا العمل</ModalHeader>
                    <ModalBody>
                        {this.state.startFaild ?
                            <div>
                                <Alert color="danger">
                                    {this.state.startFaildMessage}
                                </Alert>
                            </div>
                            :
                            <div className="transfer_modal_body">
                                {this.state.startSuccessfully ?
                                    <div className="staffSuccesDiv">
                                        <img src={successImg} alt="succes"/>
                                        {/* <h1>Congratulations</h1> */}
                                        <p>تم تسجيل بدا العمل بنجاح.</p>
                                    </div>
                                :
                                    this.state.startFaild?
                                        <Col>
                                            <div className="alert alert-danger fade show fullWidth">{this.state.startFaildMessage}</div>
                                        </Col>
                                    :
                                        <div>
                                            {this.state.startModalWaiting ?
                                                <Waiting height="100px" width="50px" />
                                                :
                                                <div>
                                                    <p>بدا العمل علي المنتج رقم  <br/>({this.props.selectedDetailsObj.id})</p>
                                                </div>
                                            }
                                        </div>
                                }
                            </div>
                        }
                    </ModalBody>
                    {this.state.startSuccessfully || this.state.startModalWaiting || this.state.startFaild?
                        null
                    : 
                        <ModalFooter>
                            <Button color="primary" onClick={this.startProduct} className="primaryBtn">ابدأ</Button>{' '}
                            <Button color="secondary" onClick={this.toggleStartModal} className="secondryBtn">إلغاء</Button>
                        </ModalFooter>
                    }
                </Modal>
                {/* start_cancel Modal */}
                <Modal isOpen={this.state.start_cancelModal} toggle={this.toggleStart_cancelModal}>
                    <ModalHeader toggle={this.toggleStart_cancelModal}>إلغاء البدا</ModalHeader>
                    <ModalBody>
                        {this.state.start_cancelFaild ?
                            <div>
                                <Alert color="danger">
                                    {this.state.start_cancelFaildMessage}
                                </Alert>
                            </div>
                            :
                            <div className="transfer_modal_body">
                                {this.state.start_cancelSuccessfully ?
                                    <div className="staffSuccesDiv">
                                        <img src={successImg} alt="succes"/>
                                        {/* <h1>Congratulations</h1> */}
                                        <p>تم إلغاء بدا العمل بنجاح.</p>
                                    </div>
                                :
                                    this.state.start_cancelFaild?
                                        <Col>
                                            <div className="alert alert-danger fade show fullWidth">{this.state.start_cancelFaildMessage}</div>
                                        </Col>
                                    :
                                        <div>
                                            {this.state.start_cancelModalWaiting ?
                                                <Waiting height="100px" width="50px" />
                                                :
                                                <div>
                                                    <p>إلغاء العمل علي منتج رقم  <br/>({this.props.selectedDetailsObj.id})</p>
                                                </div>
                                            }
                                        </div>
                                }
                            </div>
                        }
                    </ModalBody>
                    {this.state.start_cancelSuccessfully || this.state.start_cancelModalWaiting || this.state.start_cancelFaild?
                        null
                    : 
                        <ModalFooter>
                            <Button color="primary" onClick={this.start_cancelProduct} className="primaryBtn">تأكيد</Button>{' '}
                            <Button color="secondary" onClick={this.toggleStart_cancelModal} className="secondryBtn">إلغاء</Button>
                        </ModalFooter>
                    }
                </Modal>
                {/* complate Modal */}
                <Modal isOpen={this.state.complateModal} toggle={this.toggleComplateModal}>
                    <VForm>
                        <ModalHeader toggle={this.toggleComplateModal}>تسجيل اكتمال العمل</ModalHeader>
                        <ModalBody>
                            {this.state.complateFaild ?
                                <div>
                                    <Alert color="danger">
                                        {this.state.complateFaildMessage}
                                    </Alert>
                                </div>
                                :
                                <div className="transfer_modal_body">
                                    {this.state.complateSuccessfully ?
                                        <div className="staffSuccesDiv">
                                            <img src={successImg} alt="succes"/>
                                            {/* <h1>Congratulations</h1> */}
                                            <p>تم تسجيل اكتمال العمل بنجاح.</p>
                                        </div>
                                    :
                                        this.state.complateFaild?
                                            <Col>
                                                <div className="alert alert-danger fade show fullWidth">{this.state.complateFaildMessage}</div>
                                            </Col>
                                        :
                                            <div>
                                                {this.state.complateModalWaiting || this.state.loadWaiting?
                                                    <Waiting height="100px" width="50px" />
                                                    :
                                                    <div>
                                                        <p>اكتمال العمل علي المنتج رقم  <br/>({this.props.selectedDetailsObj.id})</p>
                                                        <div className="materials_update">
                                                            <h3>الخامات المستخدمة</h3>
                                                            <Row>
                                                                {Object.keys(this.state.materialsForm).map((id)=>{
                                                                    return(
                                                                        <>
                                                                            <Col xs="12">
                                                                                <span className="label">{this.state.fullData.materials_details[id].full_data.name}</span>
                                                                            </Col>
                                                                            <Col xs="12" className="inputeDiv">
                                                                                <div className="tradketInputGroup full_width">
                                                                                    <VInput type="text" className="tradket_b_i"
                                                                                        autoComplete="off"
                                                                                        name={id}
                                                                                        value={this.state.materialsForm[id]}
                                                                                        onChange={(e) => this.handleMaterials_change(e, id)}
                                                                                        validations={[required, NumberV]}
                                                                                        placeholder={"العدد"}
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        </>
                                                                    )
                                                                })}
                                                            </Row>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                    }
                                </div>
                            }
                        </ModalBody>
                        {this.state.complateSuccessfully || this.state.complateModalWaiting || this.state.complateFaild || this.state.loadWaiting?
                            null
                        : 
                            <ModalFooter>
                                <VButton color="primary" onClick={this.complateProduct} className="btn btn-info">تأكيد</VButton>{' '}
                                <Button color="secondary" onClick={this.toggleComplateModal} className="secondryBtn">إلغاء</Button>
                            </ModalFooter>
                        }
                    </VForm>
                </Modal>
                {/* ready_cancel Modal */}
                <Modal isOpen={this.state.ready_cancelModal} toggle={this.toggleReady_cancelModal}>
                    <ModalHeader toggle={this.toggleReady_cancelModal}>إلغاء اكتمال العمل</ModalHeader>
                    <ModalBody>
                        {this.state.ready_cancelFaild ?
                            <div>
                                <Alert color="danger">
                                    {this.state.ready_cancelFaildMessage}
                                </Alert>
                            </div>
                            :
                            <div className="transfer_modal_body">
                                {this.state.ready_cancelSuccessfully ?
                                    <div className="staffSuccesDiv">
                                        <img src={successImg} alt="succes"/>
                                        {/* <h1>Congratulations</h1> */}
                                        <p>تم إلغاء اكتمال العمل بنجاح.</p>
                                    </div>
                                :
                                    this.state.ready_cancelFaild?
                                        <Col>
                                            <div className="alert alert-danger fade show fullWidth">{this.state.ready_cancelFaildMessage}</div>
                                        </Col>
                                    :
                                        <div>
                                            {this.state.ready_cancelModalWaiting ?
                                                <Waiting height="100px" width="50px" />
                                                :
                                                <div>
                                                    <p>إلغاء اكتمال العمل علي المنتج رقم  <br/>({this.props.selectedDetailsObj.id})</p>
                                                </div>
                                            }
                                        </div>
                                }
                            </div>
                        }
                    </ModalBody>
                    {this.state.ready_cancelSuccessfully || this.state.ready_cancelModalWaiting || this.state.ready_cancelFaild?
                        null
                    : 
                        <ModalFooter>
                            <Button color="primary" onClick={this.ready_cancelProduct} className="primaryBtn">تاكيد</Button>{' '}
                            <Button color="secondary" onClick={this.toggleReady_cancelModal} className="secondryBtn">إلغاء</Button>
                        </ModalFooter>
                    }
                </Modal>
            </div>
        )
    }
    render() {
        return (
            <>
                {this.renderDetailModals()}
                {this.props.selectedDetailsObj.status == "assigned" && this.state.userCanEdit &&
                    <Button onClick={this.toggleStartModal} className="filterCompButton SubmitFButton btn btn-secondary">بدا العمل</Button>
                }
                {this.props.selectedDetailsObj.status == "accepted" && this.state.userCanEdit &&
                    <Button onClick={this.toggleStart_cancelModal} className="filterCompButton SubmitFButton btn btn-secondary">إلغاء البدا</Button>
                }
                {this.props.selectedDetailsObj.status == "accepted" && this.state.userCanEdit &&
                    <Button onClick={this.toggleComplateModal} className="filterCompButton SubmitFButton btn btn-secondary">اكتمال العمل</Button>
                }
                {this.props.selectedDetailsObj.status == "ready" && this.state.userCanEdit &&
                    <Button onClick={this.toggleReady_cancelModal} className="filterCompButton SubmitFButton btn btn-secondary">إلغاء اكتمال العمل</Button>
                }
                <Link to={"/custom/products/details/" + this.props.selectedDetailsObj._id} className="filterCompButton SubmitFButton btn btn-secondary">التفاصيل الكاملة للمنتج</Link>
            </>
        )
    }
}
export default DetailsButtons