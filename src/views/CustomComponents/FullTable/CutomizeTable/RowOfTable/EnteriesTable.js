import React from 'react';
import { Button} from 'reactstrap';
import { Link } from 'react-router-dom';
import { dependencies } from './../../../../../tools/Dependencies';
import { appConfig } from './../../../../../tools/AppConfig';
import { auth } from './../../../../../tools/Auth';
import { useSelector, useDispatch } from "react-redux";
import { updateState } from './../../../../../redux/Tables/tables.actions';
import './EnteriesTable.scss';

const renderContent = (content, fullObj, strucElement) => {
  if (strucElement.type === "date") {
    return <span className="date_span">{dependencies.custom_date_format(content)}</span>
  } else if (strucElement.type === "amount") {
    if(strucElement.currencyField){
      return dependencies.convertAmount(content, fetchValue(fullObj, strucElement.currencyField));
    }else{
      return dependencies.convertAmount(content, fullObj.currency);
    }
  } else if (strucElement.type === "amount_egp") {
    if(strucElement.currencyField){
      return dependencies.convertAmountFullNoCurr(content, fetchValue(fullObj, strucElement.currencyField)) + " جنية مصرى ";
    }else{
      return dependencies.convertAmountFullNoCurr(content, fullObj.currency) + " جنية مصرى ";
    }
  } else if (strucElement.type === "amount_cents") {
    if(fullObj.currency){
      if(strucElement.currencyField){
        return dependencies.convertCentsAmountFull(content, fetchValue(fullObj, strucElement.currencyField));
      }else{
        return dependencies.convertCentsAmountFull(content, fullObj.currency);
      }
    }else{
      return dependencies.convertCentsAmountFullNoCurr(content);
    }
  }else if (strucElement.type === "status") {
    return dependencies.statusName(content);
  }else if (strucElement.type === "order_status") {
    return dependencies.order_status(content);
  }else if (strucElement.type === "custom_status") {
    return dependencies.custom_status(content);
  }else if (strucElement.type === "type") {
    return dependencies.typeName(content);
  }else if (strucElement.type === "payment") {
    return dependencies.paymentTypeName(content);
  } else if (strucElement.type === 'action') {
    let fullLink = "";
    if(strucElement.fullLink === false){
      fullLink += appConfig.getServerUrl();
    }
    fullLink += content;
    if(strucElement.provideToken === true){
      fullLink += "?token=" + auth.getMerchantToken();
    }
    if(strucElement.complateFlage){
      let complateFlage = fetchValue(fullObj, strucElement.complateFlage);
      return (
        <>
          {complateFlage == "true" ? 
            <Button className="primaryBtn btn" onClick={() => window.open(fullLink)}>{dependencies.getCurrentLang() == "ar" ? "تحميل" : "Download"}</Button>
          :
            <Button className="redownload disable btn" disabled onClick={() => window.open(content)}>{dependencies.getCurrentLang() == "ar" ? "قيد التحميل" : "Pending"} </Button>      
          }
          {complateFlage == "false" &&
            <div className="refreshContainer colored" onClick={() => { window.location.reload() }}><i className="fa fa-refresh" /></div>
          }
        </>
      )
    }else{
      return (
        <>
          {content !== "-"? 
            <Button className="primaryBtn btn" onClick={() => window.open(fullLink)}>{dependencies.getCurrentLang() == "ar" ? "تحميل" : "Download"}</Button>
          :
            <Button className="redownload disable btn" disabled onClick={() => window.open(content)}>{dependencies.getCurrentLang() == "ar" ? "قيد التحميل" : "Pending"} </Button>      
          }
          {content === "-" &&
            <div className="refreshContainer colored" onClick={() => { window.location.reload() }}><i className="fa fa-refresh" /></div>
          }
        </>
      )
    }
    
  } else if (strucElement.type === 'details') {
    return <Link to={`/${strucElement.route}/${content}`}> التفاصيل </Link>
  } else if (strucElement.type === "string_arr") {
    return string_arr(content);
  } else if (strucElement.type === "boolean") {
    return dependencies.boolName(content);
  } else if (strucElement.type === 'live') {
    return dependencies.isLiveName(content)
  } else if (strucElement.NEXT_uuid && strucElement.NEXT_uuid === true) {
    return NEXT_uuid(content)
  }else{
    return content
  }
}
const string_arr = (content) => {
  let final = "";
  content = content.slice(1, -1);
  content = content.split(',');
  content.map((ele, index) => {
    if(ele[0] == "'" && ele[ele.length - 1] == "'"){
      ele = ele.slice(1, -1);
    }
    if(index + 1 === content.length){
      final += ele;
    }else{
      final += ele + " - ";
    }
  })
  return final
}
const NEXT_uuid = (content) => {
  return(
    <span className="NEXT_uuid">
      <span>{content}</span>
      {content.slice(0, 8)}
    </span>
  )
}
const render_arr_obj = (content, field) => {
  let final_content = "";
  content.map((obj, index) => {
    if(index + 1 === content.length){
      final_content += obj[field];
    }else{
      final_content += obj[field] + " - ";
    }
  })
  return final_content
}
const renderContentLable = (content, lable) => {
  if(typeof lable === "object"){
    let finalContent = content;
    if(lable.else){
      finalContent = <span className={lable.else}>{content}</span>
    }
    Object.entries(lable).map((ele) => {
      if(ele[0] === content){
        finalContent = <span className={ele[1]}>{content}</span>
      }
    })
    return finalContent
  }else{
    return content
  }
}
const fetchValue = (dateObj, value, data_type, field, type) => {
  let finalValue;
  if(typeof value === "object"){
      if(value["type"] && value["type"] === "equal"){
          finalValue = value["default"];
          //check conditions list
          for (const [key, value] of Object.entries(value["conditions"])) {
              //check current condition
              let valuesArr = [];
              for (let x = 0; x < value.length; x++) {
                  valuesArr.push(fetchValue(dateObj, value[x]))
              }
              let match = true;
              let fristVal = valuesArr[0];
              for (let x = 0; x < valuesArr.length; x++) {
                  if(fristVal != valuesArr[x]){
                      match = false;
                  }
              }
              if(match){
                  finalValue = key;
              }
          }
      }else{
          finalValue = value["default"];
          //check conditions list
          for (const [key, value] of Object.entries(value["conditions"])) {
              //check current condition
              let match = true;
              for (const [field, field_value] of Object.entries(value)) {
                  if(dateObj[field] !== field_value){
                      match = false;
                  }
              }
              if(match){
                  finalValue = key;
              }
          }
      }
      finalValue = finalValue.trim()
  }else{
      if(data_type && data_type === "arr_obj"){
        //finalValue = "";
        let varsArr = value.split('+');
        varsArr.map((stringVar) => {
            let varFinalValue = dateObj;
            let position_arr = stringVar.split('.');
            position_arr.map((ele) => {
                const regex = /[[0-9]+]$/g;
                let ofPlace = ele.search(regex);
                if(ofPlace == -1){
                    if(typeof varFinalValue[ele] == "boolean"){
                        varFinalValue = varFinalValue[ele]
                    }else{
                        varFinalValue = varFinalValue[ele] ? varFinalValue[ele] : " - "
                    }
                }else{
                    let ele1 = ele.slice(0, ofPlace);
                    let ele2 = ele.slice(ofPlace).slice(1).slice(0, -1);
                    if(typeof varFinalValue[ele1][ele2] == "boolean"){
                        varFinalValue = varFinalValue[ele1][ele2]
                    }else{
                        varFinalValue = varFinalValue[ele1][ele2] ? varFinalValue[ele1][ele2] : " - "
                    }
                }
            })
            if(type == "arr_length"){
              finalValue = varFinalValue.length;
            }else{
              finalValue = render_arr_obj(varFinalValue, field)
            }
        })
      }else{
        finalValue = "";
        let varsArr = value.split('+');
        varsArr.map((stringVar) => {
            let varFinalValue = dateObj;
            let position_arr = stringVar.split('.');
            position_arr.map((ele) => {
                const regex = /[[0-9]+]$/g;
                let ofPlace = ele.search(regex);
                if(ofPlace == -1){
                    if(typeof varFinalValue[ele] == "boolean"){
                        varFinalValue = varFinalValue[ele]
                    }else{
                        varFinalValue = varFinalValue[ele] ? varFinalValue[ele] : " - "
                    }
                }else{
                    let ele1 = ele.slice(0, ofPlace);
                    let ele2 = ele.slice(ofPlace).slice(1).slice(0, -1);
                    if(typeof varFinalValue[ele1][ele2] == "boolean"){
                        varFinalValue = varFinalValue[ele1][ele2]
                    }else{
                        varFinalValue = varFinalValue[ele1][ele2] ? varFinalValue[ele1][ele2] : " - "
                    }
                }
            })
            finalValue += varFinalValue + " ";
        })
        finalValue = finalValue.trim()
      }
  }
  return finalValue
}
const handleRowClick = (ele, state, props, dispatch) => {
  if(state.pointerRow){
    let newState = {...state};
    if(state.selectedRow && state.selectedRowData.id === ele.id){
      newState.selectedRowData = {};
      newState.selectedRow = false;
      newState.details_waiting = true;
      newState.selectedRowParentData = {};
    }else{
      newState.selectedRowData = ele;
      newState.selectedRow = true;
      newState.detailsActiveTab = 0;
      newState.details_waiting = true;
      newState.selectedRowParentData = {};
      setTimeout(()=>{
        window.scrollBy(0, 100000);
      },10)
    }
    dispatch(updateState(newState, props.name));
  }
}
const EnteriesTable = (props) => {
  const dispatch = useDispatch();
  let state = useSelector(state => state.tables[props.name]);
  let ArrayData = []; 
    for (let x = 0; x < props.Data.length; x++) {
      if(!props.Data[x].id){props.Data[x].id = props.Data[x]._id;}
      let rowClass = "";
      if(props.Data[x].id === state.selectedRowData.id && state.selectedRow && state.pointerRow){
        rowClass += " selectedRow ";
      }
      if(state.pointerRow){
        rowClass += " cursorRow ";
      }
      ArrayData.push(
        <tr key={props.Data[x].id} onClick={() => handleRowClick(props.Data[x], state, props, dispatch)} className={rowClass}> 
          {props.strucObj.map(element => {


            let tableDataContents = fetchValue(props.Data[x], element.value, element.data_type, element.field, element.type);
            if(element.NEXT_uuid){
              return( 
                <td className="NEXT_uuid_td">{tableDataContents && typeof tableDataContents !== "object" ? renderContentLable(renderContent(tableDataContents, props.Data[x], element), element.lable) : " - "}</td>
              )
            }else{
              return( 
                <td>
                  {tableDataContents && typeof tableDataContents !== "object" ? 
                    renderContentLable(renderContent(tableDataContents, props.Data[x], element), element.lable) 
                  : 
                    tableDataContents == 0 ? tableDataContents : " - "
                  }
                </td>
              )
            }
          })}
          
        </tr>
      )
    }
 return ArrayData;
}
export default EnteriesTable;