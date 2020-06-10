import React, { Component } from 'react'

export default class Spinner extends Component {
    render() {
        return (
        <>
            {this.props.size === "small" ?
                <div class="spinner-border spinner-border-sm text-light ml-3" role="status">
                    <span className="sr-only">Loading...</span>
                </div>:
                <div className="spinner-border spinner-border-lg text-danger" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            }
        </>
            
          
        );
    }
}
