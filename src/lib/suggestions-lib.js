import { API, Auth } from 'aws-amplify';
import config from './../config';

const jsonp = require("jsonp");

export function getNewSuggestion(keywords, callback) {
  let keywordsString = keywords.join(" ");
  let reqBody = {'queryStringParameters': { 'keywords': keywordsString }};
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {
      API.get("prod-gifter-api", "/keywords", reqBody).then((result) => callEbayApi(result, callback));
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}

export function getSuggestions(id, callback) {
  let reqBody = {'queryStringParameters': { 'contactId': id }}
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {
      API.get("prod-gifter-api", "/suggestions", reqBody).then(callback);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}

export function addSuggestion(item, contactId) {
  let body = {
    'body': {
      'title': item.title,
      'url': item.url,
      'contactId': contactId,
      'itemId': parseInt(item.itemId)
    }
  }
  try {
    Auth.currentAuthenticatedUser()
    .then(() => {
      API.post("prod-gifter-api", "/suggestions", body);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}

export function removeSuggestion(id, contactId) {
  let body = {
    'body': {
      'itemId': id,
      'contactId': contactId
    }
  }
  try {
    Auth.currentAuthenticatedUser()
    .then(async () => {
      API.del("prod-gifter-api", "/suggestions", body);
    })
    .catch(err => console.log(err));
  } catch (e) {
    alert(e);
  }
}

function callEbayApi(keywords, callback) {
  var url = "http://svcs.ebay.com/services/search/FindingService/v1";
      url += "?OPERATION-NAME=findItemsByKeywords";
      url += "&SERVICE-VERSION=1.0.0";
      url += `&SECURITY-APPNAME=${config.ebayAPI.APPNAME}`;
      url += `&GLOBAL-ID=${config.ebayAPI.GLOBAL_ID}`;
      url += "&RESPONSE-DATA-FORMAT=JSON";
      url += "&REST-PAYLOAD";
      url += "&paginationInput.entriesPerPage=1";
      url += `&affiliate.trackingId=${config.ebayAPI.CAMPAIGN_ID}&affiliate.networkId=9`
      url += `&keywords=${keywords.replace(" ", "%20")}`;
  jsonp(url, callback);
}