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
const FriendList = require('../db/models/FriendList');
const FriendQueue = require('../db/models/FriendQueue');
const Chats = require('../db/models/Chats');
const News = require('../db/models/News');
const Test = require('../db/models/Test');
const SearchHistories = require('../db/models/SearchHistories');

module.exports = {
  renderHomePage: renderHomePage,
  verifyToken: verifyToken,
  UserLogin: UserLogin,
  UserRegister: UserRegister,
  ChangePassword: ChangePassword,
  GetUserProfile: GetUserProfile,
  EditProfile: EditProfile,
  EditDescription:EditDescription,
  EditName: EditName,
  EditGender: EditGender,
  EditDoB: EditDoB,
  EditAddress: EditAddress,
  EditPhone: EditPhone,
  ResetPassword: ResetPassword,
  GetResetConfirm: GetResetConfirm,
  PostResetConfirm: PostResetConfirm,
  SendMail: SendMail,
  SendResetPasswordLink: SendResetPasswordLink,
  ToolbarProfile: ToolbarProfile,
  ChangeAvatar: ChangeAvatar,
  ChangeCover: ChangeCover,
  AddNewPost: AddNewPost,
  AddNewPostNoImage:AddNewPostNoImage,
  DeletePost: DeletePost,
  EditPost: EditPost,
  AddNewComment: AddNewComment,
  GetPost: GetPost,
  GetComment: GetComment,
  LikePost: LikePost,
  unLikePost: unLikePost,
  CountLikePost: CountLikePost,
  CheckLiked: CheckLiked,
  FriendRequest: FriendRequest,
  AcceptFriend: AcceptFriend,
  DeleteFriendRequest: DeleteFriendRequest,
  DeleteFriend: DeleteFriend,
  getAllFriendRequest: getAllFriendRequest,
  getAllFriend: getAllFriend,
  getProfileFriend: getProfileFriend,
  getChatService: getChatService,
  AddNewNews: AddNewNews,
  AddNewNewsNoImage:AddNewNewsNoImage,
  getAllNews: getAllNews,
  CountPost: CountPost,
  CountLike: CountLike,
  CountFriend: CountFriend,
  SearchBarLoggedIn: SearchBarLoggedIn,
  getSearchHistories: getSearchHistories,
  SearchBarNoLogin: SearchBarNoLogin,
  CheckAdmin: CheckAdmin,
  CheckPermission: CheckPermission,
  SetOfflineState: SetOfflineState,
  SendChatMessage: SendChatMessage,
  GetTest:GetTest
};

/**
* @name GetTest
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

function GetTest(req,res) {
  let data = req.body;

  let newTest = new Test({
    fruit: data.fruit,
    animal: data.animal,
    things: data.things
  })

  newTest.save((err)=>{
    if(err){
      console.log(err)
    }else{
      res.status(200).send("Th??nh c??ng")
    }
  })
}

/**
* @name renderHomePage
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function renderHomePage(req, res) {
  try{
    let getUserFriend = await FriendList.find({User_ID: req.userId})
    let user = [];
    user.push(req.userId);
    getUserFriend.forEach((friend) => {
      user.push(friend.Friend_ID)
    });
    let postId = await Posts.find({TimeLine_ID: {$in: user}});
    let post = await PostLayouts.find({Post_ID: {$in: postId} })
    post.reverse();
    res.status(200).send(post);
  }catch(err){
    console.log(err)
  }
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
          User.findOneAndUpdate({_id:userRegisted.User_ID}, {$set:{State: "Online"}}, (err)=>{
            if(err){
              console.log(err)
            }else{
              let payload = { subject: userRegisted.User_ID};
              let token = jwt.sign(payload, 'secretKey');
              res.status(200).send({token});
            }
          });
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
async function UserLogin(req,res) {
  try{
    let userData = req.body;

  if(userData.email === '' || userData.password === ''){
    res.status(401).send('T??i kho???n v?? m???t kh???u kh??ng ???????c ????? l?? kho???ng tr???ng');
  }else {
    await Authentication.findOne({email: userData.email}, async (err,user) => {
      if(err){
        console.log("err" + err);
      }else{
        if(!user){
          res.status(401).send('Invalid Email');
        }else
        if(!user.comparePassword(userData.password)){
          res.status(401).send('Invalid Password');
        }else {
          User.findOneAndUpdate({_id:user.User_ID}, {$set:{State: "Online"}}, (err)=>{
            if(err){
              console.log(err)
            }else{
              let payload = { subject:user.User_ID}
              let token = jwt.sign(payload, 'secretKey')
              res.status(200).send({token});
            }
          });
        }
      }
    })
  }
}catch(err){
  console.log(err)
}

}

/**
* @name ChangePassword
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function ChangePassword(req, res) {
  let hash_password = bcrypt.hashSync(req.body.password, 10);

  Authentication.findOneAndUpdate({User_ID:req.userId},{$set:{password: hash_password}},(err)=>{
    if(err){
      console.log(err)
    }else{
      res.status(200).send("?????i m???t kh???u th??nh c??ng");
    }
  })
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
            avatar: userInfor.avatar,
            cover: userInfor.cover,
            address: userInfor.address,
            DoB: userInfor.DoB,
            description: userInfor.description,
            gender: userInfor.gender
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
            phone:req.body.phone,
            address: req.body.address,
            DoB: req.body.DoB,
            description: req.body.description,
            gender: req.body.gender
    }},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Th??nh c??ng");
      }
    }
  )
}

/**
* @name EditDescription
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditDescription(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {description: req.body.description}},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Ch???nh s???a m?? t??? th??nh c??ng!");
      }
    }
  )
}

/**
* @name EditName
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditName(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {name: req.body.name}},
    async (err)=>{
      if(err){
        console.log(err)
      }else{
        let user = await Informations.findOne({User_ID: req.userId})
        await PostLayouts.updateMany(
          {User_ID:req.userId},
          {$set:{ UserName: user.name}},
          async (err)=>{
            if(err){
              console.log(err)
            }else{
              await Comments.updateMany(
                {User_ID: req.userId},
                {$set:{UserName: user.name}},
                async (err)=>{
                  if(err){
                    console.log(err)
                  }else{
                    await FriendList.updateMany(
                      {Friend_ID: req.userId},
                      {$set:{ name: user.name}},
                      (err) =>{
                        if(err){
                          console.log(err)
                        }else{
                          res.status(200).send("?????i t??n th??nh c??ng")
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
  )
}

/**
* @name EditGender
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditGender(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {gender: req.body.gender}},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Ch???nh s???a gi???i t??nh th??nh c??ng!");
      }
    }
  )
}

/**
* @name EditDoB
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditDoB(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {DoB: req.body.DoB}},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Ch???nh s???a ng??y sinh th??nh c??ng!");
      }
    }
  )
}

/**
* @name EditAddress
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditAddress(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {address: req.body.address}},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Ch???nh s???a ?????a ch??? th??nh c??ng!");
      }
    }
  )
}

/**
* @name EditPhone
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function EditPhone(req,res) {
  Informations.findOneAndUpdate(
    {User_ID: req.userId},
    {$set: {phone: req.body.phone}},
    (err)=>{
      if(err){
        console.log(err)
      }else{
        res.status(200).send("Ch???nh s???a s??? ??i???n tho???i th??nh c??ng!");
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
        async (err) => {
          if(err){
            res.status(401).send("err"+err);
          }else {
            let user = await Informations.findOne({User_ID:req.userId})
            await PostLayouts.updateMany(
              {User_ID: req.userId},
              {$set: { UserAvatar: req.file.filename }}, (err)=>{
                if(err){console.log(err)}
              })
            await Comments.updateMany(
              {User_ID: req.userId},
              {$set: {avatar: req.file.filename}}, (err) => {
                if(err){console.log(err)}
              })
            await FriendList.updateMany(
              {Friend_ID: req.userId},
              {$set: {avatar: req.file.filename}}, (err) => {
                if(err){console.log(err)}
              }
            )
            res.status(200).send("?????i ???nh ?????i di???n th??nh c??ng");
          }
        });
    }
})
}

/**
* @name ChangeCover
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function ChangeCover(req,res) {
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
          {$set: {cover: req.file.filename}},
        (err) => {
          if(err){
            res.status(401).send("err"+err);
          }else {
            res.status(200).send("?????i ???nh b??a th??nh c??ng");
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
    // L???y data truy???n l??n t??? form ph??a client
    const { to, subject, body } = req.body
    // Th???c hi???n g???i email
    await mailer.sendMail(to, subject, body)
    // Qu?? tr??nh g???i email th??nh c??ng th?? g???i v??? th??ng b??o success cho ng?????i d??ng
    res.send('<h3>Your email has been sent successfully.</h3>')
  } catch (error) {
    // N???u c?? l???i th?? log ra ????? ki???m tra v?? c??ng g???i v??? client
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
      const resetLink = `http://localhost:8080/reset-confirm/${token}`
      try {
        // L???y data truy???n l??n t??? form ph??a client
        let subject = "???????ng d???n l???y l???i m???t kh???u cho M???ng x?? h???i The Social Network ";
        let body = resetLink;
        // Th???c hi???n g???i email
        mailer.sendMail(req.body.email, subject, body)
        // Qu?? tr??nh g???i email th??nh c??ng th?? g???i v??? th??ng b??o success cho ng?????i d??ng
        res.json('Your email has been sent successfully.')
        } catch (error) {
        // N???u c?? l???i th?? log ra ????? ki???m tra v?? c??ng g???i v??? client
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
    // L???y data truy???n l??n t??? form ph??a client
    let subject = "???????ng d???n l???y l???i m???t kh???u cho M???ng x?? h???i The Social Network ";
    let body = "Drop token here";
    // Th???c hi???n g???i email
    await mailer.sendMail(req.body.email, subject, body)
    // Qu?? tr??nh g???i email th??nh c??ng th?? g???i v??? th??ng b??o success cho ng?????i d??ng
    res.json('Email c???a b???n ???? ???????c g???i ??i th??nh c??ng')
  } catch (error) {
    // N???u c?? l???i th?? log ra ????? ki???m tra v?? c??ng g???i v??? client
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
          console.log(req.body.content);
          Informations.findOne({User_ID:req.userId},(err,user)=>{
            let createPostLayouts = new PostLayouts({
              Post_ID: createPost._id,
              User_ID: user.User_ID,
              UserName: user.name,
              UserAvatar: user.avatar,
              title: req.body.title,
              content: req.body.content,
              images: req.file.filename
            });
            createPostLayouts.save((err)=>{
              if(err){
                console.log(err);
              }else{
                createPost.save();
                res.status(200).send("????ng b??i vi???t th??nh c??ng!");
              }
            })
          })
      }
  })
}

/**
* @name AddNewPostNoImage
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AddNewPostNoImage(req, res) {
    let createPost = new Posts({
      TimeLine_ID: req.params.userId
    });

    Informations.findOne({User_ID:req.userId},(err,user)=>{
    let createPostLayouts = new PostLayouts({
      Post_ID: createPost._id,
      User_ID: user.User_ID,
      UserName: user.name,
      UserAvatar: user.avatar,
      title: req.body.title,
      content: req.body.content,
      });
      createPostLayouts.save((err)=>{
        if(err){
          console.log(err);
        }else{
          createPost.save();
          res.status(200).send("????ng b??i vi???t th??nh c??ng!");
          }
        })
    })
}

/**
* @name EditPost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
// TODO: here
async function EditPost(req, res) {
  try{
    let user = await Informations.findOne({User_ID: req.userId})
    let post = await PostLayouts.findOne({Post_ID: req.params.postId})

    if(user.name != post.UserName){
      res.status(401).send("B???n kh??ng ????? quy???n l??m vi???c n??y")
    }else{
      await PostLayouts.findOneAndUpdate({Post_ID: req.params.postId}, {$set:{content: req.body.content}})
      res.status(200).send("S???a b??i vi???t th??nh c??ng!")
    }
  }catch(err){
    console.log(err)
  }
}

/**
* @name DeletePost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function DeletePost(req, res) {
  Posts.countDocuments({_id:req.params.postId},(err,postCount)=>{
    if(postCount>0){
      Posts.countDocuments({TimeLine_ID: req.userId}, (err,postCount2)=>{
        if(postCount2>0){
          Posts.findByIdAndDelete({_id: req.params.postId},(err)=>{
            if(err){
              console.log(err);
            }else{
              PostLayouts.findOneAndDelete({Post_ID:req.params.postId},(err)=>{
                if(err){
                  console.log(err);
                }else{
                  res.status(200).send("X??a b??i vi???t th??nh c??ng!");
                }
              })
            }
          })
        }
        else{
          res.status(401).send("B???n kh??ng c?? quy???n l??m vi???c n??y!");
        }
      })
    }else{
      res.status(404).send("Post n??y kh??ng t???n t???i!")
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
          res.status(401).send("B???n kh??ng c?? quy???n l??m ??i???u n??y");
        }
      })
    }else{
      res.status(404).send("Kh??ng c?? b??i ????ng n??o ??? ????y c???")
    }
  })
}

/**
* @name AddNewComment
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AddNewComment(req, res) {
  let user = await Informations.findOne({User_ID:req.userId})

  let createComment = await new Comments({
    Parent_ID: req.params.postId,
    User_ID: user.User_ID,
    UserName: user.name,
    avatar: user.avatar,
    content: req.body.content
  });

  await createComment.save( async (err)=>{
    if(err){
      console.log(err)
    }else{
      res.status(200).send("B??nh lu???n th??nh c??ng!")
    }
  })
}

/**
* @name GetPost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function GetPost(req, res) {
  try{
    let postId = await Posts.find({TimeLine_ID: req.params.userId})
    let postLayout = await PostLayouts.find({Post_ID: postId})
    postLayout.reverse();
    res.status(200).send(postLayout);
  } catch (err){
    console.log(err)
  };
}

/**
* @name GetComment
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function GetComment(req, res) {
    Comments.find({Parent_ID: req.params.postId}, (err,comment)=>{
      if(err){
        console.log(err);
      }else{
        res.status(200).send(comment)
      }
    })
}

/**
* @name FriendRequest
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function FriendRequest(req, res) {
  if(req.userId == req.params.userId){
    res.status(401).send("Kh??ng th??? g???i y??u c???u k???t b???n ?????n ch??nh m??nh")
  }else{
    FriendList.countDocuments({User_ID: req.params.userId, Friend_ID: req.userId},(err,checkFriend)=>{
      if(err){
        console.log(err)
      }else{
        if(checkFriend>0){
          res.status(401).send("Hai b???n ???? l?? b???n b??, kh??ng th??? g???i l???i m???i k???t b???n")
        }else{
          FriendQueue.countDocuments({User_ID: req.params.userId, FriendQueue_ID:req.userId},(err,count)=>{
            if(count>0){
              res.status(200).send("???? g???i l???i m???i k???t b???n, ch??? ph???n h???i")
            }else{
              Informations.findOne({User_ID: req.userId},(err,user)=>{
                if(err){
                  console.log(err)
                }else{
                  let friend = new FriendQueue({
                    User_ID: req.params.userId,
                    FriendQueue_ID:req.userId,
                    avatar: user.avatar,
                    name: user.name
                  })
                  friend.save((err)=>{
                    if(err){
                      console.log(err)
                    }else{
                      res.status(200).send("Y??u c???u k???t b???n th??nh c??ng");
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  }
}

/**
* @name AcceptFriend
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AcceptFriend(req, res) {
  FriendQueue.countDocuments({User_ID:req.userId, FriendQueue_ID:req.params.userId},(err,count)=>{
    if(err){
      console.log(err);
    }else{
      if(count>0){
        FriendList.countDocuments({User_ID:req.userId, Friend_ID:req.params.userId},(err,count2)=>{
          if(err){
            console.log(err)
          }else{
            if(count2>0){
              res.status(200).send("Hai b???n ???? l?? b???n b?? c???a nhau")
            }else{
              Informations.findOne({User_ID:req.params.userId},(err,user)=>{
                let friend = new FriendList({
                  User_ID:req.userId,
                  Friend_ID:req.params.userId,
                  avatar: user.avatar,
                  name:user.name
                });
                friend.save((err)=>{
                  FriendQueue.findOneAndDelete({User_ID:req.userId, FriendQueue_ID:req.params.userId},(err)=>{
                    if(err){
                      console.log(err)
                    }else{
                      let chat = new Chats({
                        User_ID: req.userId,
                        Friend_ID: req.params.userId
                      })
                      chat.save((err)=>{
                        if(err){
                          console.log(err)
                        }else{
                          Informations.findOne({User_ID: req.userId},(err,user2)=>{
                            let coFriend = new FriendList({
                              User_ID:req.params.userId,
                              Friend_ID:req.userId,
                              avatar: user2.avatar,
                              name:user2.name
                            });
                            coFriend.save((err)=>{
                              if(err){
                                console.log(err)
                              }else{
                                let chat2 = new Chats({
                                  User_ID:req.params.userId,
                                  Friend_ID:req.userId
                                })
                                chat2.save((err)=>{
                                  if(err){
                                    console.log(err)
                                  }else{
                                    res.status(200).send("K???t b???n th??nh c??ng");
                                  }
                                })
                              }
                            })
                          })
                        }
                      })
                    }
                  })
                })
              })
            }
          }
        })
      }else{
        res.status(401).send("Kh??ng t???n t???i y??u c???u k???t b???n n??y")
      }
    }
  })
}

/**
* @name DeleteFriendRequest
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function DeleteFriendRequest(req, res) {
  FriendQueue.countDocuments({User_ID:req.userId, FriendQueue_ID:req.params.userId},(err,count)=>{
    if(err){
      console.log(err)
    }else{
      if(count>0){
        FriendQueue.findOneAndDelete({User_ID:req.userId, FriendQueue_ID:req.params.userId},(err)=>{
          if(err){
            console.log(err)
          }else{
            FriendQueue.findOneAndDelete({FriendQueue_ID:req.userId, User_ID:req.params.userId},(err)=>{
              if(err){
                console.log(err)
              }else{
                res.status(200).send("X??a y??u c???u k???t b???n th??nh c??ng")
              }
            })
          }
        })
      }else{
        res.status(401).send("Kh??ng t??m th???y y??u c???u k???t b???n n??y")
      }
    }
  })
}

/**
* @name DeleteFriend
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function DeleteFriend(req, res) {
  FriendList.countDocuments({User_ID: req.userId, Friend_ID:req.params.userId},(err,count)=>{
    if(err){
      console.log(err)
    }else{
      if(count>0){
        FriendList.findOneAndDelete({User_ID: req.userId, Friend_ID:req.params.userId},(err)=>{
          if(err){
            console.log(err)
          }else{
            res.status(200).send("H???y k???t b???n th??nh c??ng");
          }
        })
      }else{
        res.status(401).send("Kh??ng t??m th???y b???n b?? n??y");
      }
    }
  })
}

/**
* @name getAllFriendRequest
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function getAllFriendRequest(req, res) {
  FriendQueue.countDocuments({User_ID:req.userId},(err,count)=>{
    if(count>0){
      FriendQueue.find({User_ID:req.userId}, (err,friendList)=>{
        res.status(200).send(friendList)
      })
    }else{
      res.status(401).send("Kh??ng c?? l???i m???i k???t b???n m???i n??o")
    }
  })
}

/**
* @name getAllFriend
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function getAllFriend(req, res) {
  FriendList.countDocuments({User_ID:req.userId},(err,count)=>{
    if(count>0){
      FriendList.find({User_ID:req.userId},(err,friendList)=>{
        res.status(200).send(friendList)
      })
    }else{
      res.status(401).send("Kh??ng c?? b???n b?? n??o")
    }
  })
}

/**
* @name getProfileFriend
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function getProfileFriend(req, res) {
  FriendList.countDocuments({User_ID: req.params.userId},(err,count)=>{
    if(count>0){
      FriendList.find({User_ID:req.params.userId},(err,friendList)=>{
        res.status(200).send(friendList)
      })
    }else{
      res.status(401).send("Kh??ng c?? b???n b?? n??o")
    }
  })
}

/**
* @name CheckLiked
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function CheckLiked(req,res) {
  try{
    let count = await Reactions.countDocuments({Post_ID: req.params.postId, User_ID:req.userId})
    let isLiked = null;
    if(count > 0){
      isLiked = true;
    }else{
      isLiked = false;
    }
    res.status(200).send(isLiked);
  }catch(err){
    console.log(err)
  };
}

/**
* @name LikePost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function LikePost(req,res) {
  try{
    let count = await Reactions.countDocuments({Post_ID:req.params.postId, User_ID:req.userId});
    if(count>0){
      res.status(401).send("???? th??ch b??i vi???t n??y r???i");
    }else{
      let likePost = new Reactions({
        Post_ID: req.params.postId,
        User_ID: req.userId
      })
      await likePost.save();
      res.status(200).send("???? th??ch")
      }
    }catch(err){
    console.log(err)
  };
}

/**
* @name unLikePost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
async function unLikePost(req,res) {
  try{
    let count = await Reactions.countDocuments({Post_ID:req.params.postId, User_ID:req.userId})
    if(count>0){
      await Reactions.findOneAndDelete({Post_ID:req.params.postId, User_ID:req.userId},(err)=>{
        if(err){
          console.log(err)
        }else{
          res.status(200).send("B??? th??ch");
        }
      })
    }else{
      res.status(401).send("Kh??ng c?? b??i vi???t n??o!")
    }
  }catch(err){
    console.log(err)
  };
}

/**
* @name CountLikePost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function CountLikePost(req,res) {
  try{
    let count = await Reactions.countDocuments({Post_ID:req.params.postId});
    res.status(200).send(count.toString());
  }catch(err){
    console.log(err)
  };
}

/**
* @name CountPost
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function CountPost(req,res) {
  try{
    let count = await Posts.countDocuments({TimeLine_ID: req.params.userId})
    res.status(200).send(count.toString())
  }catch(err){
    console.log(err)
  };
}

/**
* @name CountLike
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function CountLike(req,res) {
  try{
    let post = await Posts.find({TimeLine_ID: req.params.userId})
    let count = await Reactions.countDocuments({Post_ID: {$in: post}})
    res.status(200).send(count.toString())
  }catch(err){
    console.log(err)
  };
}

/**
* @name CountFriend
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function CountFriend(req,res) {
  try{
    let count = await FriendList.countDocuments({User_ID: req.params.userId})
    res.status(200).send(count.toString())
  }catch(err){
    console.log(err)
  };
}

/**
* @name getChatService
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function getChatService(req,res) {
  try{
    let userInfor = await Informations.findOne({User_ID: req.params.userId})
    let chat = await Chats.findOne({User_ID: req.userId, Friend_ID: req.params.userId})
    res.status(200).send(chat)
  }catch(err){
    console.log(err)
  };
}

/**
* @name SendChatMessage
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function SendChatMessage(req,res) {
  try{
    if(req.body.message == '' || req.body.message == null){
      res.status(500).send("Tin nh???n kh??ng ???????c ????? tr???ng")
    }else{
      let userInfor = await Informations.findOne({User_ID: req.params.userId})
      await Chats.findOneAndUpdate({User_ID: req.userId, Friend_ID: req.params.userId}, {$push:{content: {User_ID: req.userId, content: req.body.message}}})
      await Chats.findOneAndUpdate({User_ID: req.params.userId, Friend_ID: req.userId}, {$push:{content: {User_ID: req.userId, content: req.body.message}}})

      res.status(200).send("Th??nh c??ng")
    }
  }catch(err){
    console.log(err)
  };
}

/**
* @name AddNewNews
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AddNewNews(req,res) {
  let checkAdmin = await User.findOne({_id: req.userId})
  if(checkAdmin.Role == "ADMIN"){
    let createNews = new News();

    await multerUpload.upload(req,res, (err)=>{
      if (err instanceof multer.MulterError) {
          console.log(err);
          res.status(401).send("A Multer error occurred when uploading.")
        }else if (err) {
          console.log(err);
          res.status(401).send("A Multer error occurred when uploading.")
        }else{
            console.log("Upload is okay");
            console.log(req.body.content);
            Informations.findOne({User_ID:req.userId},(err,user)=>{
              let createPostLayouts = new PostLayouts({
                Post_ID: createNews._id,
                User_ID: req.userId,
                UserName: user.name,
                UserAvatar: user.avatar,
                title: req.body.title,
                content: req.body.content,
                images: req.file.filename
              });
              createPostLayouts.save((err)=>{
                if(err){
                  console.log(err);
                }else{
                  createNews.save();
                  res.status(200).send("????ng b??i vi???t th??nh c??ng!");
                }
              })
            })
        }
    })
  }else{
    res.status(401).send("B???n kh??ng ????? quy???n l??m vi???c n??y!");
  }
}

/**
* @name AddNewNewsNoImage
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function AddNewNewsNoImage(req, res) {
  let checkAdmin = await User.findOne({_id: req.userId})
  if(checkAdmin.Role == "ADMIN"){
    let createPost = new News();

    Informations.findOne({User_ID:req.userId},(err,user)=>{
      let createPostLayouts = new PostLayouts({
        Post_ID: createPost._id,
        User_ID: req.userId,
        UserName: user.name,
        UserAvatar: user.avatar,
        title: req.body.title,
        content: req.body.content,
      });
      createPostLayouts.save((err)=>{
        if(err){
          console.log(err);
        }else{
          createPost.save();
          res.status(200).send("????ng b??i vi???t th??nh c??ng!");
        }
      })
    })
  }
}


/**
* @name SearchBarNoLogin
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function SearchBarNoLogin(req,res) {
  try{
    let count1 = await Informations.countDocuments({name:req.body.search});
    if(count1 == 0){
      res.status(404).send("Kh??ng t??m th???y ng?????i d??ng")
    }else{
      let user = await Informations.find({name:req.body.search});
      res.status(200).send(user)
    }
  }catch(err){
    console.log(err)
  };
}

/**
* @name SearchBarLoggedIn
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function SearchBarLoggedIn(req,res) {
  try{
    let count1 = await Informations.countDocuments({name:req.body.search});
    if(count1 == 0){
      res.status(404).send("Kh??ng t??m th???y ng?????i d??ng")
    }else{
      let user = await Informations.find({name:req.body.search});
      let count2 = await SearchHistories.countDocuments({User_ID: req.userId, content: req.body.search})
      if(count2>0){
        res.status(200).send(user);
      }else{
        let history = new SearchHistories({
          User_ID: req.userId,
          content: req.body.search
        })
        history.save((err)=>{
          if(err){
            console.log(err)
          }else{
            res.status(200).send(user)
          }
        })
      }
    }
  }catch(err){
    console.log(err)
  };
}

/**
* @name getSearchHistories
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function getSearchHistories(req,res) {
  try{
    let history = await SearchHistories.find({User_ID: req.userId});
    res.status(200).send(history);
  }catch(err){
    console.log(err)
  };
}

/**
* @name CheckAdmin
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function CheckAdmin(req,res) {
  try{
    let user = await User.findOne({_id: req.userId});
    if(user.Role == "ADMIN"){
      res.status(200).send(true);
    }else{
      res.status(200).send(false);
    }
  }catch(err){
    console.log(err)
  };
}

/**
* @name getAllNews
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function getAllNews(req,res) {
  try{
    let news = await News.find();
    let layout = await PostLayouts.find({Post_ID: {$in: news}})
    layout.reverse();
    res.status(200).send(layout);
  }catch(err){
    console.log(err)
  };
}

/**
* @name CheckPermission
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function CheckPermission(req,res) {
  try{
    if(req.userId == req.params.userId){
      res.status(200).send(true)
    }else{
      res.status(200).send(false)
    }
  }catch(err){
    console.log(err)
  };
}

/**
* @name SetOfflineState
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

async function SetOfflineState(req,res) {
  try{
    await User.findOneAndUpdate({_id:req.userId},{$set:{State: "Offline"}});
  }catch(err){
    console.log(err)
  };
}
