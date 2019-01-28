import React, { Component } from 'react';
import { Modal, Button, Form, ControlLabel, FormGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Suggestions from './../Suggestions/Suggestions';
import { getAPI } from '../../lib/apiCall-lib';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';

import './ContactModal.css'

class ContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = { keywords: [], loaded: false }
  }

  gotKeywordsCallback = (tags) => {
    let keywords = Object.keys(tags).reduce(function (r, k) {
      return r.concat(tags[k]['tag']);
    }, []);
    this.setState({keywords: keywords, loaded: true});
    this.props.onGotTags(keywords);
  }

  componentDidUpdate(prevProps) {
    let contact = this.props.contact;
    if(contact !== prevProps.contact) {
      if(contact.firstname !== '') {
        let body = {'queryStringParameters': { 'contactId': contact.id }}
        getAPI('tags', this.gotKeywordsCallback, body);
      }
      this.setState({keywords: []});
    }
  }

  onClose = () => {
    this.props.onClose();
    this.setState({loaded: false});
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
    /* Should improve to make suggestions more effiecient, get keywords and suggestions at the same time */
    return(
      <div>
        { this.state.keywords ? 
          <div>
            <Suggestions keywords={this.state.keywords} contact={this.props.contact || {}}/>
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
        {
          !this.state.loaded ? 
            <LoadingIcon />
          : 
            <Modal.Body>
              {this.renderDetails()}
              {this.renderSuggestions()}
            </Modal.Body>
        }
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={this.onClose}>Close</Button>
          <Button onClick={this.onEdit} disabled={!this.state.loaded}  bsStyle="info">Edit</Button>
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