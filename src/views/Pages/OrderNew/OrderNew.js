import React, { useState } from 'react';
import { Alert } from 'reactstrap';
import useScanDetection from 'use-scan-detection';
import {httpClient} from './../../../tools/HttpClient';
import { auth } from '../../../tools/Auth';
import Waiting from "./../../../views/Waiting/waiting";
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VButton from 'react-validation/build/button';

import './OrderNew.scss'

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
const OrderNew = () => {
    const [products, setProducts] = useStateWithCallbackLazy({});

    useScanDetection({
        onComplete: (code) => {onCompleteScan(code)},
        minLength: 6 // EAN13
    });
    
    const onCompleteScan = (code) => {
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
            new_products[code]["data"]["price"] = e.target.value;
            setProducts({...new_products})
        }
    }
    const loadProduct = (product_id) => {
        console.log(products)
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
                console.log(new_products)
                if(resp.data && resp.data.data && resp.data.data.result && resp.data.data.result[0]){
                    console.log(new_products[product_id])
                    // new_products[product_id]["waiting"] = false;
                    // new_products[product_id]["data"] = resp.data.data.result[0];
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
    return (
        <div>
            <p className="new_order_h">طلب جديد</p>
            <VForm>
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
                                                                // onChange={(e) => handlePriceChange(e, product_id)}
                                                                // validations={[required, NumberV]}
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
                </div>
                <div className="new_order_footer">
                    {Object.keys(products).length == 0 ?
                        <button className="btn btn-info" disabled={true}>إكمال الطلب</button>
                    :
                        <VButton className="btn btn-info">إكمال الطلب</VButton>
                    }
                </div>
            </VForm>
        </div>
    );
};
 
export default OrderNew