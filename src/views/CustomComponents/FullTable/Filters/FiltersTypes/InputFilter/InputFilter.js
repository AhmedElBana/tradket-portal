import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Alert,
} from 'reactstrap';
import validator from 'validator';

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../../redux/Tables/tables.actions';

let numberError = "Please enter valid number.";
let amountError = "Please enter valid Amount.";
let intNumberError = "Please enter integer number.";
let isUrlError= "Please enter valid url."
let htmlTagsError = "Please remove any HTML tags.";
const checkInputValidty = (props, state, dispatch) => {
  let error = false;
  let message = "";
  //current value
  let newState = {...state};
  let value = newState.currentFilters[props.filterName];
  //check defualt validation
  let htmlTagsReg = new RegExp("<.*>");
  if (htmlTagsReg.test(value)) {
    error = true;
    message = htmlTagsError;
  }
  //check passed validation
  props.validations.map((rule)=>{
    if(rule === "intNumber"){
      var numberReg = /^[0-9]+$/;
      if (!numberReg.test(value) && value !== "") {
        error = true;
        message = intNumberError;
      }
    }
    if(rule === "number"){
      if (isNaN(value)) {
        error = true;
        message = numberError;
      }
    }
    if(rule === "amount"){
      let floatValue = parseFloat(value);
      if (floatValue <= 0 || value[0] == "0") {
        error = true;
        message = amountError;
      }
    }
    if(rule === "link"){
      if (!validator.isURL(value) && value.toString().trim().length > 0) {
        error = true;
        message = isUrlError;
      }
    }
  });
  //apply result
  if(error){
    newState.currentFiltersError[props.filterName].state = true;
    newState.currentFiltersError[props.filterName].message = message;
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, props.stateName));
  }else if(!error && newState.currentFiltersError[props.filterName].state){
    newState.currentFiltersError[props.filterName].state = false;
    newState.currentFiltersError[props.filterName].message = "";
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, props.stateName));
  }
}
const handleChangeFilter = (event, state, props, dispatch) => {
  let newState = {...state};
  newState.currentFilters[props.filterName] = event.target.value;
  let finalNewState = {
      "filters": newState
  };
  dispatch(updateState(finalNewState, props.stateName));
  checkInputValidty(props, state, dispatch);
}
function InputFilter(props) {
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
    <FormGroup className="filterInputGruop">
      <Label htmlFor="ccmonth">{localStorage.lang == "ar" ? props.name_ar : props.name}</Label>
      <>
        <input type="text" className="filter-input"
          autoComplete="off"
          name={props.filterName}
          value={state.currentFilters[props.filterName]}
          onChange={(e) => handleChangeFilter(e, state, props, dispatch)}
          placeholder={localStorage.lang == "ar" ? props.name_ar : props.name}
        />
        {state.currentFiltersError[props.filterName].state &&
          <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {state.currentFiltersError[props.filterName].message}
            </Alert>
          </div>
        }
      </>
    </FormGroup>
  );
}

export default InputFilter;