import React, { Component } from 'react';
import logo from './../../Icons/logo_transparent.png';
import Calendar from './../Calendar/Calendar';
import './Home.css';

class Home extends Component {
  logoPage() {
    return(
      <div className="centered-content">
        <img src={logo} alt='Gifter logo' className="img-responsive" />
        <h1 className="centered-text">
          Welcome to never worrying about presents again
        </h1>
      </div> 
    );
  }   
  
  userCalendarPage() {
    return(
      <Calendar isAuthenticated={this.props.isAuthenticated} />
    );
  }

  rednerHomePage() {
    if(this.props.isAuthenticated) {
      return(this.userCalendarPage());
    }
    else {
      return(this.logoPage());
    }
  }

  render() {
    return(
      this.rednerHomePage()
    ); 
  }
}
export default Home;