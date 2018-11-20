import React, { Component } from 'react';
import { Modal, Button, Form, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';

class ContactModal extends Component {
  onClose = () => {
    this.props.onClose();
  }

  onEdit = () => {
    this.props.onEdit();
  }

  renderView() {
    return(
      <Modal.Header closeButton>
        <Modal.Title id="event-modal-title">
          <b>{this.props.contact.firstname}</b> {this.props.contact.surname}
        </Modal.Title>
        <Modal.Body>
          <Form>
            <FormGroup >
              <ControlLabel>About</ControlLabel>
              <FormControl.Static></FormControl.Static>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal.Header>
    )
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
      {this.props.contact ? this.renderModal() : ''}
      </Modal>
    );
  }
}
export default ContactModal