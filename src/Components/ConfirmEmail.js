import React, { Component } from 'react'
import Header from './Header'


export default class ConfirmEmail extends Component {
    render() {
        return (
          <div>
          <Header />
            <section id="SignUpSection" className="clearfix">
              <div className="col-lg-6 offset-lg- col-sm-6 offset-sm-4" style={{width: '400px'}}>
                <div className="card ">
                  <div className="card-header">
                  <div className="icon" style={{color: '#DC143C'}}> <h1><i className="fa fa-envelope" style={{fontSize: '50px'}}></i></h1></div>
                    <h4>Confirm Your Email</h4>
                    <hr />
                  </div>
                  <div className="card-body text-center">
                    <p>An email with a confirmation link has been sent to your mail. Activate your account to continue.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
    }
}
