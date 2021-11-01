import React, { Component } from 'react';
import {
    Col,
    Row,
    FormGroup,
    Label,
} from 'reactstrap';
import { DatePicker } from 'rsuite';
import TextFile from './text.json';
import { dependencies } from './../../../../../../tools/Dependencies';
import { isBefore,add, isAfter} from 'date-fns';
import "rsuite/dist/styles/rsuite-default.css";

import './dateRangeFilter.scss';

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../../redux/Tables/tables.actions';

let Text = TextFile[dependencies.getCurrentLang()];


const disabledDate = (date, state, props) => {
    let start_date = new Date(state.currentFilters[props.filterNameFrom]);
    const MinDates = add(start_date, {days:props.date_range? props.date_range: 30});
    if (state.currentFilters[props.filterNameFrom] === "") {
        return true
    }else if(isBefore(date,start_date) || isAfter(date, new Date().setHours(23,59,59,0))){
        return true
    }else if (isAfter(date, MinDates)){
        return true
    }
    else{
        return false
    }
}
const handleStartDateChange = (value, state, props, dispatch) => {
    let newState = {...state};
    if(value == null){
        newState.currentFilters[props.filterNameFrom] = "";
        newState.currentFilters[props.filterNameTo] = "";
    }else{
        newState.currentFilters[props.filterNameFrom] = value.toISOString();
    }
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, props.stateName));
}
const handleEndDateChange = (date, state, props, dispatch) => {
    let end_date = state.currentFilters[props.filterNameTo];
    let newState = {...state};
    if(date !== null){
        if(date.getFullYear() === new Date(end_date).getFullYear() && date.getMonth() === new Date(end_date).getMonth() && date.getDate() === new Date(end_date).getDate()){
            newState.currentFilters[props.filterNameTo] = date.toISOString();
        }else{
            if(date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate()){
                date.setHours(new Date().getHours(), new Date().getMinutes() , new Date().getSeconds(), 0);
                newState.currentFilters[props.filterNameTo] = date.toISOString();
            }else{
                date.setHours(23, 59, 59, 0);
                newState.currentFilters[props.filterNameTo] = date.toISOString();
            }
        }
    }else {
        newState.currentFilters[props.filterNameTo] = "";
    }
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, props.stateName));
}

function DateRangeFilter(props){
    const dispatch = useDispatch();
    let state = useSelector(state => state.tables[props.stateName].filters);
    if(!state.currentFilters[props.filterNameFrom] && state.currentFilters[props.filterNameFrom]!= "" && !state.currentFilters[props.filterNameTo] && state.currentFilters[props.filterNameTo]!= ""){
        let newState = {...state};
        newState.currentFilters[props.filterNameFrom] = "";
        newState.currentFiltersError[props.filterNameFrom] = {"state": false, "message": ""};
        newState.currentFilters[props.filterNameTo] = "";
        newState.currentFiltersError[props.filterNameTo] = {"state": false, "message": ""};
        let finalNewState = {
            "filters": newState
        };
        dispatch(updateState(finalNewState, props.stateName));
    }
    return (
        <Row>
            <Col xs="12" sm="12" lg="12" >
                <Label htmlFor="ccmonth">{localStorage.lang == "ar" ? props.name_ar : props.name}</Label>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6">
                <FormGroup>
                    <DatePicker
                        name={props.filterNameStart}
                        size="lg"
                        defaultValue={new Date(new Date().setHours(0, 0, 0, 0))}
                        placeholder={Text.from}
                        placement="bottomStart" 
                        block
                        limitEndYear={3}
                        disabledDate={date => isAfter(date, new Date())}
                        format="YYYY-MM-DD HH:mm:ss"
                        value={state.currentFilters[props.filterNameFrom]}
                        onChange={(value) => handleStartDateChange(value, state, props, dispatch)}
                    />
                </FormGroup>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6">
                <FormGroup>
                    <DatePicker
                        name={props.filterNameEnd}
                        size="lg"
                        defaultValue={new Date(new Date().setSeconds(0, 0))}
                        placeholder={Text.to}
                        disabledDate={(date) => disabledDate(date, state, props, dispatch)}
                        placement="bottomEnd"
                        block
                        limitEndYear={3}
                        format="YYYY-MM-DD HH:mm:ss"
                        value={state.currentFilters[props.filterNameTo]}
                        onChange={(value) => handleEndDateChange(value, state, props, dispatch)}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}

export default DateRangeFilter;