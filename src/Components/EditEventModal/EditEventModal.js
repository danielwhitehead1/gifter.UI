import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Form, Checkbox } from 'react-bootstrap';
import LoaderButton from "../LoaderButton/LoaderButton";
import DateTime from 'react-datetime';
import { API } from 'aws-amplify';
import Select from 'react-select';
import { postAPI, updateAPI } from './../../lib/apiCall-lib';

import 'react-datetime/css/react-datetime.css';
import './EditEventModal.css';

var d3 = require("d3");

class EditEventModal extends Component {
  constructor(props) {
    super(props);
    let event = props.event;
    var timeParser = d3.timeFormat("%H:%M");
    var dateParser = d3.timeFormat("%Y-%m-%d");
  
    this.state = {
        title: event.title,
        date: dateParser(event.start),
        start: timeParser(event.start),
        end: timeParser(event.end),
        contactId: event.contactId,
        allDayEvent: event.allDay,
        info: event.info,
        isLoading: false
      }
    
    this.closeModal = this.closeModal.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.event !== prevProps.event) {
      let event = this.props.event;
      var timeParser = d3.timeFormat("%H:%M");
      var dateParser = d3.timeFormat("%Y-%m-%d");
      this.setState({
        title: event.title,
        date: dateParser(event.start),
        start: timeParser(event.start),
        end: timeParser(event.end),
        contactId: event.contactId,
        allDayEvent: event.allDay,
        info: event.info,
        isLoading: false,
        isDeleting: false
      })
    }
  }

  handleDatetimeChange(value, state) {
    this.setState({[state]: value});
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSelectChange = contact => {
    this.setState({
      contactId: contact.value
    });
  }

  handleCheckboxChange() {
    this.setState(prevState => ({
      allDayEvent: !prevState.allDayEvent
    }));
    if(this.state.allDayEvent) {
      this.setState({
        start: "00:00",
        end: "01:00"
      })
    }
  }

  validateForm() {
    let startHour = parseInt(this.state.start.substring(0,2));
    let endHour  = parseInt(this.state.end.substring(0,2));
    let startMinute = parseInt(this.state.start.substring(3,5));
    let endMinute = parseInt(this.state.end.substring(3,5));
    return(
      this.state.date.length > 0 &&
      this.state.title.length > 0 &&
      this.state.contactId !== '' &&
      (this.state.allDayEvent || 
        (startHour < endHour) || 
        ((startHour === endHour) && startMinute < endMinute))
    );
  }

  closeModal() {
    this.setState(
      {
        title: '',
        date: '',
        start: '00:00',
        end: '01:00',
        contactId: '',
        info: '',
        isLoading: false,
        isDeleting: false,
        allDayEvent: false
      }
    );
    this.props.onClose();
  }

  getBody() {
    return(
      {
        'body': {
          'start': `${this.state.date} ${this.state.start}`,
          'end': `${this.state.date} ${this.state.end}`,
          'title': this.state.title,
          'allDayEvent': this.state.allDayEvent ? 1 : 0,
          'info': this.state.info,
          'contactId': this.state.contactId
        }
      }
    );
  }

  getLabel() {
    let contacts = this.props.hashedContacts;
    let id = this.state.contactId;
    if(Object.keys(contacts).length > 0 && id !== ''){
     return(
        {
          value: id, 
          label: `${contacts[id].firstname} ${contacts[id].surname}`
        }
      );
    }
  }

  eventSuccesCallback = () => {
    this.props.updateCalendar();
    this.closeModal();
    alert("Success");
  }

  eventErrorCallback = () => {
    this.closeModal();
    alert("Something went wrong");
  }

  createEvent() {
    this.setState({isLoading: true});
    let reqBody = this.getBody();
    postAPI('events', reqBody, this.eventSuccesCallback, this.eventErrorCallback)
  }

  updateEvent() {
    this.setState({isLoading: true});
    let reqBody = this.getBody();
    reqBody.body['id'] = this.props.event.id;
    updateAPI('events', reqBody, this.eventSuccesCallback, this.eventErrorCallback);
  }

  deleteEvent() {
    this.setState({isDeleting: true});
    let body = {
      'body': { 'id': this.props.event.id }
    }
    API.del("prod-gifter-api", "/events", body ).then( response => {
      this.props.updateCalendar();
      this.closeModal();
      alert("Event deleted successfully")
    }).catch(error => {
      this.closeModal();
      alert("Something went wrong")
    });

  }

  createEventButtons() {
    return(
      <div>
        <Button onClick={this.closeModal}>Close</Button>
        <LoaderButton 
          disabled={!this.validateForm()} 
          bsStyle="primary" 
          onClick={this.createEvent}
          isLoading={this.state.isLoading}
          text="Create event"
          loadingText="Creating..."
        />
      </div>
    );
  }

  updateEventButtons() {
    return(
      <div>
        <LoaderButton 
          className="delete-event-btn"
          bsStyle="danger" 
          onClick={this.deleteEvent}
          isLoading={this.state.isDeleting}
          text="Delete event"
          loadingText="Deleting..."
        />
        <Button onClick={this.closeModal}>Close</Button>
        <LoaderButton 
          disabled={!this.validateForm()} 
          bsStyle="primary" 
          onClick={this.updateEvent}
          isLoading={this.state.isLoading}
          text="Update event"
          loadingText="Updating..."
        />
      </div>  
    );
  }

  startEndTimeFields() {
    return(
      <Form componentClass="fieldset" inline>
          <FormGroup controlId="start" bsSize="large">
            <ControlLabel>Start Time</ControlLabel>
            <DateTime 
              dateFormat={false}
              input={false} 
              onChange={(e) => this.handleDatetimeChange(e.format("HH:mm"), "start")} 
              defaultValue={new Date().setHours(this.state.start.substring(0,2), this.state.start.substring(3,5))}
            />
          </FormGroup>
          <FormGroup controlId="end" bsSize="large">
            <ControlLabel>End Time</ControlLabel>
            <DateTime
              dateFormat={false} 
              input={false} 
              onChange={(e) => this.handleDatetimeChange(e.format("HH:mm"), "end")}
              defaultValue={new Date().setHours(this.state.end.substring(0,2), this.state.end.substring(3,5))} 
            />
          </FormGroup>
        </Form>
    );
  }

  contactSelectField() {
    let contacts = [];
    this.props.contacts.map(function(contact) {
      return(contacts.push({value: contact.id, label: `${contact.firstname} ${contact.surname}`}))
    })
    return(
      <FormGroup controlId="contactId">
        <ControlLabel>Contact</ControlLabel>
        <Select
          value={this.getLabel()}
          onChange={this.handleSelectChange}
          options={contacts}
        />
      </FormGroup>
    )
  }

  render() {
    return(
      <Modal show={this.props.show} disabled={this.state.isDeleting}>
      <Modal.Header>
        <Modal.Title>{this.props.event.title === "" ? "Update Event" : "Create Event"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup controlId="title" bsSize="large">
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            onChange={this.handleChange}
            value={this.state.title}
          />
        </FormGroup>
        {this.contactSelectField()}
        <FormGroup controlId="info" bsSize="large">
          <ControlLabel>Info</ControlLabel>
          <FormControl
            componentClass="textarea"
            type="text"
            onChange={this.handleChange}
            value={this.state.info}
          />
        </FormGroup>
        <FormGroup controlId="date" bsSize="large">
          <ControlLabel>Date</ControlLabel>
          <DateTime 
            dateFormat="YYYY-MM-DD" 
            input={false}
            timeFormat={false} 
            value={this.state.date} 
            onChange={(e) => this.handleDatetimeChange(e.format("YYYY-MM-DD"), "date")} 
          />
        </FormGroup>
        <FormGroup controlId="allDayEvent">
          <Checkbox 
            name="allDayEvent"
            onChange={this.handleCheckboxChange}
            defaultChecked={this.state.allDayEvent}
          >
            All day event
          </Checkbox >
        </FormGroup>
        {this.state.allDayEvent ? null : this.startEndTimeFields() }
      </Modal.Body>
      <Modal.Footer>
        {this.props.event.title === "" ? this.createEventButtons() : this.updateEventButtons()}
      </Modal.Footer>
    </Modal>
    )
  }
}

export default EditEventModal;