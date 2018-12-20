import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Suggestion from './../Suggestion/Suggestion';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';

import { addSuggestion, removeSuggestion, getNewSuggestion } from '../../lib/suggestions-lib';
import { getAPI } from './../../lib/apiCall-lib';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      suggestionsLoading: true
    }
  }

  componentDidMount() {
    let reqBody = {'queryStringParameters': { 'contactId': this.props.contactId }};
    getAPI('suggestions', this.onGotSuggestionsCallback, reqBody);
  }

  onGotSuggestionsCallback = (result) => {
    this.setState({suggestions: result, suggestionsLoading: false});
  }

  formatSuggestion(title, url, id, source) {
    return({
      'title': title,
      'url': url,
      'itemId': id,
      'source': source
    })
  }

  addItem(item) {
    let items = this.state.suggestions;
    items.push(item);
    this.setState({suggestions: items});
    addSuggestion(item, this.props.contactId);
  }

  onSuggestionReturnCallbackEtsy = (err, data) => {
    if(data.ok) {
      var item = data.results[0] || [];
      item = this.formatSuggestion(item.title, item.url, item.listing_id, 'etsy')
      this.addItem(item);
    } else {
      console.log(data);
    }
  }

  onSuggestionReturnCallbackEbay = (err, data) => {
    if(!err) {
      if(data.findItemsByKeywordsResponse[0].searchResult[0].item) {
        var item = data.findItemsByKeywordsResponse[0].searchResult[0].item[0] || [];
        item = this.formatSuggestion(item.title, item.viewItemURL[0], item.itemId[0], 'ebay');
        this.addItem(item);
      } else {
        let reqBody = {'queryStringParameters': { 'keywords': this.props.keywords.join(" ") }};
        getNewSuggestion(this.props.keywords, this.onSuggestionReturnCallbackEbay);
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

  onClick = () => {
    getNewSuggestion(this.props.keywords, this.onSuggestionReturnCallbackEbay);
  }

  removeSuggestion = (id) => {
    let suggestions = this.state.suggestions;
    let newItems = [];
    suggestions.forEach(element => {
      if(element.itemId !== id) {
        newItems.push(element);
      }
    });
    // Remove suggestion from db
    removeSuggestion(id, this.props.contactId, this.props.source)
    this.setState({suggestions: newItems});
  }

  renderSuggestions() {
    return(
      <div>
        { this.state.suggestions.map(function(item, index) {
          return(<Suggestion 
            key={index}
            title={item.title} 
            id={item.itemId}
            url={item.url}
            source ={item.source}
            removeSuggestion={this.removeSuggestion}/>);
        }, this) }
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