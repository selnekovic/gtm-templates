___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Local Storage Counter",
  "brand": {
    "id": "brand_dummy",
    "displayName": ""
  },
  "description": "Tag tracks user activity via localStorage: counts page views (pc), sessions (sc), flags new sessions (ns) after inactivity, and detects new users (nu).",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "timeInMillis",
    "displayName": "Session lenght in minutes",
    "simpleValueType": true,
    "defaultValue": 30
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

/**
Tag tracks user activity via localStorage: counts page views (pc), sessions (sc), flags new sessions (ns) after inactivity, and detects new users (nu).
**/

// v.1.0.0

const localStorage = require('localStorage');
const JSON = require('JSON');
const getTimestampMillis = require('getTimestampMillis');
const makeInteger = require('makeInteger');

let oN = 'mxl_sc';
let timeInMillis = data.timeInMillis * 60000;

if(localStorage) {
  // Retrieve or initialize the 'mxl_sc' object from localStorage.
  let o = JSON.parse(localStorage.getItem(oN)) || {};
  
  // Increment the page count 'pc' for each page load.
  let pc = makeInteger(o.pc) || 0;
  pc++;
  o.pc = pc;
  
  // Increment the session count 'sc' and timestamp 'ts' for user sessions.
  // Start a new session if none exists or if the last session timestamp exceeds 45 minutes.
  // New session assignment: artisma.ns = 'true'
  let sc = makeInteger(o.sc) || 0;
  if (sc === 0) {
    o.ts = getTimestampMillis();
    sc++;
    o.sc = sc;
    o.ns = 'true';
  } else {
    let sTs = o.ts;
    let cTs = getTimestampMillis();
    let td = cTs - sTs;
    
    // Check if the stored timestamp is older than timeInMillis variable (defualt 30 min)
    if (td > timeInMillis) { 
      o.sc = sc++;
      o.ns = 'true';
    } else { o.ns = 'false'; }
    
    o.ts = cTs;
  }
  
  // Handle new user detection by checking 'sc' value. 
  // 'true' = first-time visitor, 'false' = returning visitor
  o.nu = (sc === 1 && pc === 1) ? 'true' : 'false'; 
  
  localStorage.setItem(oN, JSON.stringify(o));
  data.gtmOnSuccess();
}

data.gtmOnFailure();


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "access_local_storage",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "mxl_sc"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios: []


___NOTES___

Created on 04/12/2024, 09:20:53


