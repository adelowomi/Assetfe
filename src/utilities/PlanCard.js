import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Connect from '../utilities/Connect'


export default class PlanCard extends Component {
    state = {
      UserId: this.props.UserId,
      PlanId: 0,
    }
  ChangePlan = (PlanId) => {
    Connect("plans/"+ this.state.UserId + "/change/" + PlanId, "POST",)
    .then(res => res.json())
    .then(response =>{
    })
  }
  render() {
    return (
      <div className="col-xs-12 col-lg-4">
        <div className="card">
          <div className="card-header">
            <h3>
              {this.props.price === "0" ?
              <>
                <span className="currency" />Free
                <span className="period">for 1 month</span>
                </>
                :<>
                <span className="currency" />#{this.props.price}
              <span className="period">/month</span>
              </>
              }
            </h3>
          </div>
          <div className="card-block">
            <h4 className="card-title">{this.props.name}</h4>
            {this.props.name === "Basic" ?
              <ul className="list-group">
              <li className="list-group-item">User Management</li>
              <li className="list-group-item">One User</li>
              <li className="list-group-item">Maximum of 150 Items</li>
              <li className="list-group-item">24/7 Support System</li>
            </ul>:
            this.props.name === "Regular" ?
            <ul className="list-group">
              <li className="list-group-item">User Management</li>
              <li className="list-group-item">Maximum of 50 Users</li>
              <li className="list-group-item">Maximum of 300 Items</li>
              <li className="list-group-item">24/7 Support System</li>
             
            </ul>:
            <ul className="list-group">
              <li className="list-group-item">Api Integration</li>
              <li className="list-group-item">User Management</li>
              <li className="list-group-item">Unlimited Users</li>
              <li className="list-group-item">Unlimited Items</li>
              <li className="list-group-item">24/7 Support System</li>
            </ul>
            }
            {
              this.props.UserId === null ? 
              <Link  to={{
                pathname: '/register',
                state: {
                  PlanId: this.props.id
                }
              }} className="btn">
                Choose Plan
              </Link> :
              <button className="btn" onClick={() => this.ChangePlan(this.props.id)}>Select</button>
            }
            
          </div>
        </div>
      </div>
    );
  }
}
 