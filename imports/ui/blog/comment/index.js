import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session'

import moment from 'moment';

import { Blogs } from '../../../api/blogs.js';
import Images  from '../../../api/media.js';

import './index.html';

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}

let urlId, blogs;

blog = function(id) {
  return blogs = Blogs.findOne({_id: id});
}

Template.comment.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('blogs');
});

Template.comment.helpers({
  blog() {
    urlId = FlowRouter.getParam('id');
    blog(urlId)
    return blogs;
  },
  user() {
    urlId = FlowRouter.getParam('id');
    if (blog(urlId)) {
      let user = Meteor.users.findOne({_id: blogs.owner});
      return user;
    }
  },
  blogComment() {
    urlId = FlowRouter.getParam('id');
    return Blogs.find({_id: urlId});
  },
  date(dateTime) {
    return newDate(dateTime);
  },
  uploadedFiles () {
    if (blog(urlId)) {
      return Images.findOne(blogs.media);
    }
  },
  isOwner() {
    if (blog(urlId)) {
      return blogs.owner === Meteor.userId();
    }
  },
  isComment() {
    let a = Blogs.find({ $and: [ { _id: urlId }, 
      { comments: { $elemMatch: { userId: Meteor.userId() } } } ] }).fetch();
    if(a.length == 0) {
      return false;
    } else {
      return true;
    }
  }
});

Template.comment.events({
  'submit .commentText'(e, template) {
    e.preventDefault();

    const t = e.target;
    const comment = t.comment.value;
    let postId = FlowRouter.getParam('id');
    Meteor.call('blogs.comment', postId, Meteor.userId(), Meteor.user().profile.name, comment)
    
    template.find("form").reset();
  },
  'click .updatePost'() {
    let title = document.querySelector("#title").value;
    let blog = document.querySelector("#blog").value;
    Meteor.call('blogs.post.update', urlId, title, blog);
  },
  'click .editComment'() {
    document.querySelector("#name").innerHTML = this.name;
    document.querySelector("#desc").value = this.comment;
    Session.set('date', this.createdAt);
  },
  'click .updateComment'() {
    let name, desc;
    name = document.querySelector("#name").innerHTML;
    desc = document.querySelector("#desc").value;

    Meteor.call('blogs.comment.update', urlId, name, new Date(Session.get('date')), desc)
  },
  'click .delete'() {
    if (Roles.userIsInRole(Meteor.user(), ['Admin'])) {
      Meteor.call('blogs.delete.post', urlId);
      FlowRouter.go('/blogs');
    } else {
      console.log('You are not permitted to to this function.');
    }
  },
  'click .deleteComment'() {
    let name, desc;
    name = this.name;
    desc = this.comment;
    Session.set('date', this.createdAt);

    Meteor.call('blogs.comment.delete',urlId, name, new Date(Session.get('date')), desc, this.userId, this.commentId)
  }
});