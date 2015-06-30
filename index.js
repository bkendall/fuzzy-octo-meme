var express = require('express');
var app = express();

var session = require('express-session');
var bodyParser = require('body-parser');

var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

app.use(session({
  secret: 'thisIsASecret'
}));
app.use(bodyParser.json());

passport.use(new GithubStrategy({
  clientID: process.env.FOM_CLIENT_ID,
  clientSecret: process.env.FOM_CLIENT_SECRET,
  callbackUrl: 'https://fuzzy-octo-meme-staging-bkendall.runnableapp.com/auth/github/callback'
}, function (accessToken, refreshToken, profile, done) {
  console.log('here is what we got back', arguments);
  done();
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  function (req, res) {
    res.end('<a href="/auth/github">Login with GitHub</a>');
  });

app.get('/auth/github',
  passport.authenticate('github'),
  function () {
    console.error('this should not be called (was redirected)');
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/#login' }),
  function (req, res) {
    res.redirect('/#callback-failed');
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/#logged-out');
  });

app.listen(process.env.PORT || 8080);
