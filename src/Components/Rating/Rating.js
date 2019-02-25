import React, { Component } from 'react';
import ReactRating from 'react-rating';
import Typography from '@material-ui/core/Typography';


import './Rating.css';

class Rating extends Component{
  render() {
    return(
      <div className='rating'>
        <Typography variant="body2" className='rating-caption'>
            How useful?
        </Typography>
        <ReactRating 
          className='rating'
          onChange={this.props.onChange}
          />
        </div>
        )
  }
}

export default Rating