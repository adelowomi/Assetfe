import React, { Component } from 'react'
import Connect from "../utilities/Connect";
import Spinner from "../utilities/Spinner";
import {Link} from 'react-router-dom'
import Header from "./Header";

export default class ResetPassword extends Component {
    state = {
        isSuccessful: false,
        Code:"",
        errorMessage: "",
        Loading:false,
        Email:"",
        Password:"",
        emailSent:false,
        pass:false,
    }
    componentDidMount(){
        const { match: { params } } = this.props
          console.log(params.code);
          this.setState({
              Code : params.code
          });
      }
    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.type === "checkbox" ? input.checked : input.value;
        this.setState({ [name]: value });
    };
    handleSubmit = e => {
        this.setState({Loading:true})
        Connect("users/requestpasswordreset/" + this.state.Email, "POST", )
        .then(res => res.json())
        .then(response => {
            this.setState({Loading : false })
            console.log(response);
            if(response === "Success"){
                this.setState({emailSent: true})
            }else{
                this.setState({errorMessage:response})
            }
        })
        .catch(error => console.error('Error:', error));
        e.preventDefault();
    }
    handleReset = e => {
        this.setState({Loading:true})
        var data = {
            VerificationCode: this.state.Code,
            Password: this.state.Password
        }
        var Data = JSON.stringify(data);
        Connect("users/resetpassword/", "POST", Data)
        .then(res => res.json())
        .then(response => {
            this.setState({Loading : false })
            console.log(response);
            if(response === "Success"){
                this.setState({isSuccessful: true})
            }else{
                this.setState({errorMessage:response})
            }
        })
        .catch(error => console.error('Error:', error));
        e.preventDefault();
    }
    render() {
        return (
            <div>
                <Header />
                {this.state.isSuccessful ?

                    <section id="SignUpSection" className="clearfix">
                        <div className="col-lg-6 offset-lg- col-sm-6 offset-sm-4" style={{width: '400px'}}>
                            <div className="card ">
                                <div className="card-header">
                                    <div className="icon" style={{color: '#DC143C'}}> <h1><i className="fa fa-check-circle" style={{fontSize: '50px'}}></i></h1></div>
                                    <h4>Password Reset Complete</h4>
                                    <hr />
                                </div>
                                    <div className="card-body text-center">
                                        <p>Your password has been successfully reset.</p>
                                    </div>
                                    <div className="text-center"><Link to="/login"className="btn-asset scrollto">Login</Link></div>
                            </div>
                        </div>
                    </section>
                    :this.state.emailSent ? 
                    <section id="SignUpSection" className="clearfix">
                        <div className="col-lg-6 offset-lg- col-sm-6 offset-sm-4" style={{width: '400px'}}>
                            <div className="card ">
                                <div className="card-header">
                                    <div className="icon" style={{color: '#DC143C'}}> <h1><i className="fa fa-envelope" style={{fontSize: '50px'}}></i></h1></div>
                                    <h4>Verification Email Sent</h4>
                                    <hr />
                                </div>
                                    <div className="card-body text-center">
                                        <p>An email has been sent to verify that you indeed initiated this password change.Please click on the link in the email to continue.</p>
                                    </div>
                                    <div className="text-center"><Link to="/login"className="btn-asset scrollto">Login</Link></div>
                            </div>
                        </div>
                    </section>
                    : this.state.Code === "1" ?
                  <section id="SignUpSection" className=" clearfix">
                    <div className="col-lg-6 offset-lg-3 col-sm-6 offset-sm-3">
                      <div className="card ">
                        <div className="card-header">
                          <h3>Recover Password</h3>
                        </div>
                        <hr />
                          
                        <div className="card-block" style={{ marginTop: "0px" }}>
                        {this.state.errorMessage === "" ? null : (
                            <div className="bg-light mb-2 border-left border-right p-3">
                              <span
                                className="align-content-center font-weight-normal text-danger p-4"
                                style={{ fontSize: "15px", marginBottom: "5px" }}
                              >
                                {this.state.errorMessage}
                              </span>
                            </div>
                          )}
                          
                          <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="Email"
                                name="Email"
                                value={this.state.Email}
                                onChange={this.handleChanges}
                                placeholder="Enter your email"
                              />
                            </div>
                            {this.state.Loading ? (
                              <div className="text-center clearfix">
                                <button className="btn btn-block" disabled type="submit">
                                  <span className="">
                                  Reset Password
                                    <Spinner size="small" />
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <button className="btn btn-block" type="submit">
                                  Reset Password
                                </button>
                              </div>
                            )}
                          </form>
                          <div className="row log" style={{ marginTop: "15px" }}>
                            <div className="col">
                              <a href="/login">Login Instead?</a>
                            </div>
                          </div>
                          <p className="signlink">
                            <a href="/pricing" style={{}}>
                              Create an account
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                  :
                  <section id="SignUpSection" className=" clearfix">
                    <div className="col-lg-6 offset-lg-3 col-sm-6 offset-sm-3">
                      <div className="card ">
                        <div className="card-header">
                          <h3>Recover Password</h3>
                        </div>
                        <hr />
                          
                        <div className="card-block" style={{ marginTop: "0px" }}>
                        {this.state.errorMessage === "" ? null : (
                            <div className="bg-light mb-2 border-left border-right p-3">
                              <span
                                className="align-content-center font-weight-normal text-danger p-4"
                                style={{ fontSize: "15px", marginBottom: "5px" }}
                              >
                                {this.state.errorMessage}
                              </span>
                            </div>
                          )}
                          
                          <form onSubmit={this.handleReset}>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="Password"
                                name="Password"
                                value={this.state.Password}
                                onChange={this.handleChanges}
                                placeholder="New Password"
                              />
                            </div>
                            {this.state.Loading ? (
                              <div className="text-center clearfix">
                                <button className="btn btn-block" disabled type="submit">
                                  <span className="">
                                    Continue
                                    <Spinner size="small" />
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <button className="btn btn-block" type="submit">
                                  Continue
                                </button>
                              </div>
                            )}
                          </form>
                          <div className="row log" style={{ marginTop: "15px" }}>
                            <div className="col">
                              <a href="/login">Login Instead?</a>
                            </div>
                          </div>
                          <p className="signlink">
                            <a href="/register" style={{}}>
                              Create an account
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                }        
            </div>
        )
        
    }
}
