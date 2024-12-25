___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Facebook Data Object Builder",
  "description": "",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "GROUP",
    "name": "parametersGroup",
    "displayName": "User Data Parameters",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "SIMPLE_TABLE",
        "name": "userParamList",
        "displayName": "",
        "simpleTableColumns": [
          {
            "defaultValue": "",
            "displayName": "Parameter Name",
            "name": "name",
            "type": "TEXT"
          },
          {
            "defaultValue": "",
            "displayName": "Parameter Value",
            "name": "value",
            "type": "TEXT"
          }
        ]
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "parametersGroup (2)",
    "displayName": "Custom Data Parameters",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "SIMPLE_TABLE",
        "name": "customParamList",
        "displayName": "",
        "simpleTableColumns": [
          {
            "defaultValue": "",
            "displayName": "Parameter Name",
            "name": "name",
            "type": "TEXT"
          },
          {
            "defaultValue": "",
            "displayName": "Parameter Value",
            "name": "value",
            "type": "TEXT"
          }
        ]
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const makeTableMap = require('makeTableMap');
const JSON = require('JSON');
var fb_data = {};

const userParams = data.userParamList && data.userParamList.length ? makeTableMap(data.userParamList, 'name', 'value') : {};
const customParams = data.customParamList && data.customParamList.length ? makeTableMap(data.customParamList, 'name', 'value') : {};

fb_data.user_data = userParams;
fb_data.custom_data = customParams;

return JSON.stringify(fb_data);


___TESTS___

scenarios: []


___NOTES___

Created on 11. 11. 2024 13:47:24


