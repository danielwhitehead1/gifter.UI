import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Form, InputGroup } from 'react-bootstrap';
import LoaderButton from "../LoaderButton/LoaderButton";
import { API } from 'aws-amplify';
import { getAPI, postAPI, updateAPI } from '../../lib/apiCall-lib';

class EditContactModal extends Component {
  constructor(props) {
    super(props);
    let contact = props.contact;
    this.state = {
      firstname: contact.firstname,
      surname: contact.surname,
      gender: contact.gender,
      keywords: [],
      currentKeyword: '',
      selectedKeyword: '',
      isLoading: false,
      isDeleting: false
    }
  }

  gotKeywordsCallback = (tags) => {
    let keywords = Object.keys(tags).reduce(function (r, k) {
      return r.concat(tags[k]['tag']);
    }, []);

    this.setState({
      keywords: keywords,
      selectedKeyword: keywords[0]
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.contact !== prevProps.contact) {
      let contact = this.props.contact;
      if(contact.firstname !== '') {
        let body = {'queryStringParameters': { 'contactId': contact.id }};
        getAPI('tags', this.gotKeywordsCallback, body)
      }
      this.setState({
        firstname: contact.firstname,
        surname: contact.surname,
        currentKeyword: '',
        selectedKeyword: '',
        isLoading: false
      });
    }
  }

  closeModal = () => {
    this.setState({
      firstname: '',
      surname: '',
      gender: '',
      currentKeyword: '',
      selectedKeyword: '',
      isLoading: false,
      isDeleting: false,
      keywords: []
    })
    this.props.onClose()
  }

  validateForm() {
    return(
      this.state.firstname.length > 0
      && this.state.surname.length >0
    );
  }

  getBody() {
    return(
      {
        'body': {
          'contact': {
            'firstname': this.state.firstname,
            'surname': this.state.surname,
            'gender': this.state.gender
          },
          'keywords': this.state.keywords
        }
      }
    )
  }

  createdContactCallback = () => {
    this.props.updateContacts();
    this.closeModal();
    alert("Success")
  }

  errorCallback = () => {
    this.closeModal();
    alert("Something went wrong");
  }

  createContact = () => {
    this.setState({isLoading: true});
    let reqBody = this.getBody();
    postAPI('contacts', reqBody, this.createdContactCallback, this.errorCallback);
  }

  updateContact = () => {
    this.setState({isLoading: true});
    let reqBody = this.getBody();
    reqBody.body.contact['id'] = this.props.contact.id;
    updateAPI('contacts', reqBody, this.createdContactCallback, this.errorCallback)
  }

  deleteContact = () => {
    this.setState({isDeleting: true});
    let reqBody = { 'body': { 'id': this.props.contact.id }}
    API.del("prod-gifter-api", "/contacts", reqBody).then( response => {
      this.props.updateContacts();
      this.closeModal();
      alert("Contact deleted successfully")
    }).catch(error => {
      this.closeModal();
      alert("Something went wrong")
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleKeywordAdd = () => {
    let newKeywords = this.state.keywords;
    newKeywords.push(this.state.currentKeyword);
    this.setState({keywords: newKeywords, currentKeyword: ''});
  }

  handleKeywordDelete = () => {
    let newKeywords = this.state.keywords.map(function(keyword) {
      return( this.state.selectedKeyword === keyword ? false : keyword)
    }, this).filter(function(keyword) { return(!!keyword) })
    this.setState({keywords: newKeywords, selectedKeyword: newKeywords[0]});
  }

  createContactButtons() {
    return(
      <div>
        <Button onClick={this.closeModal}>Close</Button>
        <LoaderButton 
          bsStyle="primary" 
          isLoading={this.state.isLoading}
          onClick={this.createContact}
          text="Add contact"
          loadingText="Adding..." 
          disabled={!this.validateForm()}
        />
      </div>
    )
  }

  updateContactButtons() {
    return(
      <div>
        <LoaderButton 
          bsStyle="danger" 
          onClick={this.deleteContact}
          isLoading={this.state.isDeleting}
          text="Delete"
          loadingText="Deleting..."
        />
        <Button onClick={this.closeModal}>Close</Button>
        <LoaderButton 
          disabled={!this.validateForm()} 
          bsStyle="primary" 
          onClick={this.updateContact}
          isLoading={this.state.isLoading}
          text="Update contact"
          loadingText="Updating..."
        />
      </div>
    )
  }

  addKeywordsField() {
    return(
      <FormGroup controlId="currentKeyword">
        <ControlLabel>New Keyword</ControlLabel>
        <InputGroup>
          <FormControl
            type="text"
            onChange={this.handleChange}
            value={this.state.currentKeyword}
          />
          <InputGroup.Button>
            <Button onClick={this.handleKeywordAdd}>Add</Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }

  displayKeywordsField() {
    return(
      this.state.keywords.length > 0 ?
      <FormGroup controlId="selectedKeyword">
        <ControlLabel>Keywords</ControlLabel>
        <InputGroup>
          <FormControl 
            componentClass="select" 
            onChange={this.handleChange}
            value={this.state.selectedKeyword}
          >
            {this.state.keywords.map(function(keyword, index) {
              return(<option value={keyword} key={keyword + index}>{keyword}</option>)
            })}
          </FormControl>
          <InputGroup.Button>
            <Button onClick={this.handleKeywordDelete}>Delete</Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
       : '');
  }

  render() {
    return(
      <Modal show={this.props.show}>
      <Modal.Header>
        {this.props.contact.firstname === "" ? "Create" : "Update Contact"}
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup controlId="firstname" bsSize="large">
            <ControlLabel>Firstname</ControlLabel>
            <FormControl
              type="text"
              onChange={this.handleChange}
              value={this.state.firstname}
            />
          </FormGroup>
          <FormGroup controlId="surname" bsSize="large">
            <ControlLabel>Surname</ControlLabel>
            <FormControl
              type="text"
              onChange={this.handleChange}
              value={this.state.surname}
            />
          </FormGroup>
          {this.addKeywordsField()}
          {this.displayKeywordsField()}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {this.props.contact.firstname === "" ? this.createContactButtons() : this.updateContactButtons()}
      </Modal.Footer>
      </Modal>
    )
  }
}
export default EditContactModal