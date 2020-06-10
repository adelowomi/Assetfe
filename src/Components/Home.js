import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Banner from './HomeBanner'
import Body from './HomeBody'


export default class Home extends Component {
    render() {
        return (
          <div>
            <Header />

            <Banner />
          
            <Body />
         
            <Footer />
          </div>
        )
    }
}
