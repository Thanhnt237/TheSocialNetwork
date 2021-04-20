/**
* @module routes
* @description
* Define all core routes of applications
*/

var express = require('express');
var router = express.Router();

const coreCtrl = require('../controllers').Core;

  router.route('/').get(coreCtrl.renderHomePage);
  router.route('/api/login').get(coreCtrl.UserLogin);
  router.route('/api/register').get(coreCtrl.UserRegister);
module.exports = router;
