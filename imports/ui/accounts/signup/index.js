import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../../../api/users.js';

import './index.html';

Template.signup.events({
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
  'submit .signup' (e) {
    e.preventDefault();
    const t = e.target;

    const email = t.email.value;
    const fname = t.fname.value;
    const lname = t.lname.value;
    const password = t.password.value;
    const repassword = t.repassword.value;

    if(password != repassword) {
      return console.log('Invalid password');
    }

    // Meteor.call('register', {email, password, fname, lname},
    // function(err, res) {
    //   if(res) {
    //     console.log(res,'eto');
    //   } else {
    //     console.log(err, 'yan');
    //   }
    // });
    var user = {email, fname, lname, password}
    Accounts.createUser({
      email: user.email,
      password: user.password,
      profile: {
        name: user.fname + " " + user.lname
      }
    }, function(err, res) {
      if (res) {
        Meteor.call('update.userRoles', Meteor.userId());
        FlowRouter.go('/');

      }
    });
  }
});