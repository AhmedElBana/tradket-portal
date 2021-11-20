import React, { Component } from 'react';
import {httpClient} from './../../../tools/HttpClient';
import {dependencies} from '../../../tools/Dependencies';
import './Bill.scss';
import Waiting from "./../../../views/Waiting/waiting";
import Logo from "./../../../assets/img/brand/logo.png";
import QRCode from "react-qr-code";

class Bill extends Component {
  constructor(props){
    super(props);
    this.state = {
        //order
        waiting: true,
        order: {},
        //public
        publicError: false,
        logout: false,
    };
  }
  componentDidMount(){
    this.requestOrders()
  }
  requestOrders (){
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        "_id": this.props.match.params.id
      }
    }
    httpClient.get(
        "/api/order/bill",
        config,
        (resp) => {
          this.setState({
            waiting: false,
            order: resp.data.data
          })
        },
        (error) => {
          this.setState({publicError: true});
        }
    )
  }
  render() {
    return (
      <div className="bill-page">
        <div className="bill-head">
          <img src={Logo} />
        </div>
        <div class="invoice-box">
          {this.state.publicError ?
            <div className="alert alert-danger">
              Please check your internet connection and try again later.
            </div>
          :
            <>
              {this.state.waiting ?
                <Waiting height="400px" />
              :
                <>
                  <table cellpadding="0" cellspacing="0">
                    <tr class="information">
                      <td colspan="2">
                        <table>
                          <tr>
                            <td>
                              <b>Type:</b> {this.state.order.type}<br />
                              <b>Status:</b> {this.state.order.canceled ? "Canceled" : this.state.order.returned ? "Returned" : "Complate"}<br />
                              <b>Date:</b> {dependencies.custom_date_format(this.state.order.createdDate)}<br />
                              <b>ID:</b> {this.state.order._id}<br />
                            </td>

                            <td>
                              <b>Customer:</b> {this.state.order.customer.name}<br />
                              <b>Phone:</b> {this.state.order.customer.phoneNumber}<br />
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    {this.state.order.type == "Return" &&
                      <>
                        <tr class="heading">
                          <td>Previous Order</td><td></td>
                        </tr>
                        <tr class="item">
                          <td>Previous Order Total</td>
                          <td><b>{this.state.order.prevOrderTotal} EGP</b></td>
                        </tr>
                        {this.state.order.amount_in != 0 &&
                          <tr class="item">
                            <td>Additional Pay</td>
                            <td><b>{this.state.order.amount_in} EGP</b></td>
                          </tr>
                        }
                        {this.state.order.amount_out != 0 &&
                          <tr class="item">
                            <td>Returned Amount</td>
                            <td><b>{this.state.order.amount_out} EGP</b></td>
                          </tr>
                        }
                        <tr class="heading">
                          <td>New Order</td><td></td>
                        </tr>
                      </>
                    }

                    <tr class="heading">
                      <td>Item</td>

                      <td>Price</td>
                    </tr>
                    {this.state.order.bill.map((product) => {
                      return(
                        <tr class="item">
                          <td>{product.name}</td>
                          <td>{product.price} * {product.quantity} = {product.total}</td>
                        </tr>
                      )
                    })}
                    <tr class="total">
                      <td></td>
                      <td>
                        Sub Total: {this.state.order.subTotal}<br/>
                      </td>
                    </tr>
                    <tr class="total">
                      <td></td>

                      <td>
                        Discount: {this.state.order.discountValue}<br/>
                      </td>
                    </tr>
                    <tr class="total">
                      <td></td>

                      <td>
                        Total: {this.state.order.total} EGP
                      </td>
                    </tr>
                  </table>
                  <div className="qrcode">
                    <QRCode value={this.state.order._id} />
                  </div>
                </>
              }
            </>
          }
        </div>
      </div>
    );
  }
}

export default Bill;
