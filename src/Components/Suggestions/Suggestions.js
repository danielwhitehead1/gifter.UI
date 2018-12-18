import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Suggestion from './../Suggestion/Suggestion';

import { getNewSuggestion, getSuggestions, addSuggestion, removeSuggestion } from '../../lib/suggestions-lib';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state ={
      suggestions: []
    }
  }

  async componentDidMount() {
    let id = this.props.contactId;
    getSuggestions(id, this.onGotSuggestionsCallback);
  }

  onGotSuggestionsCallback = (result) => {
    this.setState({suggestions: result});
  }

  formatSuggestion(suggestion) {
    return({
      'title': suggestion.title,
      'url': suggestion.viewItemURL[0],
      'itemId': suggestion.itemId[0]
    })
  }

  onSuggestionReturnCallback = (err, data) => {
    if(!err) {
      if(data.findItemsByKeywordsResponse[0].searchResult[0].item) {
        var item = data.findItemsByKeywordsResponse[0].searchResult[0].item[0] || [];
        let items = this.state.suggestions;
        item = this.formatSuggestion(item);
        items.push(item);
        this.setState({suggestions: items});
        addSuggestion(item, this.props.contactId);
      } else {
        getNewSuggestion(this.props.keywords, this.onSuggestionReturnCallback);
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
    getNewSuggestion(this.props.keywords, this.onSuggestionReturnCallback);
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
    removeSuggestion(id, this.props.contactId)
    this.setState({suggestions: newItems});
  }

  render() {
    return(
      <div>
        { this.state.suggestions.map(function(item, index) {
              return(
                <Suggestion 
                  key={index}
                  title={item.title} 
                  id={item.itemId}
                  url={item.url}
                  removeSuggestion={this.removeSuggestion}/>)
            }, this) }
        { this.props.keywords ?
          <div>
            <Button onClick={this.onClick}>Add Suggestion</Button>
          </div> : "" }
      </div>
    )
  }
}

export default Suggestions