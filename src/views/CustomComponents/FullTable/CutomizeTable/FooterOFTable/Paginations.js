import React from 'react';
import ReactPaginate from 'react-paginate';
import './Pagination.scss';

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../redux/Tables/tables.actions';

const handleTableSizeChange = (event, state, props, dispatch) => {
  let newState = {...state};
  newState.pageSize = event.target.value;
  newState.pageNumber = 0;
  newState.waiting = true;
  dispatch(updateState(newState, props.name));
}
const handleTablePageChange = (data, state, props, dispatch) => {
  let newState = {...state};
  newState.pageNumber = data.selected;
  newState.waiting = true;
  dispatch(updateState(newState, props.name));
}

const CustomPagination = (props) => {
  const dispatch = useDispatch();
  let state = useSelector(state => state.tables[props.name]);
  
  return (
    <>
      <select className="accept-select" onChange={(e) => handleTableSizeChange(e, state, props, dispatch)} value={state.pageSize}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      {state.totalLength === 0 && state.data.length !== 0 ?
        <ReactPaginate
          pageCount={1000}
          marginPagesDisplayed={2}
          onPageChange={(data) => handleTablePageChange(data, state, props, dispatch)}
          forcePage={state.pageNumber}
          containerClassName="paginationList noCountPagination"
          nextLabel={props.Text.nextLabel}
          previousLabel={props.Text.previousLabel}
        />
      :
        <ReactPaginate
          pageCount={Math.ceil(state.totalLength / state.pageSize)}
          marginPagesDisplayed={2}
          onPageChange={(data) => handleTablePageChange(data, state, props, dispatch)}
          forcePage={state.pageNumber}
          containerClassName="paginationList"
          nextLabel={props.Text.nextLabel}
          previousLabel={props.Text.previousLabel}
        />
      }
    </>
  )
}
export default CustomPagination;