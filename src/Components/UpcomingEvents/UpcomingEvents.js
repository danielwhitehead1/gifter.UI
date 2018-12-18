import React, { Component } from 'react';
import { ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';

import './UpcomingEvents.css';

class UpcomingEvents extends Component {

  daysToEvent(startDate) {
    let dateToday = new Date();
    let one_day = 1000*60*60*24, today_ms = dateToday.getTime(), start_ms = startDate.getTime();
    let difference_ms = start_ms - today_ms;
    let daysLeft = Math.round(difference_ms/one_day);
    let value = '';
    switch(daysLeft) {
      case 0:
        value = 'Today'
        break;
      case 1:
        value = 'Tomorrow'
        break;
      default:
        value = `In ${daysLeft} days time`
  }
    return(value);
  }

  renderUpcoming() {
    return(
      <div>
        <PageHeader>
            Upcoming Events
          </PageHeader>
        <ListGroup>
          {this.props.events.map(function(e) {
            return(
              <ListGroupItem 
                header={e.title} 
                href='#' 
                onClick={() => this.props.onClick(e)}
                key={e.id}
              >
                {this.daysToEvent(e.start)}
              </ListGroupItem>);
          }, this)}
        </ListGroup>
      </div>
    )
  }

  render() {
    return(
      <div>
        {this.props.events.length > 0 ? this.renderUpcoming() : ''}
      </div>  
    )
  }
}
export default UpcomingEvents;