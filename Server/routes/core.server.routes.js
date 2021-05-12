/**
* @module routes
* @description
* Define all core routes of applications
*/

var express = require('express');
var router = express.Router();

const coreCtrl = require('../controllers').Core;

  router.route('/').get(coreCtrl.renderHomePage);
  router.route('/api/login').post(coreCtrl.UserLogin);
  router.route('/api/register').post(coreCtrl.UserRegister);
  router.route("/send-email").get((req,res)=>{res.render('reset')});
  router.route("/send-email").post(coreCtrl.SendMail);
  router.route("/api/reset").post(coreCtrl.ResetPassword);
  router.route('/reset-confirm/:token').get(coreCtrl.GetResetConfirm);
  router.route('/reset-confirm/:token').post(coreCtrl.PostResetConfirm);
module.exports = router;
