/**
* @module controllers
* @description
* Core logical of applications
*/

const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

module.exports = {
  renderHomePage: renderHomePage,
  verifyToken: verifyToken,
  UserLogin: UserLogin,
  UserRegister: UserRegister
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

  let user = new User({
    email: userData.email,
    password: hash_password
  });

  User.countDocuments({email: userData.email}, function (err, count){
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
  User.findOne({email: userData.email}, (err,user) => {
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
