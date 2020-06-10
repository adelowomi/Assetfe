import React, { Component } from 'react'
import Spinner from '../utilities/Spinner'
import Connect from '../utilities/Connect'
import Header from './Header'

export default class InitializePayment extends Component {
    state = {
        Loading: false,
        PayData: {},
    }

    componentDidMount(){
       this.initialize();
    }
    initialize() {
        this.setState({loading: true, error: false});
        Connect("payment/InitializePayment/" + this.props.match.params.userId + "/" + this.props.match.params.planId, "POST", {})
        .then(res => res.json()) 
        .then(data => {
                var response = data;
                console.log(response);
                if (response.Ref > 1) {
                    //initialize payment
                    this.setState(
                        {
                          PayData: response, loading: false, error: false
                        },
                        () => {
                            console.log(this.state.PayData)
                          var payForm =  document.getElementById('pay-form');
                          console.log(payForm);
                          payForm.submit();
                        },
                      );

                } else {
                    this.setState({loading: false, error: true});
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ error: true, loading: false });
                eval(`CustomAlert("Connection error", "An error occurred, please check your connection", "error")`);
            });

    }
    render() {
        //this.initialize();
        return (
            <div>
                <Header />
                <div className="text-center " style={{marginTop:'150px'}}><Spinner /></div>
                <form
                    name="pay-form"
                    id="pay-form"
                    method="post"
                    action="https://www.a1pay.net/home/pay/pay"
                    enctype="multipart/form-data"
                >
                    <input
                        type="hidden"
                        name="FirstName"
                        id="FirstName"
                        value={this.state.PayData.Firstname}
                    />
                    <input
                        type="hidden"
                        name="SurName"
                        id="SurName"
                        value={this.state.PayData.SurName}
                    />
                   <input
                        type="hidden"
                        name="EmailAddress"
                        id="EmailAddress"
                        value={this.state.PayData.Email}
                    />
                    <input
                        type="hidden"
                        name="PhoneNumber"
                        id="PhoneNumber"
                        value={this.state.PayData.PhoneNumber}
                    />
                    <input
                        type="hidden"
                        name="MerchantId"
                        id="MerchantId"
                        value={this.state.PayData.MerchantId}
                    />
                    <input
                        type="hidden"
                        name="Amount"
                        id="Amount"
                        value={this.state.PayData.Amount}
                    />
                    <input
                        type="hidden"
                        name="hash"
                        id="hash"
                        value={this.state.PayData.hash}
                    />
                    <input
                        type="hidden"
                        name="ref"
                        id="ref"
                        value={this.state.PayData.Ref}
                    />
                    <input
                        type="hidden"
                        name="Validity"
                        id="Validity"
                        value={this.state.PayData.Validity}
                    />
                </form>
            </div>
        )
    }
}

