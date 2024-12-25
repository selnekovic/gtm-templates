___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Local Storage Counter Variable",
  "description": "Variable retrieves a specific value from an object stored in localStorage. It should be used with Local Storage Counter tag.",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "SELECT",
    "name": "keyName",
    "displayName": "Select the key name",
    "selectItems": [
      {
        "value": "pc",
        "displayValue": "page count"
      },
      {
        "value": "sc",
        "displayValue": "session count"
      },
      {
        "value": "nu",
        "displayValue": "new user"
      },
      {
        "value": "ns",
        "displayValue": "new session"
      }
    ],
    "simpleValueType": true,
    "alwaysInSummary": true
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

/**
Variable retrieves a specific value from an object stored in localStorage. It should be used with Local Storage Counter tag. 
**/

// v.1.0.0

const localStorage = require('localStorage');
const JSON = require('JSON');

let objectName = "mxl_sc";
let keyName = data.keyName;
let object = {};

object = JSON.parse(localStorage.getItem(objectName));
return object[keyName];


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
                    "boolean": false
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
setup: ''


___NOTES___

Created on 04/12/2024, 09:21:18


