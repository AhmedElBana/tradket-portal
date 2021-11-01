import React, { Component, useEffect } from 'react';

import {httpClient} from './../../../tools/HttpClient';
//import {appConfig} from "./../../../tools/AppConfig";
import {auth} from './../../../tools/Auth';
import {dependencies} from './../../../tools/Dependencies';
import Waiting from './../../Waiting/waiting';

import { useSelector, useDispatch } from "react-redux";
import {
  setTableState,
  updateState
} from './../../../redux/Tables/tables.actions';
import { Row } from 'reactstrap';
import Filters from './Filters/Filters';
import Table from './CutomizeTable/CustomizeTable';
import Details from './Details/Details';

const fetchData = (state, name, dispatch) => {
  let newState2 = {};
  newState2.loading = true;
  dispatch(updateState(newState2, name));
  let finalFilters = {};
  for (const [key, value] of Object.entries(state.filters.currentFilters)) {
    if(value){
      finalFilters[key] = value;
    }
  }
  let config = {
    headers: {
      "Content-Type": "application/json",
      //"Cache-Control": "no-cache"
      //"Authorization": "Bearer " + auth.getMerchantToken()
      "x-auth": auth.getMerchantToken()
    },
    params: {
      "page": state.pageNumber + 1,
      "page_size": state.pageSize,
      ...finalFilters
    }
  }
  httpClient.get(
    state.path,
    config,
    (resp) => {
      let newState = {};
      let data;
      console.log(resp)
      if(resp.data.data.result){
        data = resp.data.data.result;
        newState.totalLength = resp.data.data.total;
      }else{
        data = resp.data;
        newState.totalLength = resp.data.length;
      }
      
      newState.waiting = false;
      newState.loading = false;
      newState.data = data;
      
      newState.selectedRow = false;
      newState.selectedRowData = {};
      dispatch(updateState(newState, name));
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          auth.logout();
        }else if (error.response.status === 404) {
          if(error.response.data.detail == "Invalid page."){
            //this.setState({ transactionsData: [], transactionsWaiting: false });
            //this.handleTablePageChange({selected: this.state.transPageNumber - 1})

            let newState = {};
            newState.waiting = false;
            newState.pageNumber = state.pageNumber - 1;
            dispatch(updateState(newState, name))
          }else{
            //this.setState({ transTableShow: false });
          }
        } else {
          //this.setState({ transTableShow: false });
        }
      } else {
        //this.setState({ transTableShow: false });
      }
    }
  )
}
function FullTable(props) {
  let state = useSelector(state => state.tables[props.name]);
  const dispatch = useDispatch();
  if(!state){
    dispatch(setTableState(props));
  }
  if(state && state.waiting){
    if(!state.loading){
      fetchData(state, props.name, dispatch);
    }
  }
  let title = props.name;
  if(props.table){
    if(dependencies.getCurrentLang() === "ar"){
      title = props.table.setting.title_ar;
    }else{
      title = props.table.setting.title;
    }
  }
  return(
    <>
      {state &&
        <>
          {state.waiting?
            <Waiting height="300px"/>
          :
            <>
              <Row>
                <div className="x_panel">
                  <div className="x_title">
                    <h2>{title}</h2>
                  </div>
                  {props.filters && 
                    <div className="TableDiv">
                        <Filters filtersArr={props.filters} name={props.name}/>
                    </div>
                  }
                  {props.table && 
                    <div>
                      <Table 
                          name={props.name}
                          strucObj={props.table.struc}
                          checkPagination={props.table.setting.pagination}
                          setting={props.table.setting}
                      />
                    </div>
                  }
                </div>
              </Row>
              {props.details && 
                <div>
                  <Details 
                    name={props.name}
                    obj={props.details}
                    detailsButtons={props.detailsButtons ? props.detailsButtons : null}
                  />
                </div>
              }
            </>
          }
        </>
      }
    </>
  );
}
export default FullTable