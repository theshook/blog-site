import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';

import moment from 'moment';

import { Blogs } from '../../api/blogs.js';
import Images  from '../../api/media.js';


import './index.html';
import './new/index.js';
import './comment/index.js';

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}

Template.blog.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('blogs');
});

Template.blog.helpers({
  blogs() {
    return Blogs.find({}, {sort: { createdAt: -1 } } );
  },
  date() {
    return newDate(this.createdAt);
  },
});

Template.uploadedFiles.helpers({
  uploadedFiles () {
    return Images.find(this.media);
  }
});
