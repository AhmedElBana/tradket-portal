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
  
import { Link } from 'react-router-dom';
import { auth } from '../../../../tools/Auth';
import { httpClient } from '../../../../tools/HttpClient';
import Waiting from '../../../Waiting/waiting';
import successImg from "./../../../../assets/img/success.png"

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
        };
    }
    componentDidMount(){
        this.handleUserPerms();
    }
    handleUserPerms = () => {
        const perms = JSON.parse(localStorage.userData).permissions;
        this.setState({
            "userCanEdit": (perms.includes("134") || perms.includes("135"))
        })
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
    renderDetailModals = () => {
        return (
            <div>
                {/* start Modal */}
                <Modal isOpen={this.state.startModal} toggle={this.toggleStartModal}>
                    <ModalHeader toggle={this.toggleStartModal}>Start Custom Product</ModalHeader>
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
                                        <h1>Congratulations</h1>
                                        <p>You Start Working on Custom Product Successfully.</p>
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
                                                    <p>Start Working on Custom Product <br/>({this.props.selectedDetailsObj.id})</p>
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
                            <Button color="primary" onClick={this.startProduct} className="primaryBtn">Start</Button>{' '}
                            <Button color="secondary" onClick={this.toggleStartModal} className="secondryBtn">Close</Button>
                        </ModalFooter>
                    }
                </Modal>
                {/* start_cancel Modal */}
                <Modal isOpen={this.state.start_cancelModal} toggle={this.toggleStart_cancelModal}>
                    <ModalHeader toggle={this.toggleStart_cancelModal}>Back To New</ModalHeader>
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
                                        <h1>Congratulations</h1>
                                        <p>Custom Product Back To New Successfully.</p>
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
                                                    <p>Back Custom Product <br/>({this.props.selectedDetailsObj.id}) To New</p>
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
                            <Button color="primary" onClick={this.start_cancelProduct} className="primaryBtn">Confirm</Button>{' '}
                            <Button color="secondary" onClick={this.toggleStart_cancelModal} className="secondryBtn">Close</Button>
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
                    <Button onClick={this.toggleStartModal} className="filterCompButton SubmitFButton btn btn-secondary">Start</Button>
                }
                {this.props.selectedDetailsObj.status == "accepted" && this.state.userCanEdit &&
                    <Button onClick={this.toggleStart_cancelModal} className="filterCompButton SubmitFButton btn btn-secondary">Back New</Button>
                }
                <Link to={"/custom/products/details/" + this.props.selectedDetailsObj._id} className="filterCompButton SubmitFButton btn btn-secondary">Full Details</Link>
            </>
        )
    }
}
export default DetailsButtons