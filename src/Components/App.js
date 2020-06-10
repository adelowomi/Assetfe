import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import Home from './Home'
import Register from './Register'
import Login from './Login'
import ConfirmEmail from './ConfirmEmail'
import EmailConfirmed from './EmailConfirmed';
import Pricing from './Pricing';
import NewPlan from './NewPlan';
import InitializePayment from './InitializePayment';
import PaymentStatus from './PaymentStatus';
import ResetPassword from './ResetPassword'


function App() {
  return (
    <Router basename={process.env.REACT_APP_SUBFOLDER}>
    <div className="">
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path="/confirmemail" component={ConfirmEmail}/>
        <Route path="/emailconfirmed" component={EmailConfirmed}/>
        <Route path="/pricing" component={Pricing}/>
        <Route path="/addplan" component={NewPlan}/>
        <Route path="/initializepayment/:userId/:planId" component={InitializePayment}/>
        <Route path="/paymentstatus/:TransId" component={PaymentStatus}/>
        <Route path="/reset-password/:code?"  component={ResetPassword}/>
      </Switch>     
    </div>
    </Router>
 
  );
}

export default App;
