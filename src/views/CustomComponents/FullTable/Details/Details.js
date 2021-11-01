import React, { Component } from 'react';
import {
  Col,
  Row,
  Table,
  Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import Waiting from './../../../Waiting/waiting';
import ShowDataType from './ShowDataType';
import {httpClient} from './../../../../tools/HttpClient';
import {auth} from './../../../../tools/Auth';
import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../redux/Tables/tables.actions';
import './details.scss';

const togglePaneDetails = (tab, state, props, dispatch) => {
    let newState = {...state};
    newState.detailsActiveTab = tab;
    dispatch(updateState(newState, props.name));
}
const tabPaneDetails = (props, state) => {
    return (
        <>
        {props.obj.body.map((ele, index) => {
            return( 
                checkTabConditions(ele.conditions, state.selectedRowData) ?
                    <TabPane tabId={index}  key={ele.title + "-" + index}>
                        <Row>
                            <Col sm="12">
                                <Table className="sub_Table">
                                    <tbody>
                                        <ShowDataType
                                            obj={ele.body}
                                            use_parent_data={ele.use_parent_data}
                                            data={state.selectedRowData}
                                            parent_data={state.selectedRowParentData}
                                        />
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </TabPane>
                :
                    null
            )})
        }        
        </>
    );
}
const checkTabConditions = (conditions, data) => {
    let show = true;
    if(conditions){
        if(conditions.type === "not_equal"){
            for (const [key, value] of Object.entries(conditions.list)) {
                let varFinalValue = data;
                let position_arr = key.split('.');
                for(let x = 0; x < position_arr.length; x++){
                    if(varFinalValue && varFinalValue[position_arr[x]]){
                        varFinalValue = varFinalValue[position_arr[x]];
                    }else if(typeof varFinalValue[position_arr[x]] == "boolean"){
                        varFinalValue = varFinalValue[position_arr[x]];
                    }else{
                        varFinalValue = null;
                    }
                }
                if(varFinalValue === value){
                    show = false;
                }
            }
        }else if(conditions.type === "equal"){
            for (const [key, value] of Object.entries(conditions.list)) {
                let varFinalValue = data;
                let position_arr = key.split('.');
                for(let x = 0; x < position_arr.length; x++){
                    if(varFinalValue && varFinalValue[position_arr[x]]){
                        varFinalValue = varFinalValue[position_arr[x]];
                    }else if(typeof varFinalValue[position_arr[x]] == "boolean"){
                        varFinalValue = varFinalValue[position_arr[x]];
                    }else{
                        varFinalValue = null;
                    }
                }
                if(varFinalValue !== value){
                    show = false;
                }
            }
        }
    }
    return show
}
const loadParentData = (parent_id, state, props, dispatch) => {
    let config = {
        headers: {
            "Content-Type": "application/json",
            //"Cache-Control": "no-cache"
            //"Authorization": "Bearer " + auth.getMerchantToken()
        },
        params: {
            "token": auth.getMerchantToken()
        }
    }
    httpClient.get(
    state.path + "/" + parent_id,
    config,
    (resp) => {
        let newState = {};
        newState.details_waiting = false;
        newState.selectedRowParentData = resp.data;
        dispatch(updateState(newState, props.name));
    },
    (error) => {
        if (error.response) {
        if (error.response.status === 401) {
            auth.logout();
        } else {
            //this.setState({ transTableShow: false });
        }
        } else {
        //this.setState({ transTableShow: false });
        }
    }
    )
}
const handleDetailsClose = (state, props, dispatch) => {
    let newState = {...state};
    newState.selectedRow = false;
    newState.selectedRowData = {};
    newState.details_waiting = false;
    newState.selectedRowParentData = {};
    dispatch(updateState(newState, props.name));
}
function Details(props) {
    const dispatch = useDispatch();
    let state = useSelector(state => state.tables[props.name]);
    if(state.selectedRow === true && props.obj.header.load_parent_data && props.obj.header.load_parent_data.id_field){
        let parent_field_name = props.obj.header.load_parent_data.id_field;
        let parent_id = state.selectedRowData[parent_field_name];
        if(parent_id == null && state.details_waiting === true){
            let newState = {...state};
            newState.details_waiting = false;
            dispatch(updateState(newState, props.name));
        }else if(parent_id != null && state.details_waiting === true){
            loadParentData(parent_id, state, props, dispatch);
        }
    }else{
        if(state.details_waiting === true){
            let newState = {...state};
            newState.details_waiting = false;
            dispatch(updateState(newState, props.name));
        }
    }
    return (
        <div>
            {state.selectedRow? 
                <Row>
                    <div className="x_panel newDetailsCard x_panelAccept">
                        <div className="x_title">
                            <>
                                {props.obj.header.NEXT == true ?
                                    <h2>{(localStorage.lang === "ar" ? props.obj.header.title_ar : props.obj.header.title)}</h2>
                                :
                                    <h2>{(localStorage.lang === "ar" ? props.obj.header.title_ar : props.obj.header.title) + " (" + state.selectedRowData.id + ")"}</h2>
                                }
                                <div className="ButtonsDiv">
                                    {props.detailsButtons !== null && !state.details_waiting ?
                                        React.cloneElement(props.detailsButtons,{ selectedDetailsObj: state.selectedRowData })
                                    :
                                        null
                                    }
                                    <button className="accept-btn closeBtn" onClick={() => {handleDetailsClose(state, props, dispatch)}}><i className="fa fa-times" aria-hidden="true"></i></button>
                                </div>
                            </>
                        </div>
                        <div className="x_content">
                            {state.details_waiting?
                                <Waiting height="300px" />
                            :
                                <div className="animated fadeIn">
                                    <Row>
                                        <Col xs="12">
                                            <Nav tabs>
                                                {props.obj.body.map((ele, index) => {
                                                    return( 
                                                        checkTabConditions(ele.conditions, state.selectedRowData) ?
                                                            <NavItem key={ele.title + "-" + index}>
                                                                <NavLink
                                                                    active={state.detailsActiveTab === index}
                                                                    onClick={() => togglePaneDetails(index, state, props, dispatch)}
                                                                >
                                                                    {localStorage.lang === "ar" ? ele.title_ar : ele.title}
                                                                </NavLink>
                                                            </NavItem>
                                                        : null
                                                    )})
                                                }
                                            </Nav>
                                            <TabContent activeTab={state.detailsActiveTab}>
                                                {tabPaneDetails(props, state)}
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        </div>
                    </div>
                </Row>
            : null 
            }
        </div>
    )
}

export default Details;