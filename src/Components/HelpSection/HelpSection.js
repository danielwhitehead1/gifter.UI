import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { Jumbotron } from 'react-bootstrap';
import './HelpSection.css'

class HelpSection extends Component {
  render() {
    return(
      <div>
        <Typography variant="h2" className='help-heading' gutterBottom>
          Help
        </Typography>
        <p className='help-body1'>
          Here you can find a few simple first steps to get started, this should help you get some contacts set up and start getting recommended gifts.
          Each section below describes how you can go about setting up each section. We recommend you start with the contacts and work from there.
        </p>
        <div className='expansion-panels'>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h4'>Contacts</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className='expansion-details'>
              <p className='expansion-body'>
                A good place to start is to add some contacts.
              </p>
              <br />
              <ul>
                <li>First go to Contacts on the menu bar at the top.</li>
                <li>Click the red 'Add Contact' button.</li>
                <li>Fill in all the fields and add as many keywords as possible.</li>
                <li>Click the blue 'Create Contact' button to confirm the contact.</li>
              </ul>
              <p className='expansion-body'>
                As soon as you've added a contact you can click on them and start getting suggestions straight away.
              </p>
              <p className='expansion-body'>
                The contacts can then be edited or deleted by selecting a contact and clicking the blue 'Edit' button.
              </p>
              <p className='expansion-body'>
                Once you have some contacts you can start adding their events.
              </p>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h4'>Events</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className='expansion-details'>
              <p className='expansion-body'>
                Now you can start filling your calendar.
              </p>
              <ul>
                <li>First go to Calendar on the menu bar at the top.</li>
                <li>Click the red 'Create Event' button.</li>
                <li>Fill in as many fields as you need (some are compulsary).</li>
                <li>If you've already added some contacts you should see them in a dropdown</li>
                <li>Click the blue 'Create Event' button to confirm the event.</li>
              </ul>
              <p className='expansion-body'>
                If you have associated a contact with the event then you will see the suggestions for that contact in the event details.
              </p>
              <p className='expansion-body'>
                The events can then be edited or deleted by selecting an event and clicking the blue 'Edit' button.
              </p>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h4'>Suggestions</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className='expansion-details'>
              <p className='expansion-body'>
                The suggestions that are given heavily rely on the keywords that you give for each contact. The more keywords the more
                accurate and useful the suggestions will be.
              </p>
              <Typography variant='h4'>Favourites</Typography>
              <p className='expansion-body'>
                By clicking the heart on suggestions they will be saved and appear in the favourites section. By favouriting suggestions
                you show which suggestions are the most useful, this will in turn result in better suggestions in the browse suggestions.
              </p>
              <Typography variant='h4'>Suggestions</Typography>
              <p className='expansion-body'>
                The suggestions that are given here completely rely on information about the contact, so the more keywords you add for each 
                contact the more varied and useful the suggestions here will be.
              </p>
              <Typography variant='h4'>Browse</Typography>
              <p className='expansion-body'>
                This section uses your ratings and favourites to compare your contacts interests to other similar users. Similar contacts are 
                used to find categorys and suggestions that should be useful for your contact.
              </p>
              <Typography variant='h4'> TLDR </Typography>
              <p className='expansion-body'>
                Add as many keywords, rate as many products and favourite the good ones to get the best range of suggestions.
              </p>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h4'>Other</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className='expansion-details'>
              <p className='expansion-body'>
                Any other help needed.
              </p>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>  
      </div>
    )
  }
}

export default HelpSection