import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Random } from 'meteor/random';

import moment from 'moment';

import '../../api/users.js';

import { Blogs } from '../../api/blogs.js';
import { Messages } from '../../api/messages.js';

import './users.html';

let id;

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}

Template.users.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('users');
  Meteor.subscribe('blogs');
  id = FlowRouter.getParam('id');
});

Template.users.helpers({
  blogs() {
    return Blogs.find({owner: id}, {sort: { createdAt: -1 } } );
  },
  users() {
    let user = Meteor.users.findOne({_id: id});
    if (user) {
      Session.set('uid', user._id);
      return user;
    }
  },
  isOwner() {
    return id == Meteor.userId();
  },
  date(dateTime) {
    return newDate(dateTime);
  },
});

Template.users.events({
  'click .PmMessage'() {
    FlowRouter.go('/messages/p/'+Session.get('uid')+'/'+Meteor.userId());
  }
})