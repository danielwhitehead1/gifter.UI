import React, { Component } from 'react';
import { Modal, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';
var d3 = require("d3");

class EventModal extends Component {
  constructor(props) {
    super(props)

    this.onClose = this.onClose.bind(this);
    this.onEdit = this.onEdit.bind(this);
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
    return(<p><b>{contact.firstname}</b> {contact.surname}</p>);
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

  renderView() {
    return(
      <Modal.Header closeButton>
        <Modal.Title id="event-modal-title">
          {this.props.event.title}
        </Modal.Title>
        <Modal.Body>
          <Form>
            <FormGroup >
              <ControlLabel>Contact</ControlLabel>
              <FormControl.Static>{ this.contactsAndEventPresent() ? this.showContactName() : ''}</FormControl.Static>
            </FormGroup>
            <FormGroup >
              <ControlLabel>Info</ControlLabel>
              <FormControl.Static>{this.props.event.info || 'No info entered'}</FormControl.Static>
            </FormGroup>
            <FormGroup >
              <ControlLabel>Date</ControlLabel>
              <FormControl.Static>{new Date(this.props.event.start).toDateString()}</FormControl.Static>
            </FormGroup>
            {this.props.event.allDay ? this.allDayField() : this.timeField() }
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