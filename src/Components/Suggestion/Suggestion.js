import React, { Component } from 'react';
import Rating from './../Rating/Rating';
import { updateAPI } from './../../lib/apiCall-lib';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteForever from '@material-ui/icons/DeleteForever'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import './Suggestion.css'

class Suggestion extends Component {
  onRating = (rating) => {
    let body = {
      'body': {
        'rating' : {
          [this.props.item.category]: rating, //Need to get category and store in each suggestion
        },
        'contact': {
          'id': this.props.contactId
        },
        'item': {
          'id': this.props.item.itemId
        }
      }
    }
    updateAPI('ratings', body);
    this.props.onRatingGivenCallback(this.props.item);
  }

  renderFavourite() {
    return(
      <IconButton 
        aria-label="Add to favorites"
        onClick={() => this.props.saveSuggestion(this.props.item) }
        className='action-btns'>
        <FavoriteIcon/>
      </IconButton>
    )
  }

  render() {
    return(
      <Card className='card'>
        <CardHeader
          title={this.props.item.title}
          subheader={this.props.item.seller}
          className='card-header'
        />
        <CardContent className='card-content'>
        <div className='card-upper-content'>
          <CardMedia
            image={this.props.item.imgURL}
            title={this.props.item.title}
            className='suggestion-img'
          />
          <div className='suggestion-text'>
            <Typography component="h2" variant="display1" className='suggestion-body'>
              View this on <a className='suggestion-link' href={this.props.item.url} rel="noopener noreferrer" target="_blank">{this.props.item.seller.charAt(0).toUpperCase() + this.props.item.seller.slice(1)}</a>
            </Typography>
          </div>
        </div>
          <div className='card-lower-content'>
            <IconButton 
              onClick={() => this.props.removeSuggestion(this.props.item.itemId, this.props.item.seller)} 
              aria-label="Add to favorites"
              >
              <DeleteForever />
            </IconButton>
            {
              this.props.item.saved === 0 ? 
                this.renderFavourite()
                :
                ''
            }
            {
              this.props.item.rated === 0 ? 
                <Rating onChange={this.onRating}/>
                :
                ''
            } 
          </div>
        </CardContent>
        </Card>
    )
  }
}

export default Suggestion;