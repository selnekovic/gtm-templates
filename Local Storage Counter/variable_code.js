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