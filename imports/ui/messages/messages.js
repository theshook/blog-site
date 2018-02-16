import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';

import moment from 'moment';

import '../../api/users.js';
import { Messages } from '../../api/messages.js';

import './messages.html';

let userId;

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}

Template.message.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('users');
  Meteor.subscribe('messages');
  userId = FlowRouter.getParam('uid');
});

Template.message.helpers({
  users() {
    return user = Meteor.users.findOne({_id: userId});
  },
  messagesC() {
    let fromId = FlowRouter.getParam('rid');
    let toId = userId;
    return Messages.find({ users: {$all:[fromId, toId]}});
  },
  date(dateTime) {
    return newDate(dateTime);
  },
});

Template.message.events({
  'click .send'() {
    let toId = userId;
    let fromId = FlowRouter.getParam('rid');
    let message = document.querySelector('#message').value;
    let chatId = Messages.find({ users: {$all:[fromId, toId]}}).fetch();
    
    console.log(chatId.length)
    if(chatId.length === 0) {
      Meteor.call('messages.insert', toId, fromId, message, function(err, res) {
        if (err) {
          console.log(error.reason);
        } else {
          document.querySelector('#message').value = "";
        }
      });
    } else {
      Meteor.call('message.reInsert', chatId[0]._id, toId, fromId, message, function(err, res) {
        if (err) {
          console.log(error.reason);
        } else {
          document.querySelector('#message').value = "";
        }
      });
    }
  }
})