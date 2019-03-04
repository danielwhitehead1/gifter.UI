import React, { Component } from 'react';
import LandingPage from './../Landing/Landing';
import Navbar from './../../Components/Navbar/Navbar';
import Typography from '@material-ui/core/Typography';
import HelpSection from './../../Components/HelpSection/HelpSection';
import welcome from './../../Icons/welcome-to-gifter.jpg';
import recommenderSystem from './../../Icons/recommender-system.jpg';
import thoughtfulGift from './../../Icons/thoughtful-gifting.jpg';

import { Carousel } from 'react-bootstrap';
import { Link, Element } from 'react-scroll'
import './Home.css';
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
          <div className="centered-content">
            <Carousel interval={null} className='carousel-container'>
              <Carousel.Item>
                <img width={900} height={500} alt="welcome-img" src={welcome} />
              </Carousel.Item>
              <Carousel.Item>
                <img width={900} height={500} alt="recommender-system-img" src={recommenderSystem} />
              </Carousel.Item>
              <Carousel.Item>
                <img width={900} height={500} alt="thoughtful-gifting-img" src={thoughtfulGift} />
              </Carousel.Item>
            </Carousel>
            <Typography variant="h2" gutterBottom>
              Where to start?
            </Typography>
            <p className='home-text'>
              Now you're in its time to get started, check out the <Link activeClass="active" className="help-link" to="help-section" spy={true} smooth={true} duration={500} >help</Link> section for some tips on where to start.
            </p>
            <p className='home-text'>
              Make sure when you're setting everything up you give as much information as possible! The more we know, the more we can help.
            </p>
            <Typography variant="h2" gutterBottom>
              The Aim
            </Typography>
            <p className='home-text'>
              The goal is to create a complete solution to support people in buying meaningful and heartfelt gifts. Gifter is a tool for inspiring you!
              We collate your thoughts and provide fuel to the flame by suggesting products and finding similar contacts across Gifter.
            </p>
            <p className='home-text'>
              This application was built as part of a third year project out of The University of Manchester. The inspiration came from the constant
              difficulty that comes from buying presents and the hunger for a solution that helps you to buy good gifts, easier.
            </p>
            <Element name="help-section" className="help-section" >
              <HelpSection />
            </Element>
          </div> 
        </div>

        :
         <LandingPage />
      }
    </div>
    ); 
  }
}
export default Home;