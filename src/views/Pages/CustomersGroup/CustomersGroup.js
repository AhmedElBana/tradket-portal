import React, { Component } from 'react';
import { Alert, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import Files from 'react-files'
import fontkit from '@pdf-lib/fontkit';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Input from 'muicss/lib/react/input';
import {httpClient} from './../../../tools/HttpClient';
import VForm from 'react-validation/build/form';
import VInput from 'react-validation/build/input';
import VSelect from 'react-validation/build/select';
import VButton from 'react-validation/build/button';
import successImg from "./../../../assets/img/success.png";
import validator from 'validator';
import "./CustomersGroup.scss";
import Waiting from "./../../../views/Waiting/waiting";
import { auth } from '../../../tools/Auth';
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
let phoneNameError = "يرجي ادخال رقم هاتف صحيح."
const phoneNumber = (value) => {
  // var patt = new RegExp("^(01)([0-9]*)$");
  if (isNaN(value) || value.toString().trim().length <= 4) {
    return <div className="simple-alert">
            <i className="fa fa-exclamation-circle"></i>
            <Alert color="danger">
              {phoneNameError}
            </Alert>
          </div>;
  }
}

const perms = JSON.parse(localStorage.userData).permissions;

class CustomersGroup extends Component {
  constructor(props){
    super(props);
    this.state = {
      //add modal
      addPath: "/api/customerGroup/add",
      addModalWaiting: false,
      addModal: false,
      addModalError: false,
      addModalFaildMessage: "",
      addModalSuccess: false,
      branches: [],
      addForm: {
        customer_id: ""
      },
      // remove customer
      removePath: "/api/customerGroup/remove",
      removeModalWaiting: false,
      removeModal: false,
      removeModalError: false,
      removeModalFaildMessage: "",
      removeModalSuccess: false,
      removeForm: {
        selected_customer: {}
      },
      // print pdf
      printModalWaiting: false,
      printModal: false,
      printModalError: false,
      printModalFaildMessage: "",
      printModalSuccess: false,
      printFile: null,
      water_mark_color: "#000000",
      water_mark_opacity: 0.5,
      water_mark_direction: "vertical",
      // public
      waiting: true,
      data: {},
      publicError: false
    }; 
  }
  componentDidMount(){
    this.load_data();
  }
  load_data = () => {
    //request data
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth": auth.getMerchantToken()
      },
      params: {
        "group_id": this.props.match.params.id
      }
    }
    httpClient.get(
        "/api/customerGroup/customers",
        config,
        (resp) => {
          this.setState({waiting: false, data: resp.data.data});
        },
        (error) => {
          if(error.response){
            if(error.response.status === 401){
              this.setState({logout: true});
            }else{
              this.setState({publicError: true});
            }
          }else{
            this.setState({publicError: true});
          }
        }
    )
  }
  //add modal
  toggleAddModal = (e) => {
    e.preventDefault();
    let addFormData = this.state.addForm;
    addFormData.customer_id= "";
    this.setState({
      addModal: !this.state.addModal,
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  handleAddInputChange = (inputName,value) => {
    let addFormData = this.state.addForm;
    addFormData[inputName] = value.value;
    this.setState({addForm: addFormData})
  }
  handleAddSubmit = (event) => {
    //get form data
    let userObj = {
      "group_id": this.props.match.params.id,
      "customer_id": this.state.addForm.customer_id
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({addModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.addPath,
          config,
          userData,
          (resp) => {
            this.setState({addModalSuccess: true ,addModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
            });
          },
          (error) => {
            if(error.response){
              if(error.response.status === 401){
                this.setState({logout: true});
              }else if(error.response.status === 400){
                this.setState({addModalWaiting: false, addModalError: true, addModalFaildMessage: error.response.data.message});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
    });
    event.preventDefault();
  }
  addModalReset = (e) => {
    e.preventDefault();
    let addFormData= this.state.addForm;
    this.setState({
      addForm: addFormData,
      addModalWaiting: false, 
      addModalSuccess: false, 
      addModalError: false, 
      addModalFaildMessage: ""
    });
  }
  loadOptions = (inputValue) =>
    new Promise((resolve) => {
      //request data
      let config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        },
        params: {
          "phoneNumber": inputValue
        }
      }
      httpClient.get(
          "/api/customer/list",
          config,
          (resp) => {
            if(resp.data.data && resp.data.data.result){
              let final_arr = [];
              resp.data.data.result.map((ele) => {
                final_arr.push({ value: ele._id, label: `${ele.name} - ${ele.phoneNumber}` })
              })
              resolve(final_arr);
            }else{
              resolve([]);
            }
          },
          (error) => {
            if(error.response){
              if(error.response.status === 401){
                this.setState({logout: true});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
  });
  renderAddModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.addModal} toggle={this.toggleAddModal}>
        <VForm onSubmit={this.handleAddSubmit} >
          <ModalHeader toggle={this.toggleAddModal}>
            عميل جديد
          </ModalHeader>
          <ModalBody>
          {this.state.addModalError?
              <div>
                <Alert color="danger">
                  {this.state.addModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.addModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم إضافة العميل بنجاح.</p>
                </div>
              :
                <div >
                {this.state.addModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    <Row>
                      <Col sm="12" className="inputeDiv">
                        <div className="tradketInputGroup full_width">
                          <AsyncSelect 
                            placeholder="بحث برقم الهاتف"
                            loadOptions={this.loadOptions} 
                            onChange={this.handleChange}
                            onChange={(value) => this.handleAddInputChange("customer_id", value)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          {this.state.addModalSuccess || this.state.addModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.addModalSuccess || this.state.addModalWaiting || this.state.addModalError?
                null
              : 
                this.state.addForm.customer_id != "" ? <VButton className="btn btn-info">إضافة</VButton> : null
              }
              {this.state.addModalError?
                <button className="accept-btn btn btn-default" onClick={this.addModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleAddModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //remove modal
  toggleRemoveModal = (e, new_customer) => {
    e.preventDefault();
    let removeFormData = this.state.removeForm;
    if(new_customer){
      removeFormData.selected_customer= {...new_customer}
    }else{
      removeFormData.selected_customer= {}
    }
    this.setState({
      removeModal: !this.state.removeModal,
      removeForm: removeFormData,
      removeModalWaiting: false, 
      removeModalSuccess: false, 
      removeModalError: false, 
      removeModalFaildMessage: ""
    });
  }
  handleRemoveSubmit = (event) => {
    //get form data
    let userObj = {
      "group_id": this.props.match.params.id,
      "customer_id": this.state.removeForm.selected_customer._id
    };
    let userData = JSON.stringify(userObj);
    //start waiting
    this.setState({removeModalWaiting: true},()=>{
      //send request
      let config = {
        headers: {
          //"Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "x-auth": auth.getMerchantToken()
        }
      }
      httpClient.post(
          this.state.removePath,
          config,
          userData,
          (resp) => {
            this.setState({removeModalSuccess: true ,removeModalWaiting:false},()=>{
              setTimeout(()=>{
                window.location.reload();
              }, 3000);
            });
          },
          (error) => {
            if(error.response){
              if(error.response.status === 401){
                this.setState({logout: true});
              }else if(error.response.status === 400){
                this.setState({removeModalWaiting: false, removeModalError: true, removeModalFaildMessage: error.response.data.message});
              }else{
                this.setState({publicError: true});
              }
            }else{
              this.setState({publicError: true});
            }
          }
      )
    });
    event.preventDefault();
  }
  removeModalReset = (e) => {
    e.preventDefault();
    let removeFormData= this.state.removeForm;
    removeFormData.selected_customer = {}
    this.setState({
      removeForm: removeFormData,
      removeModalWaiting: false, 
      removeModalSuccess: false, 
      removeModalError: false, 
      removeModalFaildMessage: ""
    });
  }
  renderRemoveModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.removeModal} toggle={this.toggleRemoveModal}>
        <VForm onSubmit={this.handleRemoveSubmit} >
          <ModalHeader toggle={this.toggleRemoveModal}>
            حذف عميل من المجموعة
          </ModalHeader>
          <ModalBody>
          {this.state.removeModalError?
              <div>
                <Alert color="danger">
                  {this.state.removeModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.removeModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم حذف العميل بنجاح.</p>
                </div>
              :
                <div >
                {this.state.removeModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    هل انت متاكد من حذف العميل ( {this.state.removeForm.selected_customer.name} - {this.state.removeForm.selected_customer.phoneNumber} )
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          {this.state.removeModalSuccess || this.state.removeModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.removeModalSuccess || this.state.removeModalWaiting || this.state.removeModalError?
                null
              : 
                <VButton className="btn btn-info">حذف</VButton>
              }
              {this.state.removeModalError?
                <button className="accept-btn btn btn-default" onClick={this.removeModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.toggleRemoveModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  //print modal
  togglePrintModal = (e, new_customer) => {
    if(e){e.preventDefault();}
    this.setState({
      printModal: !this.state.printModal,
      printFile: null,
      printModalWaiting: false, 
      printModalSuccess: false, 
      printModalError: false, 
      printModalFaildMessage: ""
    });
  }
  hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
  }
  set_number_for_sort = (arr, property) => {
    let final_arr = [];
    var regex = /\D/g;
    arr.map((ele) => {
      let first_non_num_position = ele[property].search(regex)
      let final_num = 0;
      if(ele[property].slice(0, first_non_num_position) && Number(ele[property].slice(0, first_non_num_position))){
        final_num = Number(ele[property].slice(0, first_non_num_position));
      }
      final_arr.push({...ele, temp_sort_field: final_num})
    });
    return final_arr;
  }
  handlePrintSubmit = (event) => {
    event.preventDefault();
    //start waiting
    this.setState({printModalWaiting: true},()=>{
      this.state.printFile.arrayBuffer()
      .then(async arrayBuffer => {

          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pages = pdfDoc.getPages();
          const pdfDocNew = await PDFDocument.create();
          
          // Embed the Helvetica font
          let HelveticaFont = await pdfDocNew.embedFont(StandardFonts.Helvetica);
          //Get the first page of the document

          let sorted_arr = [...this.state.data];
          try{
            let with_position = this.set_number_for_sort(sorted_arr, "name");
            with_position.sort(function(a, b) {
              return a.temp_sort_field - b.temp_sort_field;
            });
            sorted_arr = [...with_position]
          }catch(err){

          }

          Promise.all(sorted_arr.map(async (customer) => {
            await Promise.all(pages.map(async (page, index) => {
              const [pdfDocPage] = await pdfDocNew.copyPages(pdfDoc, [index])
              pdfDocNew.insertPage(index, pdfDocPage)
  
              // Get the width and height of the first page
              const { width, height } = pdfDocPage.getSize();
              // Draw a string of text diagonally across the first page
              let x_space;
              let y_space;
              let rotate_degrees;
              let font_size = 70;
              if(this.state.water_mark_direction == "vertical"){
                x_space = (width / 2) - 150;
                y_space = (height / 2) + 200;
                rotate_degrees = -45;
              }else{
                x_space = (width / 2) + 150;
                y_space = (height / 2) - 200;
                rotate_degrees = -225;
              }
              try{
                if(customer.name.length >= 15 && customer.name.length < 17){
                  font_size = 60;
                }else if(customer.name.length >= 17 && customer.name.length < 20){
                  font_size = 50;
                }else if(customer.name.length >= 20){
                  font_size = 40;
                }
              }catch(err){}
              try {
                pdfDocPage.drawText(`${customer.name} \n ${customer.phoneNumber}`, {
                  x: x_space,
                  y: y_space,
                  size: font_size,
                  font: HelveticaFont,
                  color: rgb(this.hexToRgb(this.state.water_mark_color).r, this.hexToRgb(this.state.water_mark_color).g, this.hexToRgb(this.state.water_mark_color).b),
                  lineHeight: 70,
                  textAlign: 'left',
                  opacity: this.state.water_mark_opacity,
                  rotate: degrees(rotate_degrees),
                })
              }
              catch(err) {
                pdfDocPage.drawText(`${customer.phoneNumber}`, {
                  x: x_space,
                  y: y_space,
                  size: font_size,
                  font: HelveticaFont,
                  color: rgb(this.hexToRgb(this.state.water_mark_color).r, this.hexToRgb(this.state.water_mark_color).g, this.hexToRgb(this.state.water_mark_color).b),
                  lineHeight: 70,
                  textAlign: 'left',
                  opacity: this.state.water_mark_opacity,
                  rotate: degrees(rotate_degrees),
                })
              }
            }))
          })).then(async() => {
            const pdfBytes = await pdfDocNew.save()
            var blob = new Blob([pdfBytes], {type: "application/pdf"});
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            var fileName = "test file";
            link.download = fileName;
            link.click();
            this.togglePrintModal();
          })     
      });
    })
  }
  printModalReset = (e) => {
    e.preventDefault();
    this.setState({
      printFile: null,
      printModalWaiting: false, 
      printModalSuccess: false, 
      printModalError: false, 
      printModalFaildMessage: ""
    });
  }
  onFilesChange = (files) => {
    this.setState({printFile: files[0]})
  }
  onFilesError = (error, file) => {
    this.setState({printModalError: true, printModalFaildMessage: "حذث خطأ اثناء رفع الملف."})
  }
  handle_water_mark_color_change = (e) => {
    this.setState({water_mark_color: e.target.value});
  }
  handle_water_mark_opacity_change = (e) => {
    this.setState({water_mark_opacity: Number(e.target.value)});
  }
  handle_water_mark_direction_change = (e) => {
    this.setState({water_mark_direction: e.target.value});
  }
  renderPrintModal(){
    return(
      <Modal className="usersModal" isOpen={this.state.printModal} toggle={this.togglePrintModal}>
        <VForm onSubmit={this.handlePrintSubmit} >
          <ModalHeader toggle={this.togglePrintModal}>
            طباعة ملف 
          </ModalHeader>
          <ModalBody>
          {this.state.printModalError?
              <div>
                <Alert color="danger">
                  {this.state.printModalFaildMessage}
                </Alert>
              </div>
          :
            <div >
              {this.state.printModalSuccess?
                <div className="staffSuccesDiv">
                  <img src={successImg} alt="succes"/>
                  {/* <h1>Congratulations</h1> */}
                  <p>تم طباعة ملف بنجاح.</p>
                </div>
              :
                <div >
                {this.state.printModalWaiting?
                  <Waiting height="250px" />
                :
                  <div className="addModalBody">
                    <br/>
                    <div className="files">
                      {this.state.printFile ?
                        <p>{this.state.printFile.name}</p>
                      :
                        <Files
                          className='files-dropzone'
                          onChange={this.onFilesChange}
                          onError={this.onFilesError}
                          accepts={['.pdf']}
                          multiple
                          maxFileSize={10000000}
                          minFileSize={0}
                          clickable
                        >
                          اسحب الملف هنا او اضغط للرفع
                        </Files>
                      }
                      <div className="water_mark_custom_div">
                        <div className="custom_print_input">
                          <label>لون العلامة المائيه : </label>
                          <input type="color" name="favcolor" 
                            value={this.state.water_mark_color}
                            onChange={this.handle_water_mark_color_change}
                          />
                        </div>
                        <div className="custom_print_input">
                          <label>درجة الوضوح : </label>
                          <select type="color" name="favcolor" 
                            value={this.state.water_mark_opacity}
                            onChange={this.handle_water_mark_opacity_change}
                          >
                            <option value="0.1">0.1</option>
                            <option value="0.2">0.2</option>
                            <option value="0.3">0.3</option>
                            <option value="0.4">0.4</option>
                            <option value="0.5">0.5</option>
                            <option value="0.6">0.6</option>
                            <option value="0.7">0.7</option>
                            <option value="0.8">0.8</option>
                            <option value="0.9">0.9</option>
                            <option value="1">1</option>
                          </select>
                        </div>
                        <div className="custom_print_input">
                          <label>عرض الملف : </label>
                          <select type="color" name="favcolor" 
                            value={this.state.water_mark_direction}
                            onChange={this.handle_water_mark_direction_change}
                          >
                            <option value="vertical">طولي</option>
                            <option value="horizontal">افقي</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                </div>
              }
            </div>
          }
          </ModalBody>
          {this.state.printModalSuccess || this.state.printModalWaiting?
            null
          : 
            <ModalFooter>
              {this.state.printModalSuccess || this.state.printModalWaiting || this.state.printModalError?
                null
              : 
                this.state.printFile ? <VButton className="btn btn-info">طباعة</VButton> : null
              }
              {this.state.printModalError?
                <button className="accept-btn btn btn-default" onClick={this.printModalReset}>حاول مرة اخري</button>
              :
                null
              }
              <button className="accept-btn btn btn-default" onClick={this.togglePrintModal}>إلغاء</button>
            </ModalFooter>
          }
        </VForm>
      </Modal>
    )
  }  
  renderBody(){
    return(
      <div className="CustomersGroup-page">
        <div>
          <Row>
            <div className="x_panel">
              <div className="x_title">
                <h2>تفاصيل المجموعة</h2>
                <div className="ButtonsDiv">
                  {JSON.parse(localStorage.userData).permissions.includes("145") &&
                    <button onClick={this.toggleAddModal} type="button" className="btn">
                      إضافة عميل للمجموعة
                    </button>
                  }
                  {this.renderAddModal()}
                  {(JSON.parse(localStorage.userData).permissions.includes("145") && !this.state.waiting ) &&
                    <button onClick={this.togglePrintModal} type="button" className="btn">
                      طباعة ملف
                    </button>
                  }
                  {this.renderPrintModal()}
                </div>  
              </div>
              <div className="x_content">
                {this.state.waiting?
                  <Waiting height="605px" />
                : 
                  <div className="">
                    {this.renderRemoveModal()}
                    {this.state.data.map((customer) => {
                      return (
                        <div className="customer_block">
                          <span className="remove_customer" onClick={(e) => {this.toggleRemoveModal(e, customer)}}>
                            <i className="fa fa-window-close" />
                          </span>
                          <p><span>رقم العميل :</span>{customer._id}</p>
                          <p><span>اسم العميل :</span>{customer.name}</p>
                          <p><span>رقم الهاتف :</span>{customer.phoneNumber}</p>
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
          </Row>
        </div>
      </div>
      
    )
  }
  render() {
    return (
      this.state.logout?
        auth.logout()
      :
        this.renderBody()
    );
  }
}

export default CustomersGroup;