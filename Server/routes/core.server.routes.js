/**
* @module routes
* @description
* Define all core routes of applications
*/

var express = require('express');
var router = express.Router();

const coreCtrl = require('../controllers').Core;

  router.route('/api/home').get(coreCtrl.verifyToken, coreCtrl.renderHomePage);
  router.route('/api/login').post(coreCtrl.UserLogin);
  router.route('/api/register').post(coreCtrl.UserRegister);
  router.route('/api/profile/:userId').get(coreCtrl.GetUserProfile);
  router.route('/api/toolbar-profile').get(coreCtrl.verifyToken,coreCtrl.ToolbarProfile);
  router.route('/api/edit-profile').post(coreCtrl.verifyToken,coreCtrl.EditProfile);
  router.route('/api/edit-profile/description').post(coreCtrl.verifyToken,coreCtrl.EditDescription);
  router.route('/api/edit-profile/name').post(coreCtrl.verifyToken,coreCtrl.EditName);
  router.route('/api/edit-profile/gender').post(coreCtrl.verifyToken,coreCtrl.EditGender);
  router.route('/api/edit-profile/DoB').post(coreCtrl.verifyToken,coreCtrl.EditDoB);
  router.route('/api/edit-profile/address').post(coreCtrl.verifyToken,coreCtrl.EditAddress);
  router.route('/api/edit-profile/phone').post(coreCtrl.verifyToken,coreCtrl.EditPhone);
  router.route('/api/change-avatar').post(coreCtrl.verifyToken,coreCtrl.ChangeAvatar);
  router.route('/api/change-cover').post(coreCtrl.verifyToken,coreCtrl.ChangeCover);
  router.route('/api/Post/new/:userId').post(coreCtrl.verifyToken,coreCtrl.AddNewPost);
  router.route('/api/Post/new/noImage/:userId').post(coreCtrl.verifyToken,coreCtrl.AddNewPostNoImage)
  router.route('/api/Post/delete/:postId').delete(coreCtrl.verifyToken,coreCtrl.DeletePost);
  router.route('/api/Post/getPost/:userId').get(coreCtrl.GetPost);
  router.route('/api/Comments/new/:postId').post(coreCtrl.verifyToken,coreCtrl.AddNewComment);
  router.route('/api/Comment/getComment/:postId').get(coreCtrl.GetComment);
  router.route('/api/Friend/FriendRequest/:userId').post(coreCtrl.verifyToken, coreCtrl.FriendRequest);
  router.route('/api/Friend/AcceptFriend/:userId').post(coreCtrl.verifyToken, coreCtrl.AcceptFriend);
  router.route('/api/Friend/getAllFriendRequest').get(coreCtrl.verifyToken, coreCtrl.getAllFriendRequest);
  router.route('/api/Friend/getAllFriend').get(coreCtrl.verifyToken, coreCtrl.getAllFriend);
  router.route('/api/Friend/DeleteFriendRequest/:userId').post(coreCtrl.verifyToken, coreCtrl.DeleteFriendRequest);
  router.route('/api/Friend/DeleteFriend/:userId').post(coreCtrl.verifyToken, coreCtrl.DeleteFriend);
  router.route('/socket-chating').get((req,res)=>{res.render('socket-chating')});
  router.route('/api/Chat/:userId').get(coreCtrl.verifyToken, coreCtrl.getChatService);

  router.route("/send-email").get((req,res)=>{res.render('reset')});
  router.route("/send-email").post(coreCtrl.SendMail);
  router.route("/api/reset").post(coreCtrl.ResetPassword);
  router.route('/reset-confirm/:token').get(coreCtrl.GetResetConfirm);
  router.route('/reset-confirm/:token').post(coreCtrl.PostResetConfirm);

  router.route("/fortest").post(coreCtrl.GetTest);

module.exports = router;
