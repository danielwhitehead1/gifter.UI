import React, { Component } from 'react';
import { FormGroup, Tab, Tabs} from 'react-bootstrap';
import Suggestion from './../Suggestion/Suggestion';
import LoadingIcon from './../../Components/LoadingIcon/LoadingIcon';

import { addSuggestion, removeSuggestion, getNewSuggestion, updateSuggestion } from '../../lib/suggestions-lib';
import { apiCallback } from '../../lib/api_callbacks-lib';
import { getAPI } from './../../lib/apiCall-lib';
import { CardDeck } from 'reactstrap';
import Typography from '@material-ui/core/Typography';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      savedSuggestions: [],
      similarSuggestions: [],
      suggestionsLoading: true,
      key: 'favourites'
    }
  }

  componentDidMount() {
    let reqBody = {'queryStringParameters': { 'contactId': this.props.contact.id }};
    getAPI('suggestions', this.onGotSuggestionsCallback, reqBody);
  }

  getSuggestion() {
    getNewSuggestion(this.props.keywords, this.props.contact.gender, this.apiSuggestionCallback);
  }

  onGotSuggestionsCallback = (results) => {
    let savedSuggestions = [];
    let similarSuggestions = [];
    let suggestions = [];
    let result;
    for(result of results) {
      if(result.saved === 1) {
        savedSuggestions.push(result);
      } else if(result.similarSuggestion === 1) {
        similarSuggestions.push(result);
      } else {
        suggestions.push(result);
      }
    }
    if(results.length < 3) {
      this.getSuggestion();
    }
    this.setState({
        suggestions: suggestions,
        savedSuggestions: savedSuggestions,
        similarSuggestions: similarSuggestions,
        suggestionsLoading: false
      });
  }

  addItem(item) {
    let items = this.state.suggestions;
    items.push(item);
    this.setState({suggestions: items});
    if(this.state.suggestions.length < 3) { 
      this.getSuggestion();
    }
    addSuggestion(item, this.props.contact.id);
  }

  apiSuggestionCallback = (err, data, source) => {
    let item = apiCallback(err, data, source);
    if(item === '') {
      this.getSuggestion();
    } else {
      this.addItem(item)
    }
  }

  removeSuggestion = (id, seller) => {
    let suggestions = this.state.suggestions;
    let savedSuggestions = this.state.savedSuggestions;
    let similarSuggestions = this.state.similarSuggestions;
    let newSuggestions = [];
    let newSavedSuggestions = [];
    let newSimilarSuggestions = [];
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
    similarSuggestions.forEach(element => {
      if(element.itemId !== id) {
        newSimilarSuggestions.push(element);
      }
    });
    // Remove suggestion from db
    removeSuggestion(id, this.props.contact.id, seller)
    this.setState({suggestions: newSuggestions, savedSuggestions: newSavedSuggestions, similarSuggestions: newSimilarSuggestions});
    if(newSuggestions.length < 3) { 
      this.getSuggestion();
    }
  }

  saveSuggestion = (item) => {
    let suggestions = this.updateSuggestion(item, 'saved', 1);
    if(suggestions.length < 3) { 
      this.getSuggestion();
    }
  }

  updateSuggestion(item, property, value) {
    item[property] = value
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
    return(suggestions);
  }

  ratingGiven = (item) => {
    let suggestions = this.state.suggestions;
    let savedSuggestions = this.state.savedSuggestions;
    let similarSuggestions = this.state.similarSuggestions;
    let newSuggestions = [];
    let newSavedSuggestions = [];
    let newSimilarSuggestions = [];
    suggestions.forEach(element => {
      if(element.itemId === item.itemId) {
        element.rated = 1;
      }
      newSuggestions.push(element);
    });
    savedSuggestions.forEach(element => {
      if(element.itemId === item.itemId) {
        element.rated = 1;
      }
      newSavedSuggestions.push(element);
    });
    similarSuggestions.forEach(element => {
      if(element.itemId === item.itemId) {
        element.rated = 1;
      }
      newSimilarSuggestions.push(element);
    });
    this.setState({suggestions: newSuggestions, savedSuggestions: newSavedSuggestions, similarSuggestions: newSimilarSuggestions});
    //Set item rating to 1 on the front end
  }

  suggestion(item, index) {
    return(
      <Suggestion 
        key={index}
        item={item}
        contactId={this.props.contact.id}
        removeSuggestion={this.removeSuggestion}
        saveSuggestion={this.saveSuggestion}
        onRatingGivenCallback={this.ratingGiven}
        />
    )
  }

  renderGroup(suggestions) {
    return(
      <FormGroup>
        <CardDeck>
          { suggestions.map(function(item, index) {
            return(this.suggestion(item, index));
            }, this) }
        </CardDeck>
      </FormGroup>
    )
  }

  renderSuggestions() {
    return(
      <Tabs
        id="controlled-tab-example"
        activeKey={this.state.key}
        onSelect={key => this.setState({ key })}
      >
        <Tab eventKey="favourites" title="Favourites">
        {
          this.state.savedSuggestions.length > 0 ? 
            this.renderGroup(this.state.savedSuggestions)
            :
            <Typography component="h2" variant="display1">
            Nothing favourited! Click the heart to favourite suggestions.
            </Typography>
        }
        </Tab>
        <Tab eventKey="suggestions" title="Suggestions">
        {
          this.state.suggestions.length > 0 ?
            this.renderGroup(this.state.suggestions)
            :
            <Typography component="h2" variant="display1">
            We're trying hard...
            </Typography>
        }
        </Tab>
        <Tab eventKey="similar" title="Browse">
        {
          this.state.similarSuggestions.length > 0 ?
            this.renderGroup(this.state.similarSuggestions)
            :
            <Typography component="h2" variant="display1">
            The more you rate and favourite suggestions the more people we can find who are similar! 
            </Typography>
        }
        </Tab>
      </Tabs>
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
      </div>
    )
  }
}

export default Suggestions