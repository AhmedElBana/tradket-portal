import React, { Component } from 'react';
import {
  FormGroup,
  Label
} from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import './toggleFilter.scss'

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../../redux/Tables/tables.actions';

const handleChangeFilter = (event, state, props, dispatch) => {
  let newState = {...state};
  newState.currentFilters[props.filterName] = !newState.currentFilters[props.filterName];
  let finalNewState = {
      "filters": newState
  };
  dispatch(updateState(finalNewState, props.stateName));
}

function ToggleFilter(props) {
  const dispatch = useDispatch();
  let state = useSelector(state => state.tables[props.stateName].filters);
  if(!state.currentFilters[props.filterName] && state.currentFilters[props.filterName]!= ""){
    let newState = {...state};
    newState.currentFilters[props.filterName] = false;
    newState.currentFiltersError[props.filterName] = {"state": false, "message": ""};
    let finalNewState = {
        "filters": newState
    };
    dispatch(updateState(finalNewState, props.stateName));
  }
  return (
    <FormGroup className="parentDiv">
      <Label className="toggleName" htmlFor="ccmonth">{localStorage.lang == "ar" ? props.name_ar : props.name}</Label>
      <AppSwitch className={'mx-1'} variant={'pill'} color={'info'}
        name={props.filterName}
        onChange={(e) => handleChangeFilter(e, state, props, dispatch)}
        checked={state.currentFilters[props.filterName]}
        value={state.currentFilters[props.filterName]}
      />
    </FormGroup>
  )
}

export default ToggleFilter;