import { Auth, API} from 'aws-amplify';

export function postAPI(path, body, callback, errorCallback) {
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {   
      API.post("prod-gifter-api", `/${path}`, body).then(callback).catch(errorCallback);
    })
    .catch(errorCallback);
  } catch (e) {
    alert(e);
  }
}

export function getAPI(path, callback, body, errorCallback) {
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {   
      API.get("prod-gifter-api", `/${path}`, body).then(callback).catch(errorCallback);
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
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }  
}

export function delAPI(path, body, callback, errorCallback) {
  try {
    Auth.currentAuthenticatedUser()
    .then(async () => {
      API.del("prod-gifter-api", `/${path}`, body).then(callback).catch(errorCallback);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}