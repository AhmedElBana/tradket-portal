import React from 'react';
import loading from "./../../assets/img/brand/loading.svg";
import './waiting.css';

const waiting = (props) => {
    return (
        <div className="waitingComponent" style={{height: props.height}}>
            <div className="waitingContent"> 
                {props.width ?
                    <img className="loading" src={loading} alt="waiting icone." style={{width: props.width}}/> 
                :
                    <img className="loading" src={loading} alt="waiting icone." /> 
                }
            </div>
        </div>        
    );
}

export default waiting;