/**
 * Routes for express app
 */
const topics = require('../controllers/topics');
const express = require('express');
const users = require('../controllers/users');
const rooms = require('../controllers/rooms');
const mongoose = require('mongoose');
const Topic = mongoose.model('Topic');
const Room = mongoose.model('Topic');
const path = require('path');
const compiled_app_module_path = path.resolve(__dirname, '../../', 'public', 'assets', 'server.js');
const App = require(compiled_app_module_path);

module.exports = function(app, passport) {
    // user routes
    app.post('/api/login', users.postLogin);
    app.post('/api/signup', users.postSignUp);
    app.post('/api/logout', users.postLogout);

    app.get('/api/rooms', rooms.all);
    app.post('/api/rooms', rooms.create);
    app.get('/api/rooms/:id', rooms.get);
    app.put('/api/rooms/:id', rooms.update);

    // google auth
    // Redirect the user to Google for authentication. When complete, Google
    // will redirect the user back to the application at
    // /auth/google/return
    // Authentication with google requires an additional scope param, for more info go
    // here https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    app.get('/auth/google', passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ] }));

    // Google will redirect the user to this URL after authentication. Finish the
    // process by verifying the assertion. If valid, the user will be logged in.
    // Otherwise, the authentication has failed.
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));

    // topic routes
    app.get('/topic', topics.all);
    app.post('/topic/:id', (req, res) => topics.add(req, res));
    app.put('/topic/:id', (req, res) => topics.update(req, res));
    app.delete('/topic/:id', (req, res) => topics.remove(req, res));

    // This is where the magic happens. We take the locals data we have already
    // fetched and seed our stores with data.
    // App is a function that requires store data and url to initialize and return the React-rendered html string
    app.get('*', (req, res, next) => App.default(req, res));
};