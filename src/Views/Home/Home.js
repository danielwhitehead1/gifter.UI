import React, { Component } from 'react';
import LandingPage from './../Landing/Landing';
import Navbar from './../../Components/Navbar/Navbar';
import { Button } from 'react-bootstrap';
// import { initClient } from './../../lib/google_calendar-lib.js';

class Home extends Component {
  render() {
    return(
      <div>
      {
        this.props.isAuthenticated ?
        <div>
          <Navbar 
            isAuthenticated={this.props.isAuthenticated}
            userHasAuthenticated={this.props.userHasAuthenticated}
          />
          {/* <Button onClick={initClient}>Authorise</Button>  */}
        </div>

        :
         <LandingPage />
      }
    </div>
    ); 
  }
}
export default Home;