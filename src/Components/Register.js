import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "./Header";
import Connect from "../utilities/Connect";
import Spinner from "../utilities/Spinner";

class Register extends Component {
  state = {
    FullName: "",
    EmailAddress: "",
    CompanyName: "",
    Password: "",
    Loading: false,
    redirect: false,
    planId: 0,
    errorMessage: ""
  };
  componentDidMount() {
    const { PlanId } = this.props.location.state;
    this.setState({ planId: PlanId });
    console.log(this.state.planId);
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.type === "checkbox" ? input.checked : input.value;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    this.setState({
      Loading: true
    });
    var MyArray = [
      this.state.FullName,
      this.state.OtherName,
      this.state.EmailAddress,
      this.state.CompanyName,
      this.state.Password,
      this.state.planId
    ];
    // var url = process.env.REACT_APP_API_BASEURL_Test + '/api/users/register';
    // var url = 'http://localhost:56700/api/companies/postcompany';
    var data = {
      FirstName: this.state.FullName,
      Email: this.state.EmailAddress,
      Password: this.state.Password,
      CompanyName: this.state.CompanyName,
      PlanId: this.state.planId
    };
    var Data = JSON.stringify(data);
    Connect("users/adduser", "POST", Data)
      .then(res => res.json())
      .then(response => {
        this.setState({ Loading: false }, function() {
          if (response === "success") {
            console.log(response);
            this.setState({ redirect: true });
          } else {
            if (response === -1 || response === "error") {
              this.setState({
                errorMessage:
                  "There was a problem with your registration. Please make sure to fill in the appropriate details and try again."
              });
              this.setState({ Loading: false });
            } else {
              this.setState({
                Loading: false,
                errorMessage: response
              });
            }
          }
        });
      })
      .catch(error => console.error("Error:", error));
    console.log(MyArray);
    console.log(this.state.Loading);
    event.preventDefault();
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="./confirmemail" />;
    }
    return (
      <div>
        <Header />
        <section id="SignUpSection" className="clearfix">
          <div className="col-lg-6 offset-lg-3 col-sm-6 offset-sm-3">
            <div className="card ">
              <div className="card-header">
                <h3>Sign Up</h3>
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
                {/* <span className="align-content-center font-weight-bold" style={{fontSize: '13px'}}>Use You Account</span>
                        <div className=" row">
                            <div className="col">
                            <p>
                                <a href="" className="btn btn-block btn-twitter twitter"> <i className="fa fa-twitter" style={{fontSize: '16px'}} /> &nbsp;&nbsp;<span style={{fontSize: '12px', fontWeight: 700}}>&nbsp;Twitter</span></a>
                            </p>
                            </div>
                            <div className="col">
                            <p className="">
                                <a href="" className="btn btn-block btn-facebook facebook"> <i className="fa fa-facebook-f" style={{fontSize: '16px'}} /> &nbsp;&nbsp;<span style={{fontSize: '12px', fontWeight: 700}}>&nbsp;Facebook</span></a>
                            </p>
                            </div>
                        </div>
                        <p className="divider-text">
                            <span className="bg-white">OR</span>
                        </p> */}
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="FullName"
                      type="name"
                      value={this.state.FullName}
                      onChange={this.handleChanges}
                      placeholder="FullName"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="EmailAddress"
                      type="email"
                      value={this.state.EmailAddress}
                      onChange={this.handleChanges}
                      placeholder="E-mail Address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="CompanyName"
                      type="text"
                      value={this.state.CompanyName}
                      onChange={this.handleChanges}
                      placeholder="Organization Name"
                      required
                    />
                  </div>
                  <div className="form-group has-feedback">
                    <input
                      id="password"
                      className="form-control"
                      name="Password"
                      type="Password"
                      value={this.state.Password}
                      onChange={this.handleChanges}
                      placeholder="Password"
                      required
                    />
                    {/* <i class="fas fa-eye form-control-feedback"></i> */}
                  </div>
                  <div className="form-group align-left">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      required
                    />
                    <label>
                      <span>
                        By clicking the Sign Up button, you agree to our terms
                        and conditions.
                      </span>
                    </label>
                  </div>
                  {this.state.Loading ? (
                    <div className="text-center clearfix">
                      <button className="btn btn-block" disabled type="submit">
                        <span className="">
                          Signing Up
                          <Spinner size="small" />
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button className="btn btn-block" type="submit">
                        Sign Up
                      </button>
                    </div>
                  )}
                </form>
                <div className="row log" style={{ marginTop: "15px" }}>
                  <div className="col">
                    <a href="login.html">Already have an account? Log in</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Register;
