import {Auth, API} from 'aws-amplify';

export function getContacts(callback) {
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {   
      API.get("prod-gifter-api", "/contacts").then(callback);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}