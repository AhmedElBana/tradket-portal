import React, { Component } from 'react';
import {dependencies} from './../../tools/Dependencies';
import './CopyToClipboard.scss';

class CopyToClipboard extends Component{
  state={
    linkCopied: false
  }

  render(){
    
    return(
        <button onClick={()=>{
            this.setState({linkCopied: dependencies.copyToClipboard(this.props.text)},()=>{
              setTimeout(()=>{ 
                this.setState({linkCopied: false})
              }, 500);
            })}} className="copyBtn">
            {this.state.linkCopied ? <i className="fa fa-check"/> : <i className="fa fa-clone"/>}
          </button>
    )
    }
}
export default CopyToClipboard;
