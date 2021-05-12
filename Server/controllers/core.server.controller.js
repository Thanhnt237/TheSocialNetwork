/**
* @module controllers
* @description
* Core logical of applications
*/

const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const mailer = require('./mailer');
const Authentication = require('../db/models/Authentication');
const User = require('../db/models/User');
const PasswordReset = require('../db/models/ResetPassword');


module.exports = {
  renderHomePage: renderHomePage,
  verifyToken: verifyToken,
  UserLogin: UserLogin,
  UserRegister: UserRegister,
  ResetPassword: ResetPassword,
  GetResetConfirm: GetResetConfirm,
  PostResetConfirm: PostResetConfirm,
  SendMail: SendMail,
  SendResetPasswordLink: SendResetPasswordLink
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

function verifyToken(req,res,next) {
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

  let user = new Authentication({
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
          let payload = { subject: userRegisted._id, email: user.email };
          let token = jwt.sign(payload, 'secretKey');
          res.status(200).send({token});
        }
      })
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
        let payload = { subject:user._id, email: user.email }
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
  try{
    const userInfor = Informations.findOne({Parent_id: req.userId})
    const userAuth = Authentication.findOne({User_id: req.userId})
    res.status(200).send({
      email: userAuth.email,
      name: userInfor.name,
      password: userAuth.password,
      userId: req.userId,
      phone: userInfor.phone,
      avatar: userInfor.avatar
    })
  }
  catch(err){
    console.log(err)
  }
}
/**
* @name EditProfile
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditProfile(req,res) {
  let userInfor
  let userAuth
  try{
    userInfor = Informations.findOne({Parent_id: req.userId})
    userAuth = Authentication.findOne({User_id: req.userId})
    userAuth = req.body.email
    userInfor.name = req.body.name
    userAuth.password = req.body.password
    userInfor.phone = req.body.phone
    res.status(200).send('Success')
  }
  catch(err){
    console.log(err)
  }
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
}

/**
* @name PostResetConfirm
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function PostResetConfirm(req,res){
  const token = req.params.token
  const passwordReset = await PasswordReset.findOne({ token })

  /* Update user */
  let user = await Authentication.findOne({ _id: passwordReset.user })
  user.password = req.body.password
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
