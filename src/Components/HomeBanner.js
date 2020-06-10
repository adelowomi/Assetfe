import React, {Component} from 'react'
import { Link } from 'react-router-dom'

class Banner extends Component {
    state = {  }
    render() { 
        return ( 
            <section id="intro" className="clearfix">
          <div className="container d-flex h-100">
            <div className="row justify-content-center align-self-center">
              <div className="col-md-6 intro-info order-md-first order-last">
                <h1>Stay Systematic,            <br/>Secure And Smart</h1>
                <h5>View, Secure , control and manage your assets in one place.. Get your organisation ahead with <span><b>our game changing solution</b></span> today.</h5>
                <div>
                
                <Link to="/pricing"className="btn-get-started scrollto">Get Started</Link>
                <Link to="/Login" className="btn-login scrollto"> Log in </Link>
                
                </div>
              </div>

              <div className="col-md-6 intro-img order-md-last order-first">
                <img src={process.env.REACT_APP_SUBFOLDER + "/img/intro-img.svg"} alt="" className="img-fluid"/>
              </div>
            </div>

          </div>
        </section>
         );
    }
}
 
export default Banner;