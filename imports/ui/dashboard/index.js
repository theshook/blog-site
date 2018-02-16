import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Blogs } from '../../api/blogs.js';
import '../../api/users.js';

import './index.html';

Template.dashboard.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('aBlogs');
});

Template.dashboard.helpers({
  users() {
    return Blogs.find();
  }
});