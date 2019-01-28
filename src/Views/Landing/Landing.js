import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

import './Landing.css';

class Landing extends Component {
  renderLoginButtons() {
    return(
      <div className='centered-btns'>
        <Button href="/login" to="/login" active={window.location.pathname === '/login'}>Login</Button>
        <Button className='right-btn' href="/signup" to="/signup" active={window.location.pathname === '/signup'}>Signup</Button>
      </div>
    );
  }
  render() {
    return(
      <div className='no_navbar'>
        <div className="parallax first">
        </div>
        <div className='landing-text'>
          <div className='centered-content' >        
            <Jumbotron className='welcome-txt'>
              <h1>Welcome to Gifter</h1>
              <p>
                If you've struggled with buying presents in the past (and we all have), you've come to the right place.
                Our goal is to help people buy meaningful and heartfelt gifts for your friends and family.
              </p>
            </Jumbotron>
          </div>
        </div>
        <div className="parallax second"> </div>
        <div className='landing-text'>
          <div className='centered-content' >        
            <Jumbotron className='welcome-txt'>
              <h1>About</h1>
              <p>
                We are the one stop shop for keeping track of events and storing gift ideas. We will even give you some inspiration of our own.
              </p>
              <h2>Suggestions</h2>
              <p>
                The suggestions we give are based on the information you can give us about your friend or family member. No information is <b>needed</b> but
                 the more you can tell us the better the suggestions will be.
              </p>
            </Jumbotron>
          </div>
        </div>
        <div className="parallax third"> </div>
        <div className='landing-text'>
          <div className='centered-content' >        
            <Jumbotron className='welcome-txt'>
              <h1>Get Started</h1>
              { this.renderLoginButtons() }
            </Jumbotron>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing;