import { postAPI, getAPI, updateAPI, delAPI } from './apiCall-lib';
import config from './../config';

const jsonp = require("jsonp");
const axios = require("axios");

export function getNewSuggestion(keywords, gender, callback) {
  let keywordsString = keywords.join(" ");
  let reqBody = {'queryStringParameters': { 'keywords': keywordsString, 'gender': gender }};
  getAPI(
    'keywords', 
    (result) => callApi(result, callback),
    reqBody);
}

export function addSuggestion(item, contactId) {
  let body = getBody(item, contactId);
  postAPI('suggestions', body);
}

export function updateSuggestion(item, contactId) {
  let body = getBody(item, contactId);
  updateAPI('suggestions', body);
}

export function removeSuggestion(id, contactId, seller) {
  let body = {
    'body': {
      'itemId': id,
      'contactId': contactId,
      'seller': seller
    }
  }
  delAPI('suggestions', body)
}

function getBody(item, contactId) {
  return({
    'body': {
      'title': item.title,
      'url': item.url,
      'contactId': contactId,
      'itemId': item.itemId,
      'seller': item.seller,
      'saved': item.saved,
      'imgURL': item.imgURL,
      'category': item.category
    }
  })
}

function callApi(result, callback) {
  // TEMPORARY NEED TO ADD SOURCES TO A YML FILE
  let keywords = result.keywords
  let source = result.source;
  switch(source) {
    case 'ebay':
      callEbayApi(keywords, (err, data) => { callback(err, data, source) });
      break;
    case 'etsy': 
      callEtsyApi(keywords, (err, data) => { callback(err, data, source) });
      break;
    case 'ticketmaster':
      callTicketMasterApi(keywords, (response) => { callback(null, response, source) });
      break;
    default:
      console.log(`Source: ${source} not found.`);  
  }
} 

function callEtsyApi(keywords, callback) {
  var url = 'https://openapi.etsy.com/v2/listings/active.js?';
      url += `api_key=${config.etsyAPI.API_KEY}`;
      url += '&limit=1';
      url += '&sort_on=score';
      url += "&includes=MainImage";
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
      url += '&outputSelector(0)=CategoryHistogram';
      // url += '&itemFilter(0).name=Condition'
      // url += '&itemFilter(0).value0=New'
      url += "&paginationInput.entriesPerPage=1";
      url += `&affiliate.trackingId=${config.ebayAPI.CAMPAIGN_ID}&affiliate.networkId=9`
      url += `&keywords=${keywords.replace(" ", "%20")}`;
  jsonp(url, callback);
}

function callTicketMasterApi(keywords ,callback) {
  var url = 'https://app.ticketmaster.com/discovery/v2/events.json?'
      url += 'size=1&page=1'
      url += `&apikey=${config.TMAPI.API_KEY}`
      url += '&countryCode=GB'
      url += `&keyword=${keywords}`
  axios.get(url).then(callback).catch((error) => {
      console.log(`Ooops something went wrong, our bad! Error: ${error}`);
    })
}