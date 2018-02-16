import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout'

//Landing Page
FlowRouter.route('/', {
  name: 'landing',
  action () {
    if (!Meteor.userId()) {
      BlazeLayout.render('layout', {landing: 'landing'});
    } else {
      FlowRouter.go('/dashboard');
    }
  }
});

//Login Page
FlowRouter.route('/login', {
  name: 'login',
  action () {
    if (!Meteor.userId()) {
      BlazeLayout.render('layout', {landing: 'login'});
    } else {
      FlowRouter.go('/dashboard');
    }
  }
});

//Signup Page
FlowRouter.route('/signup', {
  name: 'signup',
  action () {
    if (!Meteor.userId()) {
      BlazeLayout.render('layout', {landing: 'signup'});
    } else {
      FlowRouter.go('/dashboard');
    }
  }
});

//Dashboard Page
FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action () {
    if (Meteor.userId()) {
      //Dashboard Page
      BlazeLayout.render('layout', {main: 'dashboard'});
    } else {
      FlowRouter.go('/');
    }
  }
});

//Blogs Pages
var blogsRoute = FlowRouter.group({
  prefix: '/blogs',
  name: 'blogs'
});

// handling /blogs route
blogsRoute.route('/', {
  action: function() {
    BlazeLayout.render('layout', {main: 'blog'});
  }
});

// handling /blogs route
blogsRoute.route('/new', {
  action: function() {
    BlazeLayout.render('layout', {main: 'blogNew'});
  }
});

// handling /blogs route
blogsRoute.route('/:id', {
  action: function() {
    BlazeLayout.render('layout', {main: 'comment'});
  }
});

//Users Pages
var usersRoute = FlowRouter.group({
  prefix: '/users',
  name: 'users'
});

// handling /users route
usersRoute.route('/:id', {
  action: function() {
    BlazeLayout.render('layout', {main: 'users'});
  }
});

//Messages Pages
var messagesRoute = FlowRouter.group({
  prefix: '/messages',
  name: 'messages'
});

// handling /messages route
messagesRoute.route('/p/:uid/:rid', {
  action: function() {
    BlazeLayout.render('layout', {main: 'message'});
  }
});

// handling /messages route
messagesRoute.route('/g/:gcode', {
  action: function() {
    BlazeLayout.render('layout', {main: 'gc'});
  }
});