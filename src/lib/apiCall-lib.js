//Need to move all api calls into one library
// ones where callback is called simply
// have get post delete update requests
import { Auth, API} from 'aws-amplify';

export function postAPI(path, body, callback, errorCallback) {
  debugger;
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {   
      API.post("prod-gifter-api", `/${path}`, body).then(callback);
    })
    .catch(errorCallback);
  } catch (e) {
    alert(e);
  }
}

export function getAPI(path, callback, body) {
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {   
      API.get("prod-gifter-api", `/${path}`, body).then(callback);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}

export function updateAPI(path, body, callback, errorCallback) {
  try {
    Auth.currentAuthenticatedUser()
    .then(() => { 
      API.put("prod-gifter-api", `/${path}`, body).then(callback).catch(errorCallback);
    })
    .catch(errorCallback);
  } catch (e) {
    alert(e);
  }  
}