import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Form, InputGroup, Radio } from 'react-bootstrap';
import LoaderButton from "../LoaderButton/LoaderButton";
import { API } from 'aws-amplify';
import { postAPI, updateAPI } from '../../lib/apiCall-lib';

const genders = Object.freeze({'male': 1, 'female': 1, 'pnts': 1, 'other': 0});

class EditContactModal extends Component {
  constructor(props) {
    super(props);
    let contact = props.contact;
    let otherGender = contact.gender ? !genders[contact.gender] : false;
    this.state = {
      firstname: contact.firstname,
      surname: contact.surname,
      gender: contact.gender,
      otherGender: otherGender,
      keywords: [],
      currentKeyword: '',
      selectedKeyword: '',
      isLoading: false,
      isDeleting: false
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.contact !== prevProps.contact || this.props.keywords !== prevProps.keywords) {
      let contact = this.props.contact;
      let keywords = this.props.keywords;
      let selectedKeyword = keywords.length > 0 ? keywords[0] : '';
      this.setState({
        firstname: contact.firstname,
        surname: contact.surname,
        gender: contact.gender,
        otherGender: contact.gender ? !genders[contact.gender] : false,
        keywords: keywords,
        selectedKeyword: selectedKeyword,
        currentKeyword: '',
        isLoading: false
      });
    }
  }

  closeModal = () => {
    this.setState({
      firstname: '',
      surname: '',
      gender: '',
      otherGender: false,
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

  handleRadioChange = event => {
    let otherGender = !genders[event.target.id];
    let gender = otherGender ? '' : event.target.id;
    this.setState({
      gender: gender,
      otherGender: otherGender
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

  genderActive(gender) {
    if(this.state.gender === gender) {
      return(true);
    }
    return(false);
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

  renderNewKeywordsField() {
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

  renderKeywordsField() {
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

  renderGenderField() {
    return(
      <div>
        <ControlLabel>Gender</ControlLabel>
        <FormGroup controlId="gender" onChange={this.handleRadioChange}>
          <Radio name="radioGroup" id="male" defaultChecked={this.genderActive('male')} inline>
            Male
          </Radio>{' '}
          <Radio name="radioGroup" id='female' defaultChecked={this.genderActive('female')} inline>
            Female
          </Radio>{' '}
          <Radio name="radioGroup" id='other' defaultChecked={this.state.otherGender} inline>
            Other
          </Radio>{'  '}
          <Radio name="radioGroup" id='pnts' defaultChecked={this.genderActive('pnts')} inline>
            Prefer not to say
          </Radio>
        </FormGroup>
          {
            this.state.otherGender ? 
              <FormGroup controlId='gender' bsSize='small' >
                <FormControl
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.gender}
                  placeholder="Please specify"
                  /> 
              </FormGroup>  
              :
                ''
          }
      </div>  
    )
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
          { this.renderGenderField() }
          { this.renderNewKeywordsField() }
          { this.renderKeywordsField() }
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