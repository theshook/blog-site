import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../../../api/users.js';

import './index.html';

Template.login.events({
  'click .facebook'() {
    Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err){
      if (err) {
        console.log('Handle errors here: ', err);
      } else {
        Meteor.call('update.userRoles', Meteor.userId());
        FlowRouter.go('/');
      }
    });
  },
  'submit .login'(e) {
    e.preventDefault();

    const t = e.target;
    const email = t.email.value;
    const pass = t.password.value;

    Meteor.loginWithPassword(email, pass, function(err, res) {
      FlowRouter.go('/dashboard');
    });
  }
});