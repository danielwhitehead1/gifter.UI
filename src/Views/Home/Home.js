import React, { Component } from 'react';
import LandingPage from './../Landing/Landing';
import Navbar from './../../Components/Navbar/Navbar';

class Home extends Component {
  render() {
    return(
      <div>
      {
        this.props.isAuthenticated ?
        <Navbar 
          isAuthenticated={this.props.isAuthenticated}
          userHasAuthenticated={this.props.userHasAuthenticated}
        />
        :
         <LandingPage />
      }
    </div>
    ); 
  }
}
export default Home;