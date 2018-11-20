import React, { Component } from 'react';
import ContactList from './../../Components/ContactList/ContactList';
import EditContactModal from './../../Components/EditContactModal/EditContactModal';
import ContactModal from './../../Components/ContactModal/ContactModal';
import { Auth, API } from 'aws-amplify';
import { Button } from 'react-bootstrap';
import "./Contacts.css";

class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editContactModalOpen: false,
      contactModalOpen: false,
      currentContact: this.blankContact(),
      contacts: []
    }
  }

  componentDidMount() {
    this.getContacts();
  }

  async getContacts() {
    try {
      var contacts = await Auth.currentAuthenticatedUser()
      .then(async () => {   
        return await API.get("prod-gifter-api", "/contacts");
      })
      .catch(err => console.log(err));
    } catch (e) {
      alert(e);
    }
    this.setState({ contacts: contacts });
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
    this.getContacts();
  }

  addContact = () => {
    this.setState({editContactModalOpen: true})
  }

  onCloseEdit = () => {
    this.setState({
      currentContact: this.blankContact(),
      editContactModalOpen: false
    })
  }

  onClose = () => {
    this.setState({
      currentContact: this.blankContact(),
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
 
  render() {
    return(
      <div className="centered-content">
        <ContactList 
          contacts={this.state.contacts || []}
          contactClick={this.contactClick}/>
        <EditContactModal 
          show={this.state.editContactModalOpen} 
          onClose={this.onCloseEdit} 
          updateContacts={this.updateContacts}
          contact={this.state.currentContact}/>
        <ContactModal 
          show={this.state.contactModalOpen} 
          onClose={this.onClose} 
          contact={this.state.currentContact}
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
    )
  }
}
export default Contacts