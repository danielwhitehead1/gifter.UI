import React, { Component } from 'react';
import Routes from './../../Routes/Routes';
import { NotificationContainer } from 'react-notifications'
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
        <div className="below_navbar">
          <NotificationContainer />
          <Routes childProps={childProps}/>
        </div>
      </div>
    );
  }
}

export default App;
