import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';

import './Suggestion.css'

class Suggestion extends Component {
  render() {
    return(
    <div className="modal-body">
      <Panel>
        <Panel.Heading componentClass="h3">{this.props.title}</Panel.Heading>
        <Panel.Body>Some product info
          <Button className="link-btn" bsStyle='info' href={this.props.url} target="_blank">URL</Button>
          <Button className="remove-btn" bsStyle='warning' onClick={() => this.props.removeSuggestion(this.props.id)}>Remove</Button>
        </Panel.Body>
      </Panel>
    </div>
    )
  }
}

export default Suggestion;