import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';

import moment from 'moment';

import '../../api/users.js';
import { Messages } from '../../api/messages.js';

import './gc.html';

let gcode;

newDate = function (val) {
  if (val instanceof Date) {
    return moment(val).calendar();
  } else {
    return "Never";
  }
}

Template.gc.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('umessage');
  Meteor.subscribe('messages');
  Meteor.subscribe('users');
  gcode = FlowRouter.getParam('gcode');
});

Template.gc.helpers({
  usersC(id) {
    let a = Meteor.users.findOne({_id: id});
    if(a) {
      return a.profile.name;
    }
  },
  messagesC() {
    gcode = FlowRouter.getParam('gcode')
    return Messages.find({chatId: FlowRouter.getParam('gcode')});
  },
  // messagesC() {
  //   let id = Messages.find({chatId: gcode}).fetch();
  //   console.log(Meteor.user.find({chatId: gcode}).fetch());
  //   return Messages.find({chatId: FlowRouter.getParam('gcode')});
  // },
  date(dateTime) {
    return newDate(dateTime);
  },
  code(){
    return FlowRouter.getParam('gcode');;
  }
});

Template.gc.events({
  'click .send'() {
    gcode = FlowRouter.getParam('gcode')
    let message = document.querySelector('#message').value;
    Meteor.call('message.add.message', gcode, Meteor.userId(), message)
    document.querySelector('#message').value = '';
  }
})