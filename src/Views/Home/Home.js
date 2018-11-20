import React, { Component } from 'react';
import logo from './../../Icons/logo_transparent.png';
import MyCalendar from './../../Components/MyCalendar/MyCalendar';
import EventModal from './../../Components/EventModal/EventModal';
import EditEventModal from './../../Components/EditEventModal/EditEventModal';
import { Button } from 'react-bootstrap';
import { API, Auth } from 'aws-amplify';

import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventModalOpen: false,
      currentEvent: this.blankEvent(),
      editEventModalOpen: false
    }

    this.onEditEventModalClose = this.onEditEventModalClose.bind(this);
    this.getEvents = this.getEvents.bind(this);
  }
  
  componentDidMount() {
    this.getEvents();
    this.getContacts();
  }

  logoPage() {
    return(
      <div>
        <img src={logo} alt='Gifter logo' className="img-responsive" />
        <h1 className="centered-text">
          Welcome to never worrying about presents again
        </h1>
      </div> 
    );
  }

  async getContacts() {
    try {
      var contacts = await Auth.currentAuthenticatedUser()
      .then(async () => {   
        return await API.get("prod-gifter-api", "/contacts");
      })
      .catch(err => console.log(err));
    } catch (e) {
      alert(e);
    }
    let hashedContacts = {};
    contacts.map(function(contact) {
      hashedContacts[contact.id] = contact;
    })
    this.setState({ 
      contacts: contacts,
      hashedContacts: hashedContacts
    });
  }

  async getEvents() {
    try {
      var events = await Auth.currentAuthenticatedUser()
      .then(async () => {   
        return await API.get("prod-gifter-api", "/events");
      })
      .catch(err => console.log(err));
    } catch (e) {
      alert(e);
    }
    this.setState({ events: events });
  }

  eventClick = (event) => {
    this.setState({
      eventModalOpen: true,
      currentEvent: event
    });
  }

  createEvent = () => {
    this.setState({editEventModalOpen: true});
  }

  onEventModalClose = () => {
    this.setState({eventModalOpen: false, currentEvent: this.blankEvent()});
  }

  onEditEventModalClose = () => {
    this.setState({ editEventModalOpen: false, currentEvent: this.blankEvent()})
  }

  onEventEdit = () => {
    this.setState({
      eventModalOpen: false,
      editEventModalOpen: true
    })
  }
  
  updateCalendar = () => {
    this.getEvents();
  }

  blankEvent() {
    return(
      {
        title: '',
        date: '',
        start: new Date().setHours(0,0,0),
        end: new Date().setHours(1,0,0),
        contact: '',
        allDayEvent: false,
        info: '',
        contactId: ''
      }
    );
  }

  userCalendarPage() {
    return(
      <div>
        <MyCalendar 
          eventClick = {this.eventClick} events={this.state.events || []}
        />
        <EventModal 
          show={this.state.eventModalOpen} 
          onClose={this.onEventModalClose} 
          event={this.state.currentEvent}
          onEdit={this.onEventEdit}
          hashedContacts={this.state.hashedContacts || {}}
        />
        <EditEventModal 
          updateCalendar = {this.updateCalendar}
          show={this.state.editEventModalOpen} 
          onClose={this.onEditEventModalClose} 
          event={this.state.currentEvent}
          contacts={this.state.contacts || []}
          hashedContacts={this.state.hashedContacts || {}}
        />
        <Button 
          bsStyle="primary"
          onClick={this.createEvent}
          className="create-btn"
        >
          Create Event
        </Button>
      </div>
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
      <div className="centered-content">
        {this.rednerHomePage()}
      </div>
    ); 
  }
}
export default Home;