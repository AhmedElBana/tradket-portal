import React, { useState } from 'react';
import { Alert, Row, Col } from 'reactstrap';
import useScanDetection from 'use-scan-detection';
import {httpClient} from './../../../tools/HttpClient';
import { auth } from '../../../tools/Auth';
import Waiting from "./../../../views/Waiting/waiting";
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';

import successImg from "./../../../assets/img/success.png"
import './OrderNew.scss'
import { dependencies } from '../../../tools/Dependencies';

let requiredError = "هذا الحقل إجباري."
const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {requiredError}
            </Alert>
          </div>;
  }
};
let NumberError = "ادخل رقم صحيح."
const NumberV = (value) => {
  // var patt = new RegExp("^(01)([0-9]*)$");
  if (isNaN(value) || value <= 0) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {NumberError}
            </Alert>
          </div>;
  }
}
let phoneNameError = "يرجي ادخال رقم هاتف صحيح."
const phoneNumber = (value) => {
  var patt = new RegExp("^(01)([0-9]*)$");
  if (isNaN(value) || value.toString().trim().length !== 11 || !patt.test(value)) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {phoneNameError}
            </Alert>
          </div>;
  }
}
const OrderNew = () => {
    const [status, setStatus] = useStateWithCallbackLazy("");
    const [error, setError] = useStateWithCallbackLazy("");
    const [waiting, setWaiting] = useStateWithCallbackLazy(false);
    const [products, setProducts] = useStateWithCallbackLazy({});
    const [customer, setCustomer] = useStateWithCallbackLazy({"name": "", "phone": ""});
    const [method, setMethod] = useStateWithCallbackLazy("cash");
    const [payed, setPayed] = useStateWithCallbackLazy(0);
    const [payedChange, setpayedChange] = useStateWithCallbackLazy(false);
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    fixNumbers = function (str)
    {
      if(typeof str === 'string')
      {
        for(var i=0; i<10; i++)
        {
          str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
      }
      return str;
    };
    useScanDetection({
        onComplete: (code) => {onCompleteScan(code)},
        minLength: 6 // EAN13
    });
    const onCompleteScan = (code) => {
        code = fixNumbers(code);
        let new_products = {...products}
        if(new_products[code]){
            new_products[code]["quantity"] += 1;
            setProducts({...new_products})
        }else{
            new_products[code] = {
                "quantity": 1,
                "waiting": true,
                "registered": true,
                "error": false,
                "data": {}
            };
            setProducts({...new_products}, () => {
                loadProduct(code)
            })
        }
    }
    const onRemove = (code) => {
        if(products[code]){
            let new_products = {...products}
            delete new_products[code];
            setProducts({...new_products})
        }
    }
    const onInc = (e, code) => {
        e.preventDefault();
        if(products[code]){
            let new_products = {...products}
            new_products[code]["quantity"] += 1;
            setProducts({...new_products})
        }
    }
    const onDec = (e, code) => {
        e.preventDefault();
        if(products[code] && products[code]["quantity"] > 1){
            let new_products = {...products}
            new_products[code]["quantity"] -= 1;
            setProducts({...new_products})
        }
    }
    const handlePriceChange = (e, code) => {
        if(products[code]){
            let new_products = {...products}
            new_products[code]["data"]["price"] = fixNumbers(e.target.value);
            setProducts({...new_products})
        }
    }
    const handleNameChange = (e, code) => {
        if(products[code]){
            let new_products = {...products}
            new_products[code]["data"]["name"] = e.target.value;
            setProducts({...new_products})
        }
    }
    const handleCustomerChange = (e, field) => {
        let new_customer = {...customer}
        new_customer[field] = fixNumbers(e.target.value);
        setCustomer({...new_customer})
    }
    const handleMethodChange = (e) => {
        setMethod(e.target.value)
    }
    const handlePayedChange = (e) => {
        let payedValue = fixNumbers(e.target.value);
        if(payedChange){
            setPayed(payedValue)
        }else{
            setpayedChange(true, ()=>{
                setPayed(payedValue)
            })
        }
    }
    const loadProduct = (product_id) => {
        //request data
        let config = {
            headers: {
            "Content-Type": "application/json",
            "x-auth": auth.getMerchantToken()
            },
            params:{
                "_id": product_id
            }
        }
        httpClient.get(
            "/api/product/list",
            config,
            (resp) => {
                let new_products = {...products};
                if(resp.data && resp.data.data && resp.data.data.result && resp.data.data.result[0]){
                    new_products[product_id]= {
                        "quantity": 1,
                        "waiting": false,
                        "registered": true,
                        "error": false,
                        "data": {...resp.data.data.result[0]}
                    }
                }else{
                    new_products[product_id]= {
                        "quantity": 1,
                        "waiting": false,
                        "registered": false,
                        "error": false,
                        "data": {
                            "name": "",
                            "price": ""
                        }
                    }
                }
                setProducts({...new_products})
            },
            (error) => {
                let new_products = {...products};
                new_products[product_id]= {
                    "quantity": 1,
                    "waiting": false,
                    "registered": false,
                    "error": true,
                    "data": {}
                }
                setProducts({...new_products})
            }
        )
    }
    const handleNewOrderSubmit = (e) => {
        e.preventDefault();
        setWaiting(true, () => {
            let products_arr = [];
            let new_products_arr = [];
            Object.keys(products).map((product_id) => {
                if(products[product_id].registered){
                    products_arr.push({
                        "product_id": product_id, 
                        "quantity": Number(products[product_id].quantity), 
                        "final_price": Number(products[product_id].data.price)
                    })
                }else{
                    new_products_arr.push({
                        "_id": product_id,
                        "name": products[product_id].data.name,
                        "quantity": Number(products[product_id].quantity),
                        "price": Number(products[product_id].data.price)
                    })
                }
            })
            let orderObj = {
                "customerName": customer.name,
                "customerPhone": customer.phone,
                "payed": payed,
                "method": method,
                "promo": "false",
                "branch_id": dependencies.getUserData().branches[0]
            };
            if(products_arr.length > 0){
                orderObj["products"] = products_arr;
            }
            if(new_products_arr.length > 0){
                orderObj["new_products"] = new_products_arr;
            }
            let orderData = JSON.stringify(orderObj);
            let config = {
                headers: {
                //"Cache-Control": "no-cache",
                "Content-Type": "application/json",
                "x-auth": auth.getMerchantToken()
                }
            }
            httpClient.post(
                "/api/order/create",
                config,
                orderData,
                (resp) => {
                    setStatus("success");
                    setWaiting(false);
                    setTimeout(() => { window.location.reload() }, 2000)
                },
                (error) => {
                    let errorMessage = "";
                    if(error.response){
                        if(error.response.status === 401){
                            //this.setState({logout: true});
                            errorMessage = "قم بتسجيل الخروج و اعادة الدخول مرة اخري.";
                        }else if(error.response.status === 400){
                            errorMessage = error.response.data.message;
                        }else{
                            errorMessage = "حدث خطا ما ، يرجي المحاوله في وقت لاحق.";
                        }
                    }else{
                        errorMessage = "حدث خطا ما ، يرجي المحاوله في وقت لاحق.";
                    }
                    setStatus("error");
                    setError(errorMessage);
                    setWaiting(false);
                }
            )
        })
    }
    let order_total = 0;
    Object.keys(products).map((product_id) => {
        order_total += Number(products[product_id].data.price) * Number(products[product_id].quantity)
    })
    if(order_total && order_total != payed && !payedChange){setPayed(order_total)}
    return (
        <div autoFocus={true}>
            <p className="new_order_h">طلب جديد</p>
            {waiting ? 
                <div className="new_order_wating_div">
                    <Waiting height="100px" />
                </div>
            :status == "success" ? 
                <div className="new_order_succes_div">
                    <img src={successImg} alt="succes"/>
                    <p>تم إنشاء الطلب بنجاح</p>
                </div>
            :status == "error" ? 
            <div className="new_order_succes_div">
                <Alert color="danger">{error}</Alert>
            </div>
        :
                <VForm onSubmit={handleNewOrderSubmit}>
                    <div className="products_full_div">
                        {Object.keys(products).map((product_id) => {
                            return (
                                <div className="product_div" key={product_id}>
                                    {products[product_id].waiting ?
                                        <Waiting height="100px" width="50px" />
                                    :
                                        <div>
                                            <i className="fa fa-times remove_btn" onClick={() => {onRemove(product_id)}} />
                                            {products[product_id].error ?
                                                <div>
                                                    <p><span>رقم المنتج : </span>{product_id}</p>
                                                    <Alert color="danger">حدث خطا ما ، يرجي المحاوله في وقت لاحق.</Alert>
                                                </div>
                                            :
                                                !products[product_id].registered ?
                                                    <div>
                                                        <p><span>رقم المنتج : </span>{product_id}</p>
                                                        <p>
                                                            <span>اسم المنتج : </span>
                                                            <div className="tradketInputGroup product_price_div">
                                                                <VInput type="text" className="tradket_b_i "
                                                                    autoComplete="off"
                                                                    name="name"
                                                                    value={products[product_id].data.name}
                                                                    onChange={(e) => handleNameChange(e, product_id)}
                                                                    validations={[required]}
                                                                    placeholder="اسم المنتج"
                                                                />
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <span>السعر : </span>
                                                            <div className="tradketInputGroup product_price_div">
                                                                <VInput type="text" className="tradket_b_i "
                                                                    autoComplete="off"
                                                                    name="price"
                                                                    value={products[product_id].data.price}
                                                                    onChange={(e) => handlePriceChange(e, product_id)}
                                                                    validations={[required, NumberV]}
                                                                    placeholder="السعر"
                                                                />
                                                            </div>
                                                        </p>
                                                        <p><span>الكمية : </span><button className="quantity_btn" onClick={(e)=>{onDec(e, product_id)}}><i className="fa fa-minus"/></button> <input className="quantity_input" value={products[product_id].quantity} disabled={true} /> <button className="quantity_btn" onClick={(e)=>{onInc(e, product_id)}}><i className="fa fa-plus" /></button></p>
                                                    </div>
                                                :
                                                    <div>
                                                        <p><span>رقم المنتج : </span>{products[product_id].data._id}</p>
                                                        <p><span>اسم المنتج : </span>{products[product_id].data.name}</p>
                                                        <p>
                                                            <span>السعر : </span>
                                                            <div className="tradketInputGroup product_price_div">
                                                                <VInput type="text" className="tradket_b_i "
                                                                    autoComplete="off"
                                                                    name="price"
                                                                    value={products[product_id].data.price}
                                                                    onChange={(e) => handlePriceChange(e, product_id)}
                                                                    validations={[required, NumberV]}
                                                                    placeholder="السعر"
                                                                />
                                                            </div>
                                                        </p>
                                                        <p><span>الكمية : </span><button className="quantity_btn" onClick={(e)=>{onDec(e, product_id)}}><i className="fa fa-minus"/></button> <input className="quantity_input" value={products[product_id].quantity} disabled={true} /> <button className="quantity_btn" onClick={(e)=>{onInc(e, product_id)}}><i className="fa fa-plus" /></button></p>
                                                    </div>
                                            }
                                        </div>
                                    }
                                </div>
                            )
                        })}
                        {Object.keys(products).length != 0 &&
                            <div className="new_order_total_div">
                                <div className="new_order_customer">
                                    <Row>
                                        <Col sm="4" className="inputeDiv">
                                            <div className="tradketInputGroup full_width">
                                                <VInput type="text" className="tradket_b_i "
                                                    autoComplete="off"
                                                    name="customer_name"
                                                    value={customer.name}
                                                    onChange={(e) => handleCustomerChange(e, "name")}
                                                    validations={[required]}
                                                    placeholder="اسم العميل"
                                                />
                                            </div>
                                        </Col>
                                        <Col sm="4" className="inputeDiv">
                                            <div className="tradketInputGroup full_width">
                                                <VInput type="text" className="tradket_b_i "
                                                    autoComplete="off"
                                                    name="customer_phone"
                                                    value={customer.phone}
                                                    onChange={(e) => handleCustomerChange(e, "phone")}
                                                    validations={[required, phoneNumber]}
                                                    placeholder="رقم الهاتف"
                                                />
                                            </div>
                                        </Col>
                                        <Col sm="4" className="inputeDiv">
                                            <div className="tradketInputGroup full_width">
                                                <VSelect type="select" name="type" className="tradket_b_s"
                                                    value={method}
                                                    onChange={(e) => handleMethodChange(e)}
                                                    validations={[required]} 
                                                >
                                                    <option value="cash">كاش</option>
                                                    <option value="card">بطاقة بنكية</option>
                                                </VSelect>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <Row>
                                    <Col sm="4" className="inputeDiv">
                                        <p className="input_label">المدفوع</p>
                                        <div className="tradketInputGroup full_width">
                                            <VInput type="text" className="tradket_b_i "
                                                autoComplete="off"
                                                name="payed"
                                                value={payed}
                                                onChange={(e) => handlePayedChange(e)}
                                                validations={[required, NumberV]}
                                                placeholder="المدفوع"
                                            />
                                        </div>
                                    </Col>
                                    <Col sm="4">
                                        <p className="total_p"><span>الاجمالي : </span> {order_total ? order_total : " - "} </p>
                                    </Col>
                                </Row>
                            </div>
                        }
                    </div>
                    <div className="new_order_footer">
                        {Object.keys(products).length == 0 ?
                            // <button className="btn btn-info" disabled={true}>إكمال الطلب</button>
                            null
                        :
                            <VButton className="btn btn-info">إكمال الطلب</VButton>
                        }
                    </div>
                </VForm>
            }
        </div>
    );
};
 
export default OrderNew