import React, { Component } from 'react';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';
import Suggestion from './../Suggestion/Suggestion';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';

import { addSuggestion, removeSuggestion, getNewSuggestion, updateSuggestion, getEvents } from '../../lib/suggestions-lib';
import { getAPI } from './../../lib/apiCall-lib';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      savedSuggestions: [],
      suggestionsLoading: true
    }
  }

  componentDidMount() {
    let reqBody = {'queryStringParameters': { 'contactId': this.props.contact.id }};
    getAPI('suggestions', this.onGotSuggestionsCallback, reqBody);
  }

  onGotSuggestionsCallback = (results) => {
    let savedSuggestions = [];
    let suggestions = [];
    let result;
    for(result of results) {
      if(result.saved === '1') {
        savedSuggestions.push(result);
      } else {
        suggestions.push(result);
      }
    }
    this.setState({suggestions: suggestions, savedSuggestions: savedSuggestions, suggestionsLoading: false});
  }

  formatSuggestion(title, url, id, seller, imgURL) {
    return({
      'title': title,
      'url': url,
      'itemId': id,
      'seller': seller,
      'saved': 0,
      'imgURL': imgURL
    })
  }

  addItem(item) {
    let items = this.state.suggestions;
    items.push(item);
    this.setState({suggestions: items});
    addSuggestion(item, this.props.contact.id);
  }

  onSuggestionReturnCallbackEtsy = (err, data) => {
    if(data.ok) {
      var item = data.results[0] || [];
      item = this.formatSuggestion(item.title, item.url, item.listing_id, 'etsy', item.MainImage.url_75x75);
      this.addItem(item);
    } else {
      console.log(data);
    }
  }

  onSuggestionReturnCallbackEbay = (err, data) => {
    if(!err) {
      if(data.findItemsByKeywordsResponse[0].searchResult[0].item) {
        var item = data.findItemsByKeywordsResponse[0].searchResult[0].item[0] || [];
        debugger;
        item = this.formatSuggestion(item.title, item.viewItemURL[0], item.itemId[0], 'ebay', item.galleryURL[0]);
        debugger;
        this.addItem(item);
      } else {
        getNewSuggestion(
          this.props.keywords,
          this.props.contact.gender,
          this.onSuggestionReturnCallbackEbay
        );
      }
      // add suggestion to db
      /*
       * Item:
       *   condition => conditionId
       *   galleryURL 
       *   location 
       *   title 
       *   viewItemURL
       *   itemId  
       *   buyerSatisfaction???? 
       */
    } else {
    }
  }

  onSuggestionReturnCallBackTicketMaster = () => {
    debugger;
  }

  onClick = () => {
    getEvents(this.onSuggestionReturnCallBackTicketMaster);
    // getNewSuggestion(this.props.keywords, this.props.contact.gender, this.onSuggestionReturnCallbackEbay);
  }

  removeSuggestion = (id, seller) => {
    let suggestions = this.state.suggestions;
    let savedSuggestions = this.state.savedSuggestions;
    let newSuggestions = [];
    let newSavedSuggestions = [];
    suggestions.forEach(element => {
      if(element.itemId !== id) {
        newSuggestions.push(element);
      }
    });
    savedSuggestions.forEach(element => {
      if(element.itemId !== id) {
        newSavedSuggestions.push(element);
      }
    });
    // Remove suggestion from db
    removeSuggestion(id, this.props.contact.id, seller)
    this.setState({suggestions: newSuggestions, savedSuggestions: newSavedSuggestions});
  }

  saveSuggestion = (item) => {
    item.saved = 1;
    let suggestions = [];
    let savedSuggestions = this.state.savedSuggestions;
    this.state.suggestions.forEach( e => {
      if(e.itemId === item.itemId) {
        savedSuggestions.push(e);
      } else {
        suggestions.push(e);
      }
    })
    updateSuggestion(item, this.props.contact.id);
    this.setState({savedSuggestions: savedSuggestions, suggestions: suggestions});
  }

  renderSavedSuggestions() {
    return(
      <FormGroup>
        <ControlLabel>Favourites</ControlLabel>        
        { this.state.savedSuggestions.map(function(item, index) {
          return(<Suggestion 
            key={index}
            item={item}
            removeSuggestion={this.removeSuggestion}
            saveSuggestion={this.saveSuggestion}/>);
          }, this) }
      </FormGroup>
    );
  }

  renderNewSuggestions() {
    return(
      <FormGroup>
        <ControlLabel>Suggestions</ControlLabel>        
        { this.state.suggestions.map(function(item, index) {
          return(<Suggestion 
            key={index}
            item={item}
            removeSuggestion={this.removeSuggestion}
            saveSuggestion={this.saveSuggestion}/>);
        }, this) }
      </FormGroup>
    )
  }

  renderSuggestions() {
    return(
      <div>
        {
          this.state.suggestions.length > 0 ?
            this.renderNewSuggestions()
            :
            ''
        }
        {
          this.state.savedSuggestions.length > 0 ? 
            this.renderSavedSuggestions()
            :
            ''
        }
      </div>
    );
  }

  render() {
    return(
      <div>
        {
          this.state.suggestionsLoading ?
            <LoadingIcon />
          :
            this.renderSuggestions()
        }
        { this.props.keywords ?
          <div>
            <Button onClick={this.onClick}>Add Suggestion</Button>
          </div> : "" }
      </div>
    )
  }
}

export default Suggestions