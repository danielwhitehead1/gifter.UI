import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';
import starLogo from './../../Icons/star.png';

import './Suggestion.css'

class Suggestion extends Component {
  render() {
    return(
    <div className="modal-body">
      <Panel>
        <Panel.Heading componentClass="h3">{this.props.item.title}</Panel.Heading>
        <img src={this.props.item.imgURL} alt='suggestions' />
        <Panel.Body>Some product info
          <Button className="link-btn" bsStyle='info' href={this.props.item.url} target="_blank">URL</Button>
          <Button className="remove-btn" bsStyle='warning' onClick={() => this.props.removeSuggestion(this.props.item.itemId, this.props.item.seller)}>Remove</Button>
          {
            this.props.item.saved === '0' ? 
              <button className='favourite-btn'>
                <img className='star-img' src={starLogo} alt='star to favourite' onClick={() => this.props.saveSuggestion(this.props.item)}/>
              </button>
              :
              ''
          }          
        </Panel.Body>
      </Panel>
    </div>
    )
  }
}

export default Suggestion;