import React, { Component } from 'react';
import CopyToClipboard from './../../../CopyToClipboard/CopyToClipboard';
import { dependencies } from './../../../../tools/Dependencies';
import { Table } from 'reactstrap';

const fetchValue = (dateObj, value) => {
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
    }
    return finalValue.trim()
}
const checkDisplayCoditions = (dateObj, ele) =>{
    if(ele.displayConditions){
        let finalValu = fetchValue(dateObj, ele.displayConditions);
        if(finalValu == "false"){
            return false
        }else{
            return true
        }
    }else{
        return true
    }
}
const renderArrayType = (strucEle, data) => {
    // loop on data array
    return ( 
        <td> 
            {data[strucEle["value"]].map((data) => {
                return (
                    strucEle.subType === "payment" ?
                        <div key={data.id} className="integrationBlock">{dependencies.paymentTypeName(fetchValue(data, strucEle.subValue).trim())}</div>
                    : strucEle.subType === "integration" ?
                        <div key={data.id} className="integrationBlock">{dependencies.integrationsName(fetchValue(data, strucEle.subValue).trim())}</div>
                    : 
                        <div key={data.id} className="integrationBlock">{fetchValue(data, strucEle.subValue).trim()}</div>
                    
                )
            })}
        </td>
    )
}
const renderBill = (strucEle, data) => {
    return(
        <td>
            <div className="product_map">
                <Table className="usersTable mainTable">
                    <thead>
                    <tr>
                        <th>رقم المنتج</th>
                        <th>الاسم</th>
                        <th>السعر</th>
                        <th>العدد</th>
                        <th>الاجمالي</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data[strucEle.value].map((product,index)=>{
                        return(
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.total}</td>
                        </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        </td>
    )
}
const renderProduct_bill = (strucEle, data) => {
    return(
        <td>
            <div className="product_map">
                <Table className="usersTable mainTable">
                    <thead>
                    <tr>
                        <th>رقم المنتج</th>
                        <th>الاسم</th>
                        <th>العدد</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data[strucEle.value].map((product,index)=>{
                        return(
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                        </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        </td>
    )
}
function ShowDataType(props) {
    if (props.use_parent_data && props.use_parent_data === true){
        return (
            <>
                {props.obj.map((ele, index) => {
                    return(
                        checkDisplayCoditions(props.parent_data, ele) ? 
                            <tr key={ele.value + "-" + index}>
                                <td>{localStorage.lang === "ar" ? ele.title_ar : ele.title}</td>
                                {ele.type === "link"?
                                    <td>
                                        <a className="previewBtn" href={fetchValue(props.parent_data, ele.value)} target="_blank"><i className=" fa fa-share-square-o" />Preview</a>
                                        <CopyToClipboard text={fetchValue(props.parent_data, ele.value)} />
                                    </td>
                                : ele.type === "payment"?
                                    <td>{ele.value ? dependencies.paymentTypeName(fetchValue(props.parent_data, ele.value)) : "-"}</td>
                                : ele.type === "amount_cents" && ele.currencyField !== undefined?
                                    <td>{dependencies.convertCentsAmountFull(fetchValue(props.parent_data, ele.value), fetchValue(props.parent_data, ele.currencyField))}</td>
                                : ele.type === "amount_cents" && ele.currencyField === undefined?
                                    <td>{dependencies.convertCentsAmountFull(fetchValue(props.parent_data, ele.value), props.parent_data.currency)}</td>
                                : ele.type === "amount" && ele.currencyField === undefined?
                                    <td>{ele.value ? dependencies.convertAmount(fetchValue(props.parent_data, ele.value), props.parent_data.currency) : "Not Specified"}</td>
                                : ele.type === "amount" && ele.currencyField !== undefined?
                                    <td>{ele.value ? dependencies.convertAmount(fetchValue(props.parent_data, ele.value), fetchValue(props.parent_data, ele.currencyField)) : "Not Specified"}</td>
                                : ele.type === "date"?
                                    <td>{ele.value ? dependencies.custom_date_format(fetchValue(props.parent_data, ele.value)) : "-"}</td>
                                : ele.type === "boolean"?
                                    <td>{ele.value ? dependencies.boolName(fetchValue(props.parent_data, ele.value).trim()) : "-"}</td>
                                : ele.type === "array_length"?
                                    <td>{ele.value ? fetchValue(props.parent_data, ele.value).trim().split(",").length : "-"}</td>
                                : ele.type === "array"?
                                    renderArrayType(ele, props.parent_data)
                                : ele.type === "bill"?
                                    renderBill(ele, props.parent_data)
                                :  ele.type === "product_bill"?
                                    renderProduct_bill(ele, props.data)
                                : 
                                    <td>{fetchValue(props.parent_data, ele.value) ? fetchValue(props.parent_data, ele.value) : "-"}</td>
                                }
                            </tr>
                        :
                            null
                    )
                })}
            </>
        )
    }else{
        return (
            <>
                {props.obj.map((ele, index) => {
                    return(
                        checkDisplayCoditions(props.data, ele) ? 
                            <tr key={ele.value + "-" + index} className={ele.type != "bill" && ele.type != "product_bill" ? "integrationBlockTR" : "bill_tr"}>
                                <td>{localStorage.lang === "ar" ? ele.title_ar : ele.title}</td>
                                {ele.type === "link"?
                                    <td>
                                        <a className="previewBtn" href={fetchValue(props.data, ele.value)} target="_blank"><i className=" fa fa-share-square-o" />Preview</a>
                                        <CopyToClipboard text={fetchValue(props.data, ele.value)} />
                                    </td>
                                : ele.type === "payment"?
                                    <td>{ele.value ? dependencies.paymentTypeName(fetchValue(props.data, ele.value)) : "-"}</td>
                                : ele.type === "amount_cents" && ele.currencyField === undefined?
                                    <td>{dependencies.convertCentsAmountFull(fetchValue(props.data, ele.value), props.data.currency)}</td>
                                : ele.type === "amount_cents" && ele.currencyField !== undefined?
                                    <td>{dependencies.convertCentsAmountFull(fetchValue(props.data, ele.value), fetchValue(props.data, ele.currencyField))}</td>
                                : ele.type === "amount" && ele.currencyField === undefined?
                                    <td>{ele.value ? dependencies.convertAmount(fetchValue(props.data, ele.value), props.data.currency) : "Not Specified"}</td>
                                : ele.type === "amount" && ele.currencyField !== undefined?
                                    <td>{ele.value ? dependencies.convertAmount(fetchValue(props.data, ele.value), fetchValue(props.data, ele.currencyField)) : "Not Specified"}</td>
                                : ele.type === "date"?
                                    <td>{ele.value && fetchValue(props.data, ele.value) != "-" ? dependencies.custom_date_format(fetchValue(props.data, ele.value)) : "-"}</td>
                                : ele.type === "boolean"?
                                    <td>{ele.value ? dependencies.boolName(fetchValue(props.data, ele.value).trim()) : "-"}</td>
                                : ele.type === "status"?
                                    <td>{ele.value ? dependencies.statusName(fetchValue(props.data, ele.value).trim()) : "-"}</td>
                                : ele.type === "array_length"?
                                    <td>{ele.value ? fetchValue(props.data, ele.value).trim().split(",").length : "-"}</td>
                                : ele.type === "array"?
                                    renderArrayType(ele, props.data)
                                :  ele.type === "bill"?
                                    renderBill(ele, props.data)
                                : ele.type === "product_bill"?
                                    renderProduct_bill(ele, props.data)
                                : 
                                    <td>{fetchValue(props.data, ele.value) ? fetchValue(props.data, ele.value) : "-"}</td>
                                }
                            </tr>
                        :
                            null
                    )
                })}
            </>
        )
    }
}

export default ShowDataType