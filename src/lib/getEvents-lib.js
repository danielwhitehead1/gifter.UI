import {Auth, API} from 'aws-amplify'

export function getEvents(callback) {
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {   
      API.get("prod-gifter-api", "/events").then(callback);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}