import React, { Component } from 'react';
import Navbar from './../../Components/Navbar/Navbar';

class Profile extends Component {
  render() {
    return(
      <div>
        <Navbar 
          isAuthenticated={this.props.isAuthenticated}
          userHasAuthenticated={this.props.userHasAuthenticated}
        />  
        <div className="centered-content">
          <p>Profile Page</p>
        </div>
      </div>
    );
  }
}

export default Profile;