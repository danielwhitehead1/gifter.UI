import React, { Component } from 'react';
import { Modal, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';
import Suggestions from './../Suggestions/Suggestions';
import { getAPI } from '../../lib/apiCall-lib';
var d3 = require("d3");

class EventModal extends Component {
  constructor(props) {
    super(props)

    this.state = { keywords: [], loaded: false }

    this.onClose = this.onClose.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  gotKeywordsCallback = (tags) => {
    let keywords = Object.keys(tags).reduce(function (r, k) {
      return r.concat(tags[k]['tag']);
    }, []);
    this.setState({keywords: keywords, loaded: true});
  }

  componentDidUpdate(prevProps) {
    let contact = this.props.hashedContacts[this.props.event.contactId];
    if(contact && contact.id !== prevProps.event.contactId) {
      if(contact.firstname !== '') {
        let body = {'queryStringParameters': { 'contactId': contact.id }}
        getAPI('tags', this.gotKeywordsCallback, body);
      }
      this.setState({keywords: []});
    }
  }

  onClose() {
    this.props.onClose();
  }

  onEdit() {
    this.props.onEdit();
  }

  contactsAndEventPresent() {
    return(
      Object.keys(this.props.hashedContacts).length > 0
       && this.props.event.title !== '')
  }

  showContactName() {
    let contact = this.props.hashedContacts[this.props.event.contactId];
    if(contact) {
      return(<FormControl.Static><b>{contact.firstname}</b> {contact.surname}</FormControl.Static>);
    } else {
      return(<FormControl.Static>No contact added for this event yet!</FormControl.Static>)
    }
  }

  allDayField() {
    return(
      <FormGroup >
        <Checkbox checked={this.props.event.allDay} readOnly
        >
          All day event
        </Checkbox >
      </FormGroup>
    );
  }

  timeField() {
    let startTime = this.props.event.start;
    let endTime = this.props.event.end;
    var parser = d3.timeFormat("%H:%M");
    return(
      <FormGroup >
        <ControlLabel>Start Time</ControlLabel>
        <FormControl.Static>{parser(startTime)}</FormControl.Static>
        <ControlLabel>End Time</ControlLabel>
        <FormControl.Static>{parser(endTime)}</FormControl.Static>
      </FormGroup>
    );
  }

  renderSuggestions() {
    let contact = this.props.hashedContacts[this.props.event.contactId];
    if(contact) {
      return(<div>{
        !this.state.loaded ? 
          <LoadingIcon />
        : 
          <Modal.Body>
            <div>
              { this.state.keywords ? 
                <div>
                  <Suggestions keywords={this.state.keywords} contact={contact || {}}/>
                </div> : ''}
            </div>
          </Modal.Body>
      }
      </div>);
    }
  }

  renderView() {
    return(
      <Modal.Header closeButton>
        <Modal.Title id="event-modal-title">
          {this.props.event.title}
        </Modal.Title>
        <Modal.Body>
          <Form>
            <FormGroup>
              <ControlLabel>Contact</ControlLabel>
              { this.contactsAndEventPresent() ? this.showContactName() : ''}
            </FormGroup>
            <FormGroup >
              <ControlLabel>Info</ControlLabel>
              <FormControl.Static>{this.props.event.info || 'No info entered'}</FormControl.Static>
            </FormGroup>
            <FormGroup >
              <ControlLabel>Date</ControlLabel>
              <FormControl.Static>{new Date(this.props.event.start).toDateString()}</FormControl.Static>
            </FormGroup>
            { this.props.event.allDay ? this.allDayField() : this.timeField() }
            { this.contactsAndEventPresent() ? this.renderSuggestions(): '' }
          </Form>
        </Modal.Body>
      </Modal.Header>
    );
  }

  renderModal() {
    return(
      <div>
        {this.renderView()}
        <Modal.Footer>
          <Button onClick={this.onClose}>Close</Button>
          <Button onClick={this.onEdit}  bsStyle="info">Edit</Button>
        </Modal.Footer>
      </div>
    )
  }

  render() {
    return(
      <Modal
        show={this.props.show}
        onHide={this.onClose}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        {this.props.event ? this.renderModal() : '' }
      </Modal>
    );
  }
}
export default EventModal;