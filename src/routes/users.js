const User = require('../models/user');
const UserSession = require('../models/user_session.js')

module.exports = function (app) {
  app.get("/signup", function (req, res) {
    res.render('signup');
  });
  app.post("/signup", function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let nickname = req.body.nickname
    User.create(nickname, email, password).then((user) => {
      res.redirect('/login');
    }).catch((err) => {
      console.log(err);
      res.render("signup", { error: true });
    });
  });
  app.get('/login', function (req, res) {
    res.render('login');
  })
  app.post('/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    //正しいかどうかチェック
    User.authenticate(email, password).then((user) => {
      return UserSession.create(user);
    }).then((session) => {
      res.cookie("session_id", session.data.id, {
        path: "/",//ルート
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
        signed: true
      });
      res.redirect("/");
    }).catch((err) => {
      res.render("login", { error: true });
    })
  });
  app.get("/toppage", function (req, res) {
    res.render('toppage');
  });
  app.get("/terms", function (req, res) {
    res.render('terms');
  });
  app.get("/timeline", function (req, res) {
    res.render('timeline');
  });
  app.get('/user_profile/:nickname', function (req, res) {
    let nickname = req.params.nickname;
    User.find_by_nickname(nickname).then((user) => {
      res.render("user_profile", { nickname: user.data.nickname, email: user.data.email, password: user.data.password });
    }).catch((err) => {
      res.render("login", { error: true });
    })
  });
  app.get("/logout", function (req, res) {
    res.render('logout');
  });
  app.post('/logout', function (req, res) {
    let sessionId = req.signedCookies.session_id;
    if(sessionId == null || sessionId === undefined) {
      return res.status(400).send("Not logged in");
    }
    UserSession.find(sessionId).then((session)=>{
      return session.destroy();
    }).then((session) => {
      res.clearCookie("session_id", {
        path: "/",//ルート
        httpOnly: true,
        signed: true
      });
      res.redirect("/");
    }).catch((err) => {
      res.render("login", { error: true });
    })
  });
}

