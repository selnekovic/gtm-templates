// v.1.1.0

const createQueue = require('createQueue');
const callInWindow = require('callInWindow');
const aliasInWindow = require('aliasInWindow');
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const makeTableMap = require('makeTableMap');
const makeNumber = require('makeNumber');
const getType = require('getType');
const copyFromDataLayer = require('copyFromDataLayer');
const math = require('Math');
const log = require('logToConsole');

const Object = require('Object'); // Maxlead modification

const initIds = copyFromWindow('_fbq_gtm_ids') || [];
const pixelIds = data.pixelId;
const standardEventNames = ['AddPaymentInfo', 'AddToCart', 'AddToWishlist', 'CompleteRegistration', 'Contact', 'CustomizeProduct', 'Donate', 'FindLocation', 'InitiateCheckout', 'Lead', 'PageView', 'Purchase', 'Schedule', 'Search', 'StartTrial', 'SubmitApplication', 'Subscribe', 'ViewContent'];
const ecommerce = copyFromDataLayer('ecommerce', 1);

// Helper methods
const fail = msg => {
  log(msg);
  data.gtmOnFailure();
};

const mergeObj = (obj, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj[key] = obj2[key];
    }
  }
  return obj;
};

const parseEecObj = prod => {
  return {
    id: prod.id,
    quantity: prod.quantity
  };
};

// Initialize EEC integration
let eventName, action, eecObjectProps;
if (data.enhancedEcommerce) {
  if (!ecommerce) return fail('Facebook Pixel: No valid "ecommerce" object found in dataLayer');
  if (ecommerce.detail) { eventName = 'ViewContent'; action = 'detail'; }
  else if (ecommerce.add) { eventName = 'AddToCart'; action = 'add'; }
  else if (ecommerce.checkout) { eventName = 'InitiateCheckout'; action = 'checkout'; }
  else if (ecommerce.purchase) { eventName = 'Purchase'; action = 'purchase'; }
  else return fail('Facebook Pixel: Most recently pushed "ecommerce" object must be one of types "detail", "add", "checkout" or "purchase".');
  
  if (!ecommerce[action].products || getType(ecommerce[action].products) !== 'array') return fail('Facebook pixel: Most recently pushed "ecommerce" object did not have a valid "products" array.');
  eecObjectProps = {
    content_type: 'product',
    contents: ecommerce[action].products.map(parseEecObj),
    value: ecommerce[action].products.reduce((acc, cur) => {
      const curVal = math.round(makeNumber(cur.price || 0) * (cur.quantity || 1) * 100) / 100;
      return acc + curVal;
    }, 0.0),
    currency: ecommerce.currencyCode || 'USD'
  };
  if (['InitiateCheckout', 'Purchase'].indexOf(eventName) > -1) eecObjectProps.num_items = ecommerce[action].products.reduce((acc,cur) => {
    return acc + makeNumber(cur.quantity || 1);
  }, 0);
}

// Build the fbq() command arguments

// ---------------------
// MAXLEAD MODIFICATION
// Changed cidParams from const to let and added if condition
let cidParams = data.advancedMatchingList && data.advancedMatchingList.length ? makeTableMap(data.advancedMatchingList, 'name', 'value') : {};

if (data.user_data && Object.keys(data.user_data).length >= 2) {
  const ud = data.user_data;
  
  // Manually assign each user_data property to cidParams using a for loop
  const userDataParams = {
    'em': ud.email || null,
    'ph': ud.phone_number || null,
    'fn': ud.address && ud.address[0] && ud.address[0].first_name || null,
    'ln': ud.address && ud.address[0] && ud.address[0].last_name || null,
    'ct': ud.address && ud.address[0] && ud.address[0].city || null,
    'st': ud.address && ud.address[0] && ud.address[0].region || null,
    'zp': ud.address && ud.address[0] && ud.address[0].postal_code || null,
    'cn': ud.address && ud.address[0] && ud.address[0].country || null,
  };

  for (let key in userDataParams) {
    if (userDataParams.hasOwnProperty(key)) {
      cidParams[key] = userDataParams[key];
    }
  }
}

// ---------------------

const objectProps = data.objectPropertyList && data.objectPropertyList.length ? makeTableMap(data.objectPropertyList, 'name', 'value') : {};
const objectPropsFromVar = getType(data.objectPropertiesFromVariable) === 'object' ? data.objectPropertiesFromVariable : {};
const mergedObjectProps = mergeObj(objectPropsFromVar, objectProps);
const finalObjectProps = mergeObj(eecObjectProps || {}, mergedObjectProps);
eventName = eventName || (data.eventName === 'custom' ? data.customEventName : (data.eventName === 'variable' ? data.variableEventName : data.standardEventName));

const command = standardEventNames.indexOf(eventName) === -1 ? 'trackSingleCustom' : 'trackSingle';
const consent = data.consent === false ? 'revoke' : 'grant';

// Utility function to use either fbq.queue[]
// (if the FB SDK hasn't loaded yet), or fbq.callMethod()
// if the SDK has loaded.
const getFbq = () => {
  // Return the existing 'fbq' global method if available
  let fbq = copyFromWindow('fbq');
  if (fbq) {
    return fbq;
  }
  
  // Initialize the 'fbq' global method to either use
  // fbq.callMethod or fbq.queue)
  setInWindow('fbq', function() {    
    const callMethod = copyFromWindow('fbq.callMethod.apply');
    if (callMethod) {           
      callInWindow('fbq.callMethod.apply', null, arguments); 
    } else {       
      callInWindow('fbq.queue.push', arguments);
    }
  });
  aliasInWindow('_fbq', 'fbq');
  
  // Create the fbq.queue
  createQueue('fbq.queue');
    
  // Return the global 'fbq' method, created above
  return copyFromWindow('fbq');
};

// Get reference to the global method
const fbq = getFbq();

fbq('consent', consent);

 // Set Data Processing Options
if (data.dpoLDU) {
  fbq('dataProcessingOptions', ['LDU'], makeNumber(data.dpoCountry), makeNumber(data.dpoState));
}

// Handle multiple, comma-separated pixel IDs,
// and initialize each ID if not done already.
pixelIds.split(',').forEach(pixelId => {
  if (initIds.indexOf(pixelId) === -1) {
    
    // If the user has chosen to disable automatic configuration
    if (data.disableAutoConfig) {
      fbq('set', 'autoConfig', false, pixelId);
    }
    
    // If the user has chosen to disable pushState and replaceState tracking
    if (data.disablePushState) {
      setInWindow('fbq.disablePushState', true);
    }
   	
    
    // Initialize pixel and store in global array
    fbq('init', pixelId, cidParams);

    // Monitoring agent string for Tag Setup
    fbq('set','agent','tmSimo-GTM-WebTemplate', pixelId);

    initIds.push(pixelId);
    setInWindow('_fbq_gtm_ids', initIds, true);
    
  }

  // Call the fbq() method with the parameters defined earlier
  if (data.eventId) {
    fbq(command, pixelId, eventName, finalObjectProps, {eventID: data.eventId});
  } else {
    fbq(command, pixelId, eventName, finalObjectProps);
  }
});

injectScript('https://connect.facebook.net/en_US/fbevents.js', data.gtmOnSuccess, data.gtmOnFailure, 'fbPixel');