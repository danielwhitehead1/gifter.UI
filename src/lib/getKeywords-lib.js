import {Auth, API} from 'aws-amplify';

export function getKeywords(contactId, callback) {
  try {
    let reqBody = {'queryStringParameters': { 'contactId': contactId }}
    Auth.currentAuthenticatedUser()
    .then(() => {
      API.get("prod-gifter-api", "/tags", reqBody).then((tags) => callback(tags));
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}