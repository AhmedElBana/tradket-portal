import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DetailsButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    render() {
        return (
            <>
                <Link to={"/custom/products/details/" + this.props.selectedDetailsObj._id} className="filterCompButton SubmitFButton btn btn-secondary">التفاصيل الكاملة</Link>
            </>
        )
    }
}
export default DetailsButtons