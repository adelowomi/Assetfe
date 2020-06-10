import React, { Component } from 'react';
import Pricing from './Pricing'
import { Link } from 'react-router-dom'

class Body extends Component {
    state = {  }
    render() { 
        return ( 
            <main id="main">
        {/*==========================
      About Us Section
    ============================*/}
        <section id="about">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-6">
                <div className="about-img">
                  <img src={process.env.REACT_APP_SUBFOLDER + "/img/about-img.jpg"} alt="" />
                </div>
              </div>
              <div className="col-lg-7 col-md-6">
                <div className="about-content">
                  <h2>About Asset</h2>
                  <h3>Asset and Inventory Management System.</h3>
                  <p>AIMS enables organisations makes it painless to closely monitor and maintain tangible and intangible assets with the provision of an entrenched friendly Asset Management Portal in a holistic system.</p>
                  <p>With AIMS, the systematic process of deploying, operating, maintaining, and disposing of assets becomes very cost-effective. All of these are simplified with our easy to use simple interface that makes you access information quickly and easily knowing what you have and who has it with the use of ultra  high frequency tags.</p>
                  <p>Our applications are built to a “Best Practices” standard, but on an architecture that can be customized quickly and affordably. You can incorporate your policies, procedures and unique data elements right into the software.</p>
                  <ul>
                    <li><i className="ion-android-checkmark-circle" />Standard and robust, yet customizable.</li>
                    <li><i className="ion-android-checkmark-circle" />Real time  tracking of all asset stock and consumable items</li>
                    <li><i className="ion-android-checkmark-circle" />Ensures end-to-end asset lifecycle management from origin to obsolescence. Add and track asset purchase orders, vendors, maintenance histories, and lifetime costs.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>{/* #about */}
        {/*==========================
      Services Section
    ============================*/}
        <section id="services" className="section-bg">
          <div className="container">
            <header className="section-header">
              <h3>Features</h3>
              <p>Be in absolute control of  your IT system using all this built-in asset management features.</p>
            </header>
            <div className="row card-group">
              <div className="col-md-6 col-lg-4 wow bounceInUp" data-wow-duration="1.4s">
                <div className="box">
                  <div className="icon" style={{background: '#fceef3'}}><i className="ion-ios-analytics-outline" style={{background: '#fceef3'}} /></div>
                  <h4 className="title"><a href="">REQUISITION MANAGEMENT</a></h4>
                  <p className="description justify-content-center">Manages the process of creating, processing, authorizing, and tracking purchase requests within an organization</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 wow bounceInUp" data-wow-duration="1.4s">
                <div className="box">
                  <div className="icon" style={{background: '#fff0da'}}><i className="ion-ios-bookmarks-outline" style={{color: '#e98e06'}} /></div>
                  <h4 className="title"><a href="">API INTEGRATIONS</a></h4>
                  <p className="description">It interfaces easily and effectively with existing accounting packages and employee management solutions.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
                <div className="box">
                  <div className="icon" style={{background: '#e6fdfc'}}><i className="ion-ios-paper-outline" style={{color: '#3fcdc7'}} /></div>
                  <h4 className="title"><a href="">BARCODING/RFID</a></h4>
                  <p className="description">Supports RFID tagging enabling assets to report their location and track their movements without human intervention.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
                <div className="box">
                  <div className="icon" style={{background: '#eafde7'}}><i className="ion-ios-speedometer-outline" style={{color: '#41cf2e'}} /></div>
                  <h4 className="title"><a href="">TIME ALERTS</a></h4>
                  <p className="description">Perimeter gate readers can trigger alarm or send messages when assets are moved at ungodly hours as specified by the administrator.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 wow bounceInUp" data-wow-delay="0.2s" data-wow-duration="1.4s">
                <div className="box ">
                  <div className="icon" style={{background: '#e1eeff'}}><i className="ion-ios-world-outline" style={{color: '#2282ff'}} /></div>
                  <h4 className="title"><a href="">AUDITS</a></h4>
                  <p className="description justify-content-between">Monitor regular checkpoints in the asset life cycle. Verify asset possession by having custodians acknowledge ownership or scan asset labels.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 wow bounceInUp" data-wow-delay="0.2s" data-wow-duration="1.4s">
                <div className="box">
                  <div className="icon" style={{background: '#ecebff'}}><i className="ion-ios-clock-outline" style={{color: '#8660fe'}} /></div>
                  <h4 className="title"><a href="">CATEGORIES AND SUBCATEGORIES</a></h4>
                  <p className="description">Classify assets into categories and subcategories for clarity and ease of use. You can also define custom fields as well.</p>
                </div>
              </div>
            </div>
          </div>
        </section>{/* #services */}
        {/*==========================
      Why Us Section
    ============================*/}
        {/*==========================
      Call To Action Section
    ============================*/}
        <section id="call-to-action" className="wow fadeInUp">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 text-center text-lg-left">
                <h3 className="cta-title">SIGN UP FOR A FREE 1 MONTH TRIAL</h3>
                <p className="cta-text"> 
                  Let’s take you on an amazing ride on how you can manage all your assets efficiently and easily with no hassles. Ready for that awesome experience.</p>
              </div>
              <div className="col-lg-3 cta-btn-container text-center">
              <Link 
              to={{
                pathname: '/register',
                state: {
                  PlanId: 4
                }
              }} className="cta-btn align-middle">
                Click Here
              </Link>
                {/* <a className="cta-btn align-middle" href="/pricing">Click Here</a> */}
              </div>
            </div>
          </div>
        </section>{/* #call-to-action */}
   
        {/*==========================
      Pricing Section
    ============================*/}
       <Pricing show={true}/>
        {/*==========================
      Frequently Asked Questions Section
    ============================*/}
        <section id="faq">
          <div className="container">
            <header className="section-header">
              <h3>Frequently Asked Questions</h3>
              <p>Few of the things you need to know about AIMS</p>
            </header>
            <ul id="faq-list" className="wow fadeInUp">
              <li>
                <a data-toggle="collapse" className="collapsed" href="#faq1">Why should I use AIMS?  <i className="ion-android-remove" /></a>
                <div id="faq1" className="collapse" data-parent="#faq-list">
                  <p>
                  AIMS software offers simple operational workflows that enables you to perform several functions with little or no assistance.
                  </p>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" href="#faq2" className="collapsed">Is my information secure? <i className="ion-android-remove" /></a>
                <div id="faq2" className="collapse" data-parent="#faq-list">
                  <p>
                  Absolutely yes it is, as AIMS software and data are securely hosted with multi levels data encryption.
                  </p>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" href="#faq3" className="collapsed">How are assets counted towards a package limit?  <i className="ion-android-remove" /></a>
                <div id="faq3" className="collapse" data-parent="#faq-list">
                  <p>
                  Each subscription package has a limit for items that you can track. This limit is a sum of all uniquely identifiable assets,asset stock and inventory.individual stock quantities do not count towards a package limit.
                  </p>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" href="#faq4" className="collapsed">What kind of assets does AIMS track? <i className="ion-android-remove" /></a>
                <div id="faq4" className="collapse" data-parent="#faq-list">
                  <p>
                  AIMS can be used to track all types of fixed assets such as tools, equipment, phones, computers, office furniture, leases, inventory, art, collectibles and personal possessions.
                  </p>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" href="#faq5" className="collapsed">How do I add users? <i className="ion-android-remove" /></a>
                <div id="faq5" className="collapse" data-parent="#faq-list">
                  <p>
                  Users are added on  the user management page which can be accessed via the main menu.
                  </p>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" href="#faq6" className="collapsed">Can I upgrade my account later? <i className="ion-android-remove" /></a>
                <div id="faq6" className="collapse" data-parent="#faq-list">
                  <p>
                  Of course ,you can upgrade ,downgrade or cancel your account at any point in time with no extra charge.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>{/* #faq */}
      </main>
         );
    }
}
 
export default Body;
