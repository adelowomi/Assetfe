import React, { Component } from 'react';
import Header from './Header';


export default class NewPlan extends Component {
    state = {
        loading: false
        
    }
    render() {
        return (
          <div>

            <Header />
            <div style={{paddingTop:'500px'}}>
            <button
                
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Launch demo modal
              </button>
  
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Modal title
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">...</div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                      <button type="button" class="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section className="clearfix">
              <div className="card">
                <div className="card-header">
                  <h4>Add a mew plan</h4>
                </div>
                <div className="card-block" style={{ marginTop: "0px" }}>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <input
                        className="form-control"
                        name="FullName"
                        type="name"
                        value={this.state.FullName}
                        onChange={this.handleChanges}
                        placeholder="FullName"
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
                      />
                      {/* <i class="fas fa-eye form-control-feedback"></i> */}
                    </div>
                    <div className="form-group">
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
                      <div className="text-center">
                        <button className="btn btn-block" type="submit">
                          Adding Plan....
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button className="btn btn-block" type="submit">
                          Add
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </section>
          </div>
        );
    }
}
