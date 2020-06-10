import React, { Component } from 'react'
import Connect from '../utilities/Connect'


export default class ContactForm extends Component {
    state = {
        Name: "",
        Email:"",
        Subject:"",
        Message:"",
        Success: false,
        errorMessage: "",
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
          this.state.Name,
          this.state.Email,
          this.state.Subject,
          this.state.Message,
        ];
        // var url = process.env.REACT_APP_API_BASEURL_Test + '/api/users/register';
        // var url = 'http://localhost:56700/api/companies/postcompany';
        var data = {
          Name: this.state.Name,
          Email: this.state.Email,
          Message: this.state.Message,
          Subject: this.state.Subject,
        };
        var Data = JSON.stringify(data);
        Connect("contacts/newmessage", "POST", Data)
          .then(res => res.json())
          .then(response => {
            this.setState({ Loading: false }, function() {
              if (response === "success") {
                console.log(response);
                document.getElementById('contactForm').reset();
                this.setState({ Success: true });
              } else {
                if (response === -1 || response === "error") {
                  this.setState({
                    errorMessage:
                      "There was a sending your message please try again.You can alternatively contact us at contact@asset.bz."
                  });
                  this.setState({ Loading: false });
                } else {
                  this.setState({
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
        return (
            <>
            {this.state.Success ?
                <span className="text-danger" id="">Your message has been sent. Thank you!</span>
            :   <span className="text-danger" id="">{this.state.errorMessage}</span > 
            }
            <form onSubmit={this.handleSubmit} className="contactForm" id="contactForm">
                    <div className="form-group">
                      <input 
                      type="text" 
                      name="Name" 
                      className="form-control" 
                      id="name" placeholder="Your Name" 
                      data-rule="minlen:4"
                      onChange={this.handleChanges} 
                      data-msg="Please enter at least 4 chars" 
                      />
                      <div className="validation" />
                    </div>
                    <div className="form-group">
                      <input 
                      type="email" 
                      className="form-control" 
                      name="Email" 
                      id="email" 
                      placeholder="Your Email" 
                      data-rule="email"
                      onChange={this.handleChanges} 
                      data-msg="Please enter a valid email" 
                      />
                      <div className="validation" />
                    </div>
                    <div className="form-group">
                      <input 
                      type="text" 
                      className="form-control" 
                      name="Subject" 
                      id="subject" 
                      placeholder="Subject" 
                      data-rule="minlen:4"
                      onChange={this.handleChanges} 
                      data-msg="Please enter at least 8 chars of subject" 
                      />
                      <div className="validation" />
                    </div>
                    <div className="form-group">
                      <textarea 
                      className="form-control" 
                      name="Message" 
                      rows={5} 
                      data-rule="required" 
                      data-msg="Please write something for us" 
                      placeholder="Message" defaultValue={""} 
                      onChange={this.handleChanges}
                      />
                      <div className="validation" />
                    </div>
                   
                    <div className="text-center"><button className="btn" type="submit" title="Send Message">Send Message</button></div>
                  </form>
                  </>
        )
    }
}
