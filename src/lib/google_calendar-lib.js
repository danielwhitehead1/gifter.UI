import gapi from 'gapi-client';
import credentials from '../credentials';


//On load, called to load the auth2 library and API client library.
gapi.load('client:auth2', initClient);
 
// Initialize the API client library
export function initClient() {
  gapi.client.init({
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    clientId: credentials.client_id,
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly'
  }).then(function () {
    // do stuff with loaded APIs
    console.log('it worked');
  });
}