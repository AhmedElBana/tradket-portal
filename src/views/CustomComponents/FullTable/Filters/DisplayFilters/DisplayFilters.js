import React, { Component } from 'react';
import './displayFilters.scss';

class DisplayFilters extends Component {
    render() {
        return (
            <div class="tagsFiltersDiv">
                <br />
                {Object.keys(this.props.state.currentFilters).map((key, index) => {
                    return this.props.state.currentFilters[key] && <div key={key + index}><span>{key} : </span>{this.props.state.currentFilters[key] === true ? "Yes" : this.props.state.currentFilters[key]}</div>
                })}
            </div>
        )
    }
}

export default DisplayFilters;