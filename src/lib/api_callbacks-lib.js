export function apiCallback(error, data, source) {
  let item = '';
  switch(source) {
    case 'ebay':
      item = onSuggestionReturnCallbackEbay(error, data);
      break;
    case 'etsy': 
      item = onSuggestionReturnCallbackEtsy(error, data);
      break;
    case 'ticketmaster':
      item = onSuggestionReturnCallBackTicketMaster(error, data);
      break;
    default:
      console.log(`Source: ${source} not found.`);  
  }
  return(item);
}

function onSuggestionReturnCallbackEtsy(err, data) {
  let item = '';
  if(data.ok) {
    if(data.count > 0) {
      item = data.results[0] || [];
      item = formatSuggestion(item.title, item.url, item.listing_id, 'etsy', item.MainImage.url_75x75, item.category_path[0].toLowerCase().replace(/\s/, '_'));
    }
  } else {
    console.log(data);
  }
  return item;
}

function onSuggestionReturnCallbackEbay(err, data) {
  let item = '';
  if(!err) {
    if(data.findItemsByKeywordsResponse[0].searchResult[0].item) {
      item = data.findItemsByKeywordsResponse[0].searchResult[0].item[0] || [];
      item = formatSuggestion(item.title, item.viewItemURL[0], item.itemId[0], 'ebay', item.galleryURL[0], item.primaryCategory[0].categoryName[0].toLowerCase().replace(/\s/g, '_').replace(/&/g, 'and').replace(/,/g, '').replace(/\//, '_'));
    }
  } else {
    console.log(`Oops something went wrong, our bad! Error: ${err}`);
  }
  return(item);
}

function onSuggestionReturnCallBackTicketMaster(response) {
  let item = '';
  if(response.data._embedded) {
    item = response.data._embedded["events"][0];
    item = formatSuggestion(item.name, item.url, item.id, 'ticketmaster', item.images[0]["url"]);
  }
  return(item);
}

function formatSuggestion(title, url, id, seller, imgURL, category) {
  return({
    'title': title,
    'url': url,
    'itemId': id,
    'seller': seller,
    'saved': 0,
    'rated': 0,
    'imgURL': imgURL,
    'category': category
  })
}