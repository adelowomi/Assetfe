import React, { Component } from 'react'
import Header from './Header'
import Connect from '../utilities/Connect'
import Spinner from '../utilities/Spinner'
import { Link } from 'react-router-dom'

export default class PaymentStatus extends Component {
    state = {
        loading: false,
        IsSuccessful: false,
        TransactionId: 0,
    }

    componentDidMount(){
      const { match: { params } } = this.props
        console.log(params.TransId);
        this.setState({
            loading: true,
            TransactionId : params.TransId
        });
        this.checkPaymentStatus();

    }

    checkPaymentStatus = () => {
      const { match: { params } } = this.props
        console.log(params.TransId);
        Connect("payment/status/" + params.TransId, "GET")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({
            IsSuccessful: data,
            loading:false
          })
          console.log(this.state.IsSuccessful)
        })
    }
    render() {
        
        return (
            <>
            <Header />
            {this.state.loading ? <div className="text-center " style={{marginTop:'150px'}}><Spinner /></div> :
                this.state.IsSuccessful ?
                <section id="SignUpSection" className="clearfix">
                  <div className="col-lg-6 offset-lg- col-sm-6 offset-sm-4" style={{width: '400px'}}>
                    <div className="card ">
                      <div className="card-header">
                      <div className="icon" style={{color: '#DC143C'}}> <h1><i className="fas fa-check-double" style={{fontSize: '50px'}}></i></h1></div>
                        <h3>Payment Successful</h3>
                        <hr />
                      </div>
                      <div className="card-body text-center">
                        <p>You have completed payment successfully. You can now proceed to Login</p>
                      </div>
                      <div className="text-center"><Link to="/login"className="btn-asset scrollto">Login</Link></div>
                    </div>
                  </div>
                </section> :
                <section id="SignUpSection" className="clearfix">
                <div className="col-lg-6 offset-lg- col-sm-6 offset-sm-4" style={{width: '400px'}}>
                  <div className="card ">
                    <div className="card-header">
                    <div className="icon" style={{color: '#DC143C'}}> <h1><i className="fas fa-times" style={{fontSize: '50px'}}></i></h1></div>
                      <h3>Transaction Failed</h3>
                      <hr />
                    </div>
                    <div className="card-body text-center">
                      <p>An email with a confirmation link has been sent to your mail. Activate your account to continue.</p>
                    </div>
                  </div>
                  <div className="text-center"><Link to="/login"className="btn-asset scrollto">Login</Link></div>
                </div>
              </section>
    }
            </>
        )
    }
}
