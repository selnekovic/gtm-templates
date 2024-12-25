// v.1.0.0

const makeTableMap = require('makeTableMap');
const JSON = require('JSON');
var fb_data = {};

const userParams = data.userParamList && data.userParamList.length ? makeTableMap(data.userParamList, 'name', 'value') : {};
const customParams = data.customParamList && data.customParamList.length ? makeTableMap(data.customParamList, 'name', 'value') : {};

fb_data.user_data = userParams;
fb_data.custom_data = customParams;

return JSON.stringify(fb_data);