import React, { Component } from 'react';
import {
    Col,
    Row,
    Collapse, Button
} from 'reactstrap';
import VForm from 'react-validation/build/form';
import VButton from 'react-validation/build/button';
import DateFilter from './FiltersTypes/DateFilter/DateFilter';
import DateRangeFilter from './FiltersTypes/DateRangeFilter/DateRangeFilter';
import InputFilter from './FiltersTypes/InputFilter/InputFilter';
import SelectFilter from './FiltersTypes/SelectFilter/SelectFilter';
import ToggleFilter from './FiltersTypes/ToggleFilter/ToggleFilter';
import TextFile from './text.json';
import { dependencies } from './../../../../tools/Dependencies';
import DisplayFilters from './DisplayFilters/DisplayFilters';
import './filters.scss';

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../redux/Tables/tables.actions';

let Text = TextFile[dependencies.getCurrentLang()];

const filtersToggle = (state, name, dispatch) => {
    // let old = this.state.filtersMenuOpen;
    // this.setState({ filtersMenuOpen: !old });
    let newState = {...state};
    newState.filtersMenuOpen = !newState.filtersMenuOpen;
    let finalNewState = {"filters": newState};
    dispatch(updateState(finalNewState, name));
}
const handleRemoveFilters = (state, name, dispatch) => {
    //onClear(state, name, dispatch);
    let newState = {...state};
    newState.filtersMenuOpen = false;
    newState.filtersStatus = false;
    newState.currentFilters = {};
    newState.currentFiltersError = {};
    let finalNewState = {
        "filters": newState,
        "waiting": true
    };
    dispatch(updateState(finalNewState, name));
}
const handleFiltersSubmit = (event, state, name, dispatch) => {
    event.preventDefault();
    let newState = {...state};
    newState.filtersMenuOpen = false;
    newState.filtersStatus = true;
    let finalNewState = {
        "filters": newState,
        "waiting": true,
        "pageNumber": 0
    };
    dispatch(updateState(finalNewState, name));
}
const onClear = (state, name, dispatch) => {
    let newState = {...state};
    newState.currentFilters = {};
    newState.currentFiltersError = {};
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, name));
}
const checkDisplayPortal = (ele) => {
    if(ele.for_partner_portal){
        if(localStorage.acq_partner == "true" && localStorage.partner_code === ele.for_partner_portal){
            return true
        }else{
            return false
        }
    }else{
        return true
    }
}
const renderInputType = (ele, props, index) => {
    return(
        ele.type === "date" ?
            <Col xs={ele.size && ele.size.xs? ele.size.xs: "12"} sm={ele.size && ele.size.sm? ele.size.sm: "6"} md={ele.size && ele.size.md? ele.size.md: "6"} lg={ele.size && ele.size.lg? ele.size.lg: "3"}>
                <DateFilter
                    stateName={props.name}
                    name={ele.name}
                    name_ar={ele.name_ar}
                    filterName={ele.filterName}
                    key={index}
                />
            </Col>
        : ele.type === "dateRange" ?
            <Col xs={ele.size && ele.size.xs? ele.size.xs: "12"} sm={ele.size && ele.size.sm? ele.size.sm: "12"} md={ele.size && ele.size.md? ele.size.md: "12"} lg={ele.size && ele.size.lg? ele.size.lg: "6"}>
                <DateRangeFilter
                    stateName={props.name}
                    name={ele.name}
                    name_ar={ele.name_ar}
                    key={index}
                    filterNameFrom={ele.filterNameFrom}
                    filterNameTo={ele.filterNameTo}
                    date_range={ele.date_range}
                />
            </Col>
        : ele.type === "input" ?
            <Col xs={ele.size && ele.size.xs? ele.size.xs: "12"} sm={ele.size && ele.size.sm? ele.size.sm: "6"} md={ele.size && ele.size.md? ele.size.md: "6"} lg={ele.size && ele.size.lg? ele.size.lg: "3"}>
                <InputFilter
                    stateName={props.name}
                    name={ele.name}
                    name_ar={ele.name_ar}
                    filterName={ele.filterName}
                    key={index}
                    validations={ele.validations}
                />
            </Col>
        : ele.type === "select" ?
            <Col xs={ele.size && ele.size.xs? ele.size.xs: "12"} sm={ele.size && ele.size.sm? ele.size.sm: "6"} md={ele.size && ele.size.md? ele.size.md: "6"} lg={ele.size && ele.size.lg? ele.size.lg: "3"}>
                <SelectFilter
                    stateName={props.name}
                    name={ele.name}
                    name_ar={ele.name_ar}
                    filterName={ele.filterName}
                    key={index}
                    options={ele.options}
                    message={ele.message}
                    message_ar={ele.message_ar}
                    required={ele.required}
                />
            </Col>
        : ele.type === "toggle" ?
            <Col xs={ele.size && ele.size.xs? ele.size.xs: "12"} sm={ele.size && ele.size.sm? ele.size.sm: "6"} md={ele.size && ele.size.md? ele.size.md: "6"} lg={ele.size && ele.size.lg? ele.size.lg: "3"}>
                <ToggleFilter 
                    stateName={props.name}
                    name={ele.name}
                    name_ar={ele.name_ar}
                    filterName={ele.filterName}
                    key={index}
                />
            </Col>
        : null
    )
}
//class Filter extends Component {
function Filter(props) {
    const dispatch = useDispatch();
    let state = useSelector(state => state.tables[props.name].filters);

    let validationError = false;
    for (const [key, value] of Object.entries(state.currentFiltersError)) {
        if(value.state){
            validationError = true;
        }
    }
    return (
        <div className="filtersDiv">
            <div className="filtersDivBtn">
                {!state.filtersMenuOpen && state.filtersStatus &&
                    <Button onClick={() => handleRemoveFilters(state, props.name, dispatch)} className="filterCompButton removeFButton">{Text.button.remove}</Button>
                }
                {!state.filtersMenuOpen &&
                    <Button className="filterCompButton SubmitFButton" onClick={() => filtersToggle(state, props.name, dispatch)}>
                        <i className="fa fa-filter" /> {Text.filter}
                    </Button>
                }
            </div>
            <Collapse isOpen={state.filtersMenuOpen}>
                <VForm onSubmit={(e) => handleFiltersSubmit(e, state, props.name, dispatch)} className="filtersForm">
                    <Row>
                        {props.filtersArr.map((ele, index) => {
                            return(
                                checkDisplayPortal(ele) ? renderInputType(ele, props, index) : null
                            )
                        })}
                    </Row>
                    <Row>
                        <Col className="filtersButtons">
                            <Button className="filterCompButton cancelFButton" onClick={() => filtersToggle(state, props.name, dispatch)}>{Text.button.cancel}</Button>
                            <Button className="filterCompButton resetFButton" onClick={() => onClear(state, props.name, dispatch)}>{Text.button.reset}</Button>
                            {!validationError ? 
                                <VButton className="filterCompButton SubmitFButton" type="submit"><i className="fa fa-filter" /> {Text.button.filter}</VButton>
                            :
                                <Button disabled={true} className="filterCompButton SubmitFButton"><i className="fa fa-filter" /> {Text.button.filter}</Button>
                            }
                        </Col>
                    </Row>
                </VForm>
            </Collapse>
            {!state.filtersMenuOpen && state.filtersStatus &&
                <DisplayFilters
                    state={state} 
                />
            }
        </div>
    )
}

export default Filter;