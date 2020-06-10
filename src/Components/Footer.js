import React, { Component } from 'react';
import ContactForm from './ContactForm'

class Footer extends Component {
    state = {  }
    render() { 
        return ( 
            <footer id="footer" className="section-bg">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="footer-info">
                      <h3 className="" style={{marginTop: '100px'}}><img src={process.env.REACT_APP_SUBFOLDER + "/img/asset_simple.png"} alt="" className="img-fluid" /> </h3>
                      {/* <p>Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus. Scelerisque felis imperdiet proin fermentum leo. Amet volutpat consequat mauris nunc congue.</p> */}
                    </div>
                    {/* <div className="footer-newsletter">
                      <h4>Our Newsletter</h4>
                      <p>Tamen quem nulla quae legam multos aute sint culpa legam noster magna veniam enim veniam illum dolore legam minim quorum culpa amet magna export quem.</p>
                      <form action="" method="post">
                        <input type="email" placeholder="Enter Email Adress" name="email" /><input type="submit" defaultValue="Subscribe" />
                      </form>
                    </div> */}
                  </div>
                  <div className="col-sm-6">
                    {/* <div className="footer-links">
                      <h4>Useful Links</h4>
                      <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Terms of service</a></li>
                        <li><a href="#">Privacy policy</a></li>
                      </ul>
                    </div> */}
                    <div className="footer-links">
                      <h4>Contact Us</h4>
                      <p>
                        137/139 Broad Street <br />
                        Marina, Lagos State<br />
                        Nigeria <br />
                        <strong>Phone:</strong> +234 90 872 67 507<br />
                        <strong>Email:</strong> info@asset.bz<br />
                      </p>
                    </div>
                    <div className="social-links">
                      <a href="#" className="twitter"><i className="fa fa-twitter" /></a>
                      <a href="#" className="facebook"><i className="fa fa-facebook" /></a>
                      <a href="#" className="instagram"><i className="fa fa-instagram" /></a>
                      <a href="#" className="linkedin"><i className="fa fa-linkedin" /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form">
                  <h4>Send us a message</h4>
                  <p>Want to integrate AIMS into your service center. We would love to have you onboard. Please provide your details below.</p>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            © Copyright <strong>Assets</strong>. All Rights Reserved
          </div>
          <div className="credits">
            {/*
          All the links in the footer should remain intact.
          You can delete the links only if you purchased the pro version.
          Licensing information: https://bootstrapmade.com/license/
          Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=Rapid
        */}
          </div>
        </div>
      </footer> /* #footer */
         );
    }
}
 
export default Footer;