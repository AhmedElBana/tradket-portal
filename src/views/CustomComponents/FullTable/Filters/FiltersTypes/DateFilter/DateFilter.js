import React, { Component } from 'react';
import {
    Col,
    Row,
    FormGroup,
    Label
} from 'reactstrap';
import { DatePicker } from 'rsuite';
import TextFile from './text.json';
import { dependencies } from './../../../../../../tools/Dependencies';

import { isAfter } from 'date-fns';
import "rsuite/dist/styles/rsuite-default.css";

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../../redux/Tables/tables.actions';

let Text = TextFile[dependencies.getCurrentLang()];


const handleDateChange = (value, state, props, dispatch) => {
    let finalValue;
    if(value == null){finalValue = ""}else{finalValue = value.toISOString()}
    let newState = {...state};
    newState.currentFilters[props.filterName] = finalValue;
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, props.stateName));
}


function DateFilter(props) {
    const dispatch = useDispatch();
    let state = useSelector(state => state.tables[props.stateName].filters);
    if(!state.currentFilters[props.filterName] && state.currentFilters[props.filterName]!= ""){
        let newState = {...state};
        newState.currentFilters[props.filterName] = "";
        newState.currentFiltersError[props.filterName] = {"state": false, "message": ""};
        let finalNewState = {
            "filters": newState
        };
        dispatch(updateState(finalNewState, props.stateName));
    }
    
    return (
        <Row>
            <Col xs="12" sm="12" lg="12" >
                <FormGroup>
                    <Label htmlFor="ccmonth">{localStorage.lang == "ar" ? props.name_ar : props.name}</Label>
                    <DatePicker
                        size="lg"
                        defaultValue={new Date(new Date().setHours(0, 0, 0, 0))}
                        placeholder={Text.day}
                        placement="bottomStart" 
                        block
                        limitEndYear= {3}
                        hoverRange="month"
                        disabledDate={date => isAfter(date, new Date())}
                        format="YYYY-MM-DD HH:mm:ss"
                        value={state.currentFilters[props.filterName]}
                        onChange={(value) => handleDateChange(value, state, props, dispatch)}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}

export default DateFilter;