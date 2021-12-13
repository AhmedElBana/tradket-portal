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
            //accept transfer
            userCanAccept: false,
            acceptPath: "/api/transfer/accept",
            acceptModal: false,
            acceptModalWaiting: false,
            acceptSuccessfully: false,
            acceptFaild: false,
            acceptFaildMessage: "",
            //cancel transfer
            userCanCancel: false,
            cancelPath: "/api/transfer/cancel",
            cancelModal: false,
            cancelModalWaiting: false,
            cancelSuccessfully: false,
            cancelFaild: false,
            cancelFaildMessage: "",
        };
    }
    componentDidMount(){
        this.handleUserPerms();
    }
    handleUserPerms = () => {
        const perms = JSON.parse(localStorage.userData).permissions;
        this.setState({
            "userCanAccept": perms.includes("121"),
            "userCanCancel": perms.includes("122")
        })
    }
    acceptTransfer = () => {
        //start accept modal waiting
        this.setState({ acceptFaild: false, acceptFaildMessage: "", acceptModalWaiting: true }, () => {
            //send accept request
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": auth.getMerchantToken()
                }
            }
            httpClient.get(
                this.state.acceptPath + "?transfer_id=" + this.props.selectedDetailsObj._id,
                config,
                (resp) => {
                    this.setState({ acceptModalWaiting: false, acceptSuccessfully: true }, () => {
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
                        this.setState({acceptModalWaiting: false, acceptFaild: true, acceptFaildMessage: error.response.data.message});
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
    toggleAcceptModal = () => {
        this.setState({
            acceptModal: !this.state.acceptModal,
            acceptModalWaiting: false,
            acceptFaild: false,
            acceptFaildMessage: ""
        })
    }
    cancelTransfer = () => {
        //start cancel modal waiting
        this.setState({ cancelFaild: false, cancelFaildMessage: "", cancelModalWaiting: true }, () => {
            //send cancel request
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": auth.getMerchantToken()
                }
            }
            httpClient.get(
                this.state.cancelPath + "?transfer_id=" + this.props.selectedDetailsObj._id,
                config,
                (resp) => {
                    this.setState({ cancelModalWaiting: false, cancelSuccessfully: true }, () => {
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
                        this.setState({cancelModalWaiting: false, cancelFaild: true, cancelFaildMessage: error.response.data.message});
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
    toggleCancelModal = () => {
        this.setState({
            cancelModal: !this.state.cancelModal,
            cancelModalWaiting: false,
            cancelFaild: false,
            cancelFaildMessage: ""
        })
    }
    renderDetailModals = () => {
        return (
            <div>
                {/* accept Modal */}
                <Modal isOpen={this.state.acceptModal} toggle={this.toggleAcceptModal}>
                    <ModalHeader toggle={this.toggleAcceptModal}>قبول طلب النقل</ModalHeader>
                    <ModalBody>
                        {this.state.acceptFaild ?
                            <div>
                                <Alert color="danger">
                                    {this.state.acceptFaildMessage}
                                </Alert>
                            </div>
                            :
                            <div className="transfer_modal_body">
                                {this.state.acceptSuccessfully ?
                                    <div className="staffSuccesDiv">
                                        <img src={successImg} alt="succes"/>
                                        {/* <h1>Congratulations</h1> */}
                                        <p>تم قبول طلب النقل بنجاح.</p>
                                    </div>
                                :
                                    this.state.acceptFaild?
                                        <Col>
                                            <div className="alert alert-danger fade show fullWidth">{this.state.acceptFaildMessage}</div>
                                        </Col>
                                    :
                                        <div>
                                            {this.state.acceptModalWaiting ?
                                                <Waiting height="100px" width="50px" />
                                                :
                                                <div>
                                                    <p>قبول الطلب رقم  <br/>({this.props.selectedDetailsObj.id})</p>
                                                </div>
                                            }
                                        </div>
                                }
                            </div>
                        }
                    </ModalBody>
                    {this.state.acceptSuccessfully || this.state.acceptModalWaiting || this.state.acceptFaild?
                        null
                    : 
                        <ModalFooter>
                            <Button color="primary" onClick={this.acceptTransfer} className="primaryBtn">قبول</Button>{' '}
                            <Button color="secondary" onClick={this.toggleAcceptModal} className="secondryBtn">إلغاء</Button>
                        </ModalFooter>
                    }
                </Modal>
                {/* cancel Modal */}
                <Modal isOpen={this.state.cancelModal} toggle={this.toggleCancelModal}>
                    <ModalHeader toggle={this.toggleCancelModal}>رفض طلب النقل</ModalHeader>
                    <ModalBody>
                        {this.state.cancelFaild ?
                            <div>
                                <Alert color="danger">
                                    {this.state.cancelFaildMessage}
                                </Alert>
                            </div>
                            :
                            <div className="transfer_modal_body">
                                {this.state.cancelSuccessfully ?
                                    <div className="staffSuccesDiv">
                                        <img src={successImg} alt="succes"/>
                                        {/* <h1>Congratulations</h1> */}
                                        <p>تم رفض طلب النقل بنجاح.</p>
                                    </div>
                                :
                                    this.state.cancelFaild?
                                        <Col>
                                            <div className="alert alert-danger fade show fullWidth">{this.state.cancelFaildMessage}</div>
                                        </Col>
                                    :
                                        <div>
                                            {this.state.cancelModalWaiting ?
                                                <Waiting height="100px" width="50px" />
                                                :
                                                <div>
                                                    <p>رفض طلب نقل رقم  <br/>({this.props.selectedDetailsObj.id})</p>
                                                </div>
                                            }
                                        </div>
                                }
                            </div>
                        }
                    </ModalBody>
                    {this.state.cancelSuccessfully || this.state.cancelModalWaiting || this.state.cancelFaild?
                        null
                    : 
                        <ModalFooter>
                            <Button color="primary" onClick={this.cancelTransfer} className="primaryBtn">رفض</Button>{' '}
                            <Button color="secondary" onClick={this.toggleCancelModal} className="secondryBtn">إلغاء</Button>
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
                {this.props.selectedDetailsObj.status == "inProgress" &&
                    <>
                        {this.state.userCanAccept && <Button onClick={this.toggleAcceptModal} className="filterCompButton SubmitFButton btn btn-secondary">قبول</Button>}
                        {this.state.userCanCancel && <Button onClick={this.toggleCancelModal} className="filterCompButton SubmitFButton btn btn-secondary">رفض</Button>}
                    </>
                }
            </>
        )
    }
}
export default DetailsButtons