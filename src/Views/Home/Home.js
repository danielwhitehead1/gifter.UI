import React, { Component } from 'react';
import logo from './../../Icons/logo_transparent.png';
import MyCalendar from './../../Components/MyCalendar/MyCalendar';
import EventModal from './../../Components/EventModal/EventModal';
import EditEventModal from './../../Components/EditEventModal/EditEventModal';
import UpcomingEvents from './../../Components/UpcomingEvents/UpcomingEvents';
import { Button } from 'react-bootstrap';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';

import { getAPI } from '../../lib/apiCall-lib';

import './Home.css';

let futureEventsIndex = Number.MAX_SAFE_INTEGER;

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventModalOpen: false,
      currentEvent: this.blankEvent(),
      editEventModalOpen: false,
      loadingEvents: true,
      loadingContacts: true
    }

    this.onEditEventModalClose = this.onEditEventModalClose.bind(this);
  }
  
  componentDidMount() {
    getAPI('events', this.gotEventsCallback);
    getAPI('contacts', this.gotContactsCallback);
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

  gotContactsCallback = (contacts) => {
    let hashedContacts = {};
    if(contacts) {
      contacts.map(function(contact) {
        return(hashedContacts[contact.id] = contact);
      })
    }
    this.setState({ 
      contacts: contacts,
      hashedContacts: hashedContacts,
      loadingContacts: false
    });
  }

  gotEventsCallback = (events) => {
    events = this.buildEvents(events)
    this.setState({ events: events, loadingEvents: false });
  }

  buildEvents(events) {
    let currentDate = new Date();
    if(events) {
      events.map(function(event,i) {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        event.allDay = !!event.allDayEvent;
        futureEventsIndex = event.start >= currentDate && futureEventsIndex === Number.MAX_SAFE_INTEGER ? i : futureEventsIndex
        return(event);
      })
      events.sort(function(a,b) {
        return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
      });
    }
    return(events);
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
    getAPI('events', this.gotEventsCallback);
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
        <UpcomingEvents 
          events={this.state.events ? this.state.events.slice(futureEventsIndex,futureEventsIndex + 4) : []} 
          onClick={this.eventClick}/>
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
      return(<div>
        { 
          (this.state.loadingContacts || this.state.loadingEvents) ? 
            <LoadingIcon />
          : 
            this.userCalendarPage()
        }
        </div>
        );
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