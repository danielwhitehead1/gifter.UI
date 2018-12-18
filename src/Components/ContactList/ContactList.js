import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Tabs, Tab } from 'react-bootstrap'

import "./ContactList.css";

class ContactList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: "A"
    }

    this.handleSelect = this.handleSelect.bind(this);
  }

  getAlph() {
    var a = [], i = 65, j = 90;
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
  }

  handleSelect(key) {
    this.setState({tab: key});
  }

  handleClick(contact) {
    this.props.contactClick(contact);
  }

  renderListGroup(tab, sortedContacts) {
    return(
      <ListGroup className="list-group-contacts">
        {sortedContacts[tab].map(function(contact) {
          return(
            <ListGroupItem 
              key={contact.id} 
              onClick={() => this.handleClick(contact)}><b>{contact.firstname}</b> {contact.surname}</ListGroupItem>)
        }, this)}
      </ListGroup>
    );
  }

  getSortedContacts() {
    let sortedContacts = {};
    let contacts = this.props.contacts;
    this.getAlph().map(function(alph) {
      return(sortedContacts[alph] = []);
    });
    contacts.map(function(contact) {
      return(sortedContacts[contact.firstname[0].toUpperCase()].push(contact)); 
    })
    return(sortedContacts);
  }

  render() {
    let sortedContacts = this.getSortedContacts();
    return(
      <div>
        <Tabs onSelect={this.handleSelect} id="alphabet-tabs">
          {this.getAlph().map(function(alph) {
            return(<Tab eventKey={alph} title={alph} key={alph}></Tab>)
          })}
        </Tabs>
        {this.renderListGroup(this.state.tab, sortedContacts)}
      </div>)
  }
}
export default ContactList