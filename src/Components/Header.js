import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Header extends Component {
  state = {}
  render() {
    return (
      <header id="header">
        <div id="topbar">
          <div className="container">
            <div className="social-links">
              <a href="https://www.twitter.com" className="twitter"><i className="fa fa-twitter" /></a>
              <a href="https://www.facebook.com" className="facebook"><i className="fa fa-facebook" /></a>
              <a href="https://www.linkedin.coom" className="linkedin"><i className="fa fa-linkedin" /></a>
              <a href="https://www.instagram.com" className="instagram"><i className="fa fa-instagram" /></a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="logo float-left">
            {/* Uncomment below if you prefer to use an image logo */}
            {/* <h1 class="text-light"><a href="#intro" class="scrollto"><span>Rapid</span></a></h1> */}
            <Link to="/" href="#header" className="scrollto"><img src={process.env.REACT_APP_SUBFOLDER + "/img/asset_simple.png"} alt="" className="img-fluid" /></Link>
          </div>
          <nav className="main-nav float-right d-none d-lg-block">
            <ul>
              <li className=""><a href="#intro">Home</a></li>
              <li><a href="#about"> About</a></li>
              <li><a href="#services">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#footer">Contact Us</a></li>
            </ul>

          </nav>{/* .main-nav */}
        </div>
      </header>
    );
  }
}

export default Header;