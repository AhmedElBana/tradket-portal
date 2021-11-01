/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table ,Button} from 'reactstrap';
import { dependencies } from './../../../../tools/Dependencies';
import { auth } from './../../../../tools/Auth';

import text from './Text.json';
import EnteriesTable from './RowOfTable/EnteriesTable';
import CustomPagination from './FooterOFTable/Paginations';
import './customizeTable.scss';

import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../redux/Tables/tables.actions';

let Text;
localStorage.lang == "ar" ?
  Text = text.ar
  :
  Text = text.en;

function CustomizeTable(props) {
  const dispatch = useDispatch();
  let state = useSelector(state => state.tables[props.name]);
  return (
    <div>
      {state.totalLength !== 0 || state.data.length !== 0?
        <>
          <div className="currentTableDiv">
            <Table className="mainTable">
              <thead>
                <tr>
                  {props.strucObj.map((ele, index) => {
                    return <th key={index}>{localStorage.lang === "ar" ? ele.name_ar : ele.name}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                <EnteriesTable
                  name={props.name}
                  Data={state.data}
                  strucObj={props.strucObj}
                  setting={props.setting}
                />
              </tbody>
            </Table>
          </div>
          {props.checkPagination && <CustomPagination Text={Text} name={props.name} />}
          {props.setting.goToFull && state.data.length !== 0 &&
            <Link to={"/" + localStorage.lang + "" + props.setting.goToFull} className="blockLink">{localStorage.lang == "ar" ? "عرض الكل":"View All"}</Link>
          }
          
        </>
        :
        <p className="NoDataAvail">
          {Text.noData}
        </p>
      }
    </div>
  );
}
export default CustomizeTable;