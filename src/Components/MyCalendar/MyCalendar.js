import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.css";

const localizer = BigCalendar.momentLocalizer(moment) 

class MyCalendar extends Component {
  getEvents() {
    return(
      this.props.events.map(function(event) {
        return({ 
          id: event.id,
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.title,
          info: event.info,
          allDay: !!event.allDayEvent,
          contactId: event.contactId
        });
      })
    );
  }

  render() {
    let events = this.getEvents();
    return(
      <div className="calendar">
        <BigCalendar
          onSelectEvent={this.props.eventClick}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "day"]}
        />
      </div>
    );
  }
}
export default MyCalendar;