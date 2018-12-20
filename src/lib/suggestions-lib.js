import { API, Auth } from 'aws-amplify';
import { postAPI, getAPI } from './apiCall-lib';
import config from './../config';

const jsonp = require("jsonp");

export function getNewSuggestion(keywords, callback) {
  let keywordsString = keywords.join(" ");
  let reqBody = {'queryStringParameters': { 'keywords': keywordsString }};
  getAPI('keywords', (result) => callEbayApi(result, callback), reqBody);
}

export function addSuggestion(item, contactId) {
  let body = {
    'body': {
      'title': item.title,
      'url': item.url,
      'contactId': contactId,
      'itemId': parseInt(item.itemId),
      'source': item.source
    }
  }
  postAPI('suggestions', body);
}

export function removeSuggestion(id, contactId, source) {
  let body = {
    'body': {
      'itemId': id,
      'contactId': contactId,
      'source': source
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

function callEtsyApi(keywords, callback) {
  var url = "https://openapi.etsy.com/v2/listings/active.js?api_key=6odgex425apdv9mxokh836e5";
      url += '&limit=1';
      url += `&keywords=${keywords}`;
  jsonp(url, callback);
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