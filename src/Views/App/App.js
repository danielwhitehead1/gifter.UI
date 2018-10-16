import React, { Component } from 'react';
import Routes from './../../Routes/Routes';
import Navbar from './../../Components/Navbar/Navbar';
import { Auth } from "aws-amplify";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if(e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({isAuthenticating: false});
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }

    return (
      !this.state.isAuthenticating &&
      <div>
        <Navbar 
          isAuthenticated={this.state.isAuthenticated}
          userHasAuthenticated={this.userHasAuthenticated}
        />
        <Routes childProps={childProps}/>
      </div>
    );
  }
}

export default App;
