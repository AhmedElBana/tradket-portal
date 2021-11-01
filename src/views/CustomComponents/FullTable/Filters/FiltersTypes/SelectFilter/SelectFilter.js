import React, { Component } from 'react';
import {
  FormGroup,
  Input,
  Label
} from 'reactstrap';

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../../redux/Tables/tables.actions';


const handleChangeFilter = (event, state, props, dispatch) => {
  let newState = {...state};
  newState.currentFilters[props.filterName] = event.target.value;
  let finalNewState = {
      "filters": newState
  };
  dispatch(updateState(finalNewState, props.stateName));
}

function SelectFilter(props) {
  const dispatch = useDispatch();
  let state = useSelector(state => state.tables[props.stateName].filters);
  if(!state.currentFilters[props.filterName] && state.currentFilters[props.filterName]!= ""){
    let newState = {...state};
    let finalNewState;
    if(props.required && props.required.defualt && newState.filtersStatus == false){
      newState.currentFilters[props.filterName] = props.required.defualt;
      newState.currentFiltersError[props.filterName] = {"state": false, "message": ""};
      newState.filtersStatus = true;
      finalNewState = {
          "filters": newState,
          "waiting": true
      };
    }else{
      newState.currentFilters[props.filterName] = "";
      newState.currentFiltersError[props.filterName] = {"state": false, "message": ""};
      finalNewState = {
          "filters": newState
      };
    }
    
    dispatch(updateState(finalNewState, props.stateName));
  }
  return (
    <FormGroup>
      <Label htmlFor="ccmonth">{localStorage.lang == "ar" ? props.name_ar : props.name} <span className="filetrs_required_span">{props.required && props.required.defualt && "*"}</span></Label>
      <Input type="select" className="filter-input filterInputGruop"
        name={props.filterName}
        value={state.currentFilters[props.filterName]}
        onChange={(e) => handleChangeFilter(e, state, props, dispatch)}
        >
        <option value="" disabled>{localStorage.lang == "ar" ? props.message_ar : props.message}</option>
      {
        props.options.map((element) => {
          return <option key={element.value} value={element.value}>{localStorage.lang == "ar" ? element.text_ar : element.text}</option>
        })
      }
      </Input>
    </FormGroup>
  )
}

export default SelectFilter;