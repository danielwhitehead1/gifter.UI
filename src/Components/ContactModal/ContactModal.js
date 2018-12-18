import React, { Component } from 'react';
import { Modal, Button, Form, ControlLabel, FormGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Suggestions from './../Suggestions/Suggestions';
import { getKeywords } from '../../lib/getKeywords-lib';

import './ContactModal.css'

class ContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = { keywords: [] }
  }

  gotKeywordsCallback = (tags) => {
    let keywords = Object.keys(tags).reduce(function (r, k) {
      return r.concat(tags[k]['tag']);
    }, []);
    this.setState({keywords: keywords})
  }

  componentDidUpdate(prevProps) {
    let contact = this.props.contact;
    if(contact !== prevProps.contact) {
      if(contact.firstname !== '') {
        getKeywords(contact.id, this.gotKeywordsCallback);
      }
      this.setState({keywords: []});
    }
  }

  onClose = () => {
    this.props.onClose();
  }

  onEdit = () => {
    this.props.onEdit();
  }

  renderDetails() {
    return(
      
          <Form>
            <FormGroup >
              <ControlLabel>Keywords</ControlLabel>
              <ListGroup className="list-group-keywords">
                {this.state.keywords.map(function(keyword, index) {
                  return(<ListGroupItem value={keyword} key={keyword + index}>{keyword}</ListGroupItem>)
                })}
              </ListGroup>
            </FormGroup>
          </Form>
        
    )
  }

  renderSuggestions() {
    return(
      <div>
        { this.state.keywords ? 
          <div>
            <FormGroup>
              <ControlLabel>Suggestions</ControlLabel>
              <Suggestions keywords={this.state.keywords} contactId={this.props.contact.id || -1}/>
            </FormGroup>
          </div> : ''}
      </div>
    );
  }

  renderModal() {
    return(
      <div>
        <Modal.Header closeButton>
          <Modal.Title id="event-modal-title">
            <b>{this.props.contact.firstname}</b> {this.props.contact.surname}
          </Modal.Title>
          <Modal.Body>
            {this.renderDetails()}
            {this.renderSuggestions()}
          </Modal.Body>
        </Modal.Header>
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