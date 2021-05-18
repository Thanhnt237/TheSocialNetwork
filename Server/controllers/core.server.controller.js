/**
* @module controllers
* @description
* Core logical of applications
*/

const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const mailer = require('./mailer');
const multerUpload = require('./multer');
const multer = require('multer')

const Authentication = require('../db/models/Authentication');
const User = require('../db/models/User');
const PasswordReset = require('../db/models/ResetPassword');
const Informations = require('../db/models/Informations');
const Posts = require('../db/models/Posts');
const PostLayouts = require('../db/models/PostLayouts');
const Comments = require('../db/models/Comments');
const Reactions = require('../db/models/Reactions');

module.exports = {
  renderHomePage: renderHomePage,
  verifyToken: verifyToken,
  UserLogin: UserLogin,
  UserRegister: UserRegister,
  GetUserProfile: GetUserProfile,
  EditProfile: EditProfile,
  ResetPassword: ResetPassword,
  GetResetConfirm: GetResetConfirm,
  PostResetConfirm: PostResetConfirm,
  SendMail: SendMail,
  SendResetPasswordLink: SendResetPasswordLink,
  ToolbarProfile: ToolbarProfile,
  ChangeAvatar: ChangeAvatar,
  AddNewPost: AddNewPost,
  DeletePost: DeletePost,
  AddNewComment: AddNewComment,
  GetPost: GetPost
};

/**
* @name renderHomePage
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

function renderHomePage(req, res) {
  res.render('home');
}

/**
* @name VerifyToken
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function verifyToken(req,res,next) {
  if(!req.headers.authorization){
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];

  if (token == 'null'){
    return res.status(401).send('Unauthorized request');
  }
  let payload = jwt.verify(token, 'secretKey');

  if(!payload){
    return res.status(401).send('Unauthorized request');
  }

  req.userId = payload.subject;
  next();
}

/**
* @name UserRegister
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function UserRegister(req, res) {
  let userData = req.body;
  let hash_password = bcrypt.hashSync(userData.password, 10);

  let createUser = new User();
  let createInformation = new Informations({
    User_ID: createUser._id,
    name: userData.name
  });
  let user = new Authentication({
    User_ID: createUser._id,
    email: userData.email,
    password: hash_password
  });

  Authentication.countDocuments({email: userData.email}, function (err, count){
    if(count>0){
        res.status(401).send('User existed!');
    }else {
      user.save((err,userRegisted) => {
        if(err){
          console.log("err" + err);
        }else {
          let payload = { subject: userRegisted.User_ID};
          let token = jwt.sign(payload, 'secretKey');
          res.status(200).send({token});
        }
      })
      createUser.save();
      createInformation.save();
    }
  });
}

/**
* @name UserLogin
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function UserLogin(req,res) {
  let userData = req.body;

if(userData.email === '' || userData.password === ''){
  res.status(401).send('Invalid Email and Password');
}else {
  Authentication.findOne({email: userData.email}, (err,user) => {
    if(err){
      console.log("err" + err);
    }else{
      if(!user){
        res.status(401).send('Invalid Email');
      }else
      if(!user.comparePassword(userData.password)){
        res.status(401).send('Invalid Password');
      }else {
        let payload = { subject:user.User_ID, email: user.email }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token});
      }
    }
  })
}
}

/**
* @name GetUserProfile
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function GetUserProfile(req,res) {
  Informations.findOne({User_ID:req.params.userId}, (err,userInfor)=>{
    if(err){
      console.log(err);
    }else{
      Authentication.findOne({User_ID: req.params.userId},(err,userAuth)=>{
        if(err){
          console.log(err);
        }else{
          res.status(200).send({
            email: userAuth.email,
            name: userInfor.name,
            userId: req.userId,
            phone: userInfor.phone,
            avatar: userInfor.avatar
          })
        }
      })
    }
  })
}

/**
* @name ToolbarProfile
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function ToolbarProfile(req,res) {
  Informations.findOne({User_ID:req.userId},(err,userInfor)=>{
    if(err){
      console.log(err);
    }else{
      res.status(200).send({
        name: userInfor.name,
        userId: req.userId,
        avatar: userInfor.avatar
      })
    }
  });
}

/**
* @name EditProfile
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditProfile(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {name: req.body.name,
            phone:req.body.phone
    }},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Sucesss");
      }
    }
  )
}

/**
* @name ChangeAvatar
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function ChangeAvatar(req,res) {
await multerUpload.upload(req,res, (err)=>{
  if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(401).send("A Multer error occurred when uploading.")
    }else if (err) {
      console.log(err);
      res.status(401).send("A Multer error occurred when uploading.")
    }else{
        console.log("Upload is okay");
        Informations.findOneAndUpdate(
          {User_ID: req.userId},
          {$set: {avatar: req.file.filename}},
        (err) => {
          if(err){
            res.status(401).send("err"+err);
          }else {
            res.status(200).send("Success");
          }
        });
    }
})
}


/**
* @name SendMail
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function SendMail(req, res) {
  try {
    // Lấy data truyền lên từ form phía client
    const { to, subject, body } = req.body
    // Thực hiện gửi email
    await mailer.sendMail(to, subject, body)
    // Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
    res.send('<h3>Your email has been sent successfully.</h3>')
  } catch (error) {
    // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
    console.log(error)
    res.send(error)
  }
}


/**
* @name ResetPassword
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function ResetPassword(req,res) {
  let userData = req.body;
  const user = await Authentication.findOne({ email: userData.email })
  if (!user) {
    res.json('User not found');
  }

  const token = v4().toString().replace(/-/g, '')

  PasswordReset.updateOne({
    user: user._id
  }, {
    user: user._id,
    token: token
  }, {
  upsert: true
  })
  .then( updateResponse => {
      const resetLink = `http://localhost:4200/reset-confirm/${token}`
      try {
        // Lấy data truyền lên từ form phía client
        let subject = "Link Reset mật khẩu cho mạng xã hội mà chưa được đặt tên";
        let body = resetLink;
        // Thực hiện gửi email
        mailer.sendMail(req.body.email, subject, body)
        // Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
        res.json('Your email has been sent successfully.')
        } catch (error) {
        // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
        console.log(error)
        res.send(error)
      }
    })
    .catch( error => {
      res.json('Failed to generate reset link, please try again')
    })
}

/**
* @name GetResetConfirm
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function GetResetConfirm(req,res){
  const token = req.params.token
  const passwordReset = await PasswordReset.findOne({ token })
  res.status(200).send({token});
}

/**
* @name PostResetConfirm
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function PostResetConfirm(req,res){
  const token = req.params.token
  const passwordReset = await PasswordReset.findOne({ token })
  let hash_password = bcrypt.hashSync(req.body.password, 10);

  /* Update user */
  let user = await Authentication.findOne({ _id: passwordReset.user })
  user.password = hash_password;

  user.save().then( async savedUser =>  {
    /* Delete password reset document in collection */
    await PasswordReset.deleteOne({ _id: passwordReset._id })
    /* Redirect to login page with success message */
    res.json('Password reset successful')
  }).catch( error => {
    /* Redirect back to reset-confirm page */
    res.json('Failed to reset password please try again')
  })
}

/**
* @name SendResetPasswordLink
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function SendResetPasswordLink(req, res) {
  try {
    // Lấy data truyền lên từ form phía client
    let subject = "Link Reset mật khẩu cho mạng xã hội mà chưa được đặt tên";
    let body = "ma token minh se de vao day de cho ae reset mat khau nhe";
    // Thực hiện gửi email
    await mailer.sendMail(req.body.email, subject, body)
    // Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
    res.json('Your email has been sent successfully.')
  } catch (error) {
    // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
    console.log(error)
    res.send(error)
  }
}


/**
* @name AddNewPost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AddNewPost(req, res) {
  let postData = req.body;

  let createPost = new Posts({
    TimeLine_ID: req.params.userId
  });

  await multerUpload.upload(req,res, (err)=>{
    if (err instanceof multer.MulterError) {
        console.log(err);
        res.status(401).send("A Multer error occurred when uploading.")
      }else if (err) {
        console.log(err);
        res.status(401).send("A Multer error occurred when uploading.")
      }else{
          console.log("Upload is okay");
          Informations.findOne({User_ID:req.userId},(err,user)=>{
            let createPostLayouts = new PostLayouts({
              Post_ID: createPost._id,
              UserName: user.name,
              UserAvatar: user.avatar,
              title: postData.title,
              content: postData.content,
              images: postData.images
            });
            createPostLayouts.save((err)=>{
              if(err){
                console.log(err);
              }else{
                createPost.save();
                res.status(200).send("Sucess");
              }
            })
          })
      }
  })


}

/**
* @name DeletePost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function DeletePost(req, res) {
  Posts.countDocuments({_id:req.params.postId},(err,postCount)=>{
    if(postCount>0){
      Posts.countDocuments({User_ID: req.userId}, (err,postCount2)=>{
        if(postCount2>0){
          Posts.findByIdAndDelete({_id: req.params.postId},(err)=>{
            if(err){
              console.log(err);
            }else{
              PostLayouts.findOneAndDelete({Post_ID:req.params.postId},(err)=>{
                if(err){
                  console.log(err);
                }else{
                  res.status(200).send("Success");
                }
              })
            }
          })

        }
        else{
          res.status(401).send("May khong du tuoi lam viec nay");
        }
      })
    }else{
      res.status(404).send("ko co post nao o day car")
    }
  })
}

/**
* @name UpdatePost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function UpdatePost(req, res) {
  Posts.countDocuments({_id:req.params.postId},(err,postCount)=>{
    if(postCount>0){
      Posts.countDocuments({User_ID: req.userId}, (err,postCount2)=>{
        if(postCount2>0){
          PostLayouts.findOneAndUpdate({Post_ID:req.params.postId},
            {$set:{content: req.body.content}},
            (err)=>{
            if(err){
              console.log(err);
            }else{
              res.status(200).send("Success");
            }
          })
        }
        else{
          res.status(401).send("May khong du tuoi lam viec nay");
        }
      })
    }else{
      res.status(404).send("ko co post nao o day car")
    }
  })
}

/**
* @name AddNewComment
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AddNewComment(req, res) {
  let createComment = new Comments({
    Parent_ID: req.params.postId,
    User_ID: req.userId,
    content: req.body.content,
    images: req.body.images
  });
  createPostLayouts.save((err)=>{
    if(err){
      console.log(err);
    }else{
      res.status(200).send("Sucess");
    }
  })
}

/**
* @name GetPost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function GetPost(req, res) {

  Posts.find({TimeLine_ID: req.params.userId},(err, postId)=>{
    PostLayouts.find({Post_ID: postId}, (err,postLayout)=>{
      if(err){
        console.log(err);
      }else{
        res.status(200).send(postLayout)
      }
    })
  })
}
