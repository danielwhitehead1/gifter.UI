import React, { Component } from 'react';
import ReactLoading from 'react-loading';

class LoadingIcon extends Component {
  render() {
    return(
      <ReactLoading type={'bars'} color={"#7F8C8D"} className="loading-icon" />
    )
  }
}

export default LoadingIcon;