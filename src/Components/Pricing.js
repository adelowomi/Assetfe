import React, { Component } from 'react'
import Connect from '../utilities/Connect'
import PlanCard from '../utilities/PlanCard';
import Header from './Header';



export default class Pricing extends Component {
    state = {
        Plan:[], 
        show:true,
        userId: 0,
        companyId: 0,
    };
    componentDidMount() {
        //const { UserId, CompanyId } = this.props.location.state;
        const UserId = localStorage.getItem('UserId');
        const CompanyId = localStorage.getItem('CompanyId') 
        this.setState({ userId: UserId, companyId:CompanyId });
          this.getAllPlans();
          console.log(this.state.userId + this.state.companyId);
          if(!this.props.show){
            this.setState({show:false})
          }
    }
    getAllPlans(){
        Connect("plans/list", "GET")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({Plan: data})
          console.log(this.state.Plan)
        }) 
    }
    render() {
      const {Plans} = this.state.Plan
        return (
          <>
          {!this.state.show ?
            <div style={{marginBottom: '50px'}}>
              <Header />
            </div> : null
          }
          
          
            <section id="pricing" className="wow fadeInUp section-bg">
              <div className="container">
                <header className="section-header">
                  <h3>Pricing</h3>
                  <p>
                    There is a plan for you. Try Asset Management out or select one of our more paid plans to continue.
                  </p>
                </header>
                {

                }
                <div className="row flex-items-xs-middle flex-items-xs-center">
                
                  {/* Basic Plan  */}
                  
                    {this.state.Plan.map(
                      (plan, i) => 
                      <PlanCard 
                        key = {i}
                        id = {plan.Id}
                        price = {plan.Price}
                        name = {plan.Name}
                        UserId = {this.state.userId}
                        CompanyId = {this.state.companyId}
                      />
                    )}
                    
                    </div>
                </div>
             
            </section>

          </>
        );
    }
}
