import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'


export default class EmailConfirmed extends Component {
    render() {
        return (
          <div>
          <Header />
            <section id="SignUpSection" className="clearfix">
              <div className="col-lg-6 offset-lg- col-sm-6 offset-sm-4" style={{width: '400px'}}>
                <div className="card ">
                  <div className="card-header">
                  <div className="icon" style={{color: '#DC143C'}}> <h1><i className="fa fa-check-circle" style={{fontSize: '50px'}}></i></h1></div>
                    <h4>Sign Up Complete</h4>
                    <hr />
                  </div>
                  <div className="card-body text-center">
                    <p>Your email has been successfully verified. You are ready to enjoy all the benefits of AIMS.</p>
                  </div>
                  <div className="text-center"><Link to="/login"className="btn-asset scrollto">Proceed</Link></div>
                </div>
              </div>
            </section>
          </div>
        );
    }
}
