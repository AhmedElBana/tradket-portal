import React, { useState } from 'react';
import useScanDetection from 'use-scan-detection';
import {httpClient} from './../../../tools/HttpClient';
import { auth } from '../../../tools/Auth';
import Waiting from "./../../../views/Waiting/waiting";
import { useStateWithCallbackLazy } from 'use-state-with-callback';

import './OrderNew.scss'
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
    const onInc = (code) => {
        if(products[code]){
            let new_products = {...products}
            new_products[code]["quantity"] += 1;
            setProducts({...new_products})
        }
    }
    const onDec = (code) => {
        if(products[code] && products[code]["quantity"] > 1){
            let new_products = {...products}
            new_products[code]["quantity"] -= 1;
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
                        "error": false,
                        "data": {...resp.data.data.result[0]}
                    }
                }else{
                    new_products[product_id]["waiting"] = false;
                    new_products[product_id]["error"] = true;
                }
                setProducts({...new_products})
            },
            (error) => {
                let new_products = {...products};
                new_products[product_id]= {
                    "quantity": 1,
                    "waiting": false,
                    "error": true,
                    "data": {}
                }
                setProducts({...new_products})
            }
        )
    }
    return (
        <div>
            <h1>you can scan now</h1>
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
                                        <h3>هذا المنتج غير مسجل</h3>
                                    </div>
                                :
                                    <div>
                                        <p><span>رقم المنتج : </span>{products[product_id].data._id}</p>
                                        <p><span>اسم المنتج : </span>{products[product_id].data.name}</p>
                                        <p><span>السعر : </span>{products[product_id].data.price}</p>
                                        <p><span>الكمية : </span><button className="quantity_btn" onClick={()=>{onDec(product_id)}}><i className="fa fa-minus"/></button> <input className="quantity_input" value={products[product_id].quantity} disabled={true} /> <button className="quantity_btn" onClick={()=>{onInc(product_id)}}><i className="fa fa-plus" /></button></p>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                )
            })}

        </div>
    );
};
 
export default OrderNew