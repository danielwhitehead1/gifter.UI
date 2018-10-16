import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

class Calendar extends Component {
  render() {
    console.log(Auth.currentSession());
    return(
      <div></div>
    );
  }
}
export default Calendar;