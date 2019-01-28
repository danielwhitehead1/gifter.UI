import React, { Component } from 'react';
import ContactList from './../../Components/ContactList/ContactList';
import EditContactModal from './../../Components/EditContactModal/EditContactModal';
import ContactModal from './../../Components/ContactModal/ContactModal';
import Navbar from './../../Components/Navbar/Navbar';
import { Button } from 'react-bootstrap';
import { getAPI } from './../../lib/apiCall-lib';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';
import "./Contacts.css";

class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editContactModalOpen: false,
      contactModalOpen: false,
      currentContact: this.blankContact(),
      currentTags: [],
      contacts: [],
      contactsLoading: true
    }
  }

  componentDidMount() {
    getAPI('contacts', this.onGotContactsCallback);
  }

  onGotContactsCallback = (contacts) => {
    this.setState({ contacts: contacts, contactsLoading: false });
  }

  blankContact() {
    return(
      {
        firstname: '',
        surname: '',
        keywords: []
      }
    )
  }

  updateContacts = () => {
    getAPI('contacts', this.onGotContactsCallback);
  }

  addContact = () => {
    this.setState({editContactModalOpen: true})
  }

  onCloseEdit = () => {
    this.setState({
      currentContact: this.blankContact(),
      currentTags: [],
      editContactModalOpen: false
    })
  }

  onClose = () => {
    this.setState({
      currentContact: this.blankContact(),
      currentTags: [],
      contactModalOpen: false
    })
  }

  onEdit = () => {
    this.setState({
      contactModalOpen: false,
      editContactModalOpen: true
    })
  }

  contactClick = (currentContact) => {
    this.setState({
      currentContact: currentContact,
      contactModalOpen: true 
    })
  }

  onGotTags = (tags) => {
    this.setState({currentTags: tags})
  }
 
  render() {
    return(
      <div>
        <Navbar 
            isAuthenticated={this.props.isAuthenticated}
            userHasAuthenticated={this.props.userHasAuthenticated}
          />
        <div className="centered-content">
          {
            this.state.contactsLoading ?
            <LoadingIcon />
            :

            <ContactList 
              contacts={this.state.contacts || []}
              contactClick={this.contactClick}
              />
          }
          <EditContactModal 
            show={this.state.editContactModalOpen} 
            onClose={this.onCloseEdit} 
            updateContacts={this.updateContacts}
            contact={this.state.currentContact}
            keywords={this.state.currentTags}
            />
          <ContactModal 
            show={this.state.contactModalOpen} 
            onClose={this.onClose} 
            contact={this.state.currentContact}
            onGotTags={this.onGotTags}
            onEdit={this.onEdit}
            /> 
          <Button 
            bsStyle="primary"
            className="create-btn"
            onClick={this.addContact}
          >
            Add Contact
          </Button>
        </div>
      </div>
    )
  }
}
export default Contacts