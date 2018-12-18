import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.css";

const localizer = BigCalendar.momentLocalizer(moment) 

class MyCalendar extends Component {
  render() {
    return(
      <div className="calendar">
        <BigCalendar
          onSelectEvent={this.props.eventClick}
          localizer={localizer}
          events={this.props.events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "day"]}
        />
      </div>
    );
  }
}
export default MyCalendar;