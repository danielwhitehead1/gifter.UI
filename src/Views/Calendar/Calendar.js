import React, { Component } from 'react';
import MyCalendar from './../../Components/MyCalendar/MyCalendar';
import EventModal from './../../Components/EventModal/EventModal';
import EditEventModal from './../../Components/EditEventModal/EditEventModal';
import UpcomingEvents from './../../Components/UpcomingEvents/UpcomingEvents';
import { Button } from 'react-bootstrap';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';
import Navbar from './../../Components/Navbar/Navbar';

import { getAPI } from '../../lib/apiCall-lib';

import './Calendar.css';

let futureEventsIndex = Number.MAX_SAFE_INTEGER;

class Calendar extends Component {
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
    getAPI('events', this.gotEventsCallback, {}, this.gotEventsError);
    getAPI('contacts', this.gotContactsCallback, {}, this.gotContactsError);
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

  gotContactsError = (error) => {
    console.log(error);
    getAPI('contacts', this.gotContactsCallback, {}, this.gotContactsError);
  }

  gotEventsError = (error) => {
    console.log(error);
    getAPI('events', this.gotEventsCallback, {}, this.gotEventsError);
  }

  gotEventsCallback = (events) => {
    events = this.buildEvents(events)
    this.setState({ events: events, loadingEvents: false });
  }

  buildEvents(events) {
    let currentDate = new Date();
    if(events) {
      events.sort(function(a,b) {
        return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
      });
      events.map(function(event,i) {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        event.allDay = !!event.allDayEvent;
        futureEventsIndex = event.start >= currentDate && futureEventsIndex === Number.MAX_SAFE_INTEGER ? i : futureEventsIndex
        return(event);
      })
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
    getAPI('contacts', this.gotContactsCallback, {}, this.gotContactsError);
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

  showCalendar() {
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
  render() {
    return(
      <div className="centered-content">
        <div>
          <Navbar 
            isAuthenticated={this.props.isAuthenticated}
            userHasAuthenticated={this.props.userHasAuthenticated}
          />
          { 
            (this.state.loadingContacts || this.state.loadingEvents) ? 
              <LoadingIcon />
            : 
              this.showCalendar()
          }
        </div>
      </div>
    );
  }
}

export default Calendar