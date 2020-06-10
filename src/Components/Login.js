import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "./Header";
import Cookies from "universal-cookie";
import Connect from "../utilities/Connect";
import Spinner from "../utilities/Spinner";

const cookies = new Cookies();
const current = new Date();
const ThisHour = new Date();

ThisHour.setFullYear(current.getHours() + 1);

class Login extends Component {
  state = {
    Email: "",
    Password: "",
    Loading: false,
    thisUser: {},
    showModalButtons: false,
    errorMessage: "",
  };
  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.type === "checkbox" ? input.checked : input.value;
    this.setState({ [name]: value });
  };

  LogMeIn = userobj => {
    /////$.session.clear(); //Revisit here
    cookies.remove("user", { path: "/" }); //for forgetting logged on user
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(userobj));
    cookies.set("user", JSON.stringify(userobj), {
      expires: ThisHour,
      path: "/"
    }); //for remembering logged on user
    localStorage.setItem("username", userobj.UserName);
    localStorage.setItem("userid", userobj.Id);
    localStorage.setItem(
      "fullname",
      userobj.SurName + " " + userobj.OtherNames
    );
    localStorage.setItem("loggedon", "1");
    localStorage.setItem("portalid", userobj.PortalId);
    console.log(userobj);
    //ShowBusyMode();

    var hasintent = localStorage.getItem("hasintent");
    if (hasintent === "1") {
      localStorage.removeItem("hasintent");
      var intent = localStorage.getItem("intent");
      if (intent === "w") {
        //coming from workflow approval email
        var requisitionid = localStorage.getItem("requisitionid");
        var toroleid = localStorage.getItem("toroleid");
        window.location =
          process.env.REACT_APP_API_FRONTENDURL_Test +
          "/aims/admin/index.html#/pipe?action=w&requisitionId=" +
          requisitionid +
          "&toRoleWFId=" +
          toroleid;
        //redirected through pipe again
      } else if (intent === "a") {
        //coming from workflow approval email for acceptance of kit
        var token = localStorage.getItem("token");
        window.location =
          process.env.REACT_APP_API_FRONTENDURL_Test +
          "/aims/admin/index.html#/pipe?action=a&token=" +
          token;
        //redirected through pipe again
      } else {
        this.LogMeIn(userobj); //if intent not known, just proceed with normal login
      }
    } else {
      window.location =
        process.env.REACT_APP_API_FRONTENDURL_Test +
        "/aims/admin/index.html#/userprofile";
    }
  };

  handleSubmit = (event) => {
    this.setState({ Loading: true })
    var MyArray = [
      this.state.Email,
      this.state.Password
    ]
    var data = {
      Email: this.state.Email,
      Password: this.state.Password
    };
    var Data = JSON.stringify(data);
    console.log(data);
    Connect("users/login", "POST", Data)
      .then(res => res.json())
      .then(response => {
        this.setState({ Loading: false })
        var UserToLogIn = response;
        console.log('Success:', JSON.stringify(response))
        if (UserToLogIn === -1) {
          this.setState({ showModalButtons: false });
          document.getElementById("renew-modal").click();
        } else {
          if (UserToLogIn.Id >= 1 && UserToLogIn.PortalId >= 1) {
            this.LogMeIn(UserToLogIn);
          } else {
            if (UserToLogIn.Id >= 1) {
              this.setState({ showModalButtons: true, thisUser: UserToLogIn });
              document.getElementById("renew-modal").click();
            } else {
              this.setState({ errorMessage: UserToLogIn })
              return;
            }
          }
        }
        console.log('Success:', JSON.stringify(response))
      })
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => {
        console.error('Error:', error);
        error = JSON.stringify(error);
        this.setState({ errorMessage: error.Message });

      });
    console.log(MyArray);

    event.preventDefault();
  }

  RenewPlan(type) {
    console.log(type)
    if (type === "renew") {
      Connect("plans/" + this.state.thisUser.Id, "POST")
        .then(res => res.json())
        .then(response => {
          var Response = response;
          this.LogMeIn(Response);
        })
        .catch(error => console.log('Error:', error))
    }
    else {
      // this.setState({redirect:true})
      localStorage.setItem('UserId', this.state.thisUser.Id);
      window.location = "/pricing"
      //localStorage.setItem('CompanyId',this.state.thisUser.PortalId);
      return <Redirect to={{ pathname: '/pricing' }} />
    }
  }

  render() {
    return (
      <div>
        <Header />
        <section id="SignUpSection" className=" clearfix">
          <div className="col-lg-6 offset-lg-3 col-sm-6 offset-sm-3">
            <div className="card ">
              <div className="card-header">
                <h3>Login</h3>
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
                      type="email"
                      name="Email"
                      value={this.state.Email}
                      onChange={this.handleChanges}
                      placeholder="E-mail Address"
                    />
                  </div>
                  <div className="form-group has-feedback">
                    <input
                      id="password"
                      className="form-control"
                      name="Password"
                      type="password"
                      placeholder="Password"
                      value={this.state.Password}
                      onChange={this.handleChanges}
                    />
                    {/* <i class="fas fa-eye form-control-feedback"></i> */}
                  </div>
                  {this.state.Loading ? (
                    <div className="text-center clearfix">
                      <button className="btn btn-block" disabled type="submit">
                        <span className="">
                          Logging In
                          <Spinner size="small" />
                        </span>
                      </button>
                    </div>
                  ) : (
                      <div className="text-center">
                        <button className="btn btn-block" type="submit">
                          Login
                      </button>
                      </div>
                    )}
                </form>
                <div className="row log" style={{ marginTop: "15px" }}>
                  <div className="col">
                    <div id="rem" className="form-group rem">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        required
                      />
                      <label>
                        <span>Remember me</span>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <a href="/reset-password/1">Forgot Password?</a>
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
        <button
          id="renew-modal"
          hidden
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target=".bs-example-modal-lg"
        >
          Large modal
        </button>

        <div
          class="modal fade bs-example-modal-lg"
          id="renew-modal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
        >
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content text-center">
              <div className="modal-header">
                <h4 class="modal-title" id="">
                  Please renew your subscription
                </h4>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body justify-content-center">
                <div className="icon" style={{ color: '#DC143C' }}> <h1><i className="fa fa-credit-card" style={{ fontSize: '100px' }}></i></h1></div>
                {/* <span><i class="fas fa-credit-card"></i><i class="fab fa-cc-mastercard"></i>
                        <i class="fas fa-pause"></i>
                    </span> */}
                {this.state.thisUser.PlanName === "Basic" ?
                  <>
                    <h5>Your free subscription seems to be expired at the moment. <br /> Please renew your subscription or contact admin for further help</h5>
                    {this.state.showModalButtons ?
                      <div className="row justify-content-center">
                        {/* <div className="col-6">
                                 <button className="btn btn-asset btn-block">Renew Subscription</button>
                             </div> */}
                        <div className="col-6">
                          <button
                            className="btn btn-asset btn-block"
                            onClick={() => this.RenewPlan("changePlan")}
                          >CHange Plan</button>
                        </div>
                      </div> :
                      null
                    }
                  </> :
                  <>
                    <h5>Your subscription seems to be expired at the moment. <br /> Please renew your subscription or contact admin for further help</h5>
                    {this.state.showModalButtons ?
                      <div className="row">
                        <div className="col-6">
                          <button
                            className="btn btn-asset btn-block"
                            onClick={() => this.RenewPlan("renew")}
                          >Renew Subscription</button>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-asset btn-block"
                            onClick={() => this.RenewPlan("changePlan")}
                          >CHange Plan</button>
                        </div>
                      </div> :
                      null}
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;