import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Random } from 'meteor/random';

import { Messages } from '../../api/messages.js';

import './index.html';

Template.navbar.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('messages');
});

Template.navbar.helpers({
  myGC() {
    return Messages.find({'users': {$elemMatch: {userId: Meteor.userId()}}});
  }
});

Template.navbar.events({
  'click .logout' () {
    Meteor.logout( function (err, res) {
      if (err) {
        console.log('error');
      } else {
        FlowRouter.go('/');
      }
    });
  },
  'click .create'() {
    let gcode = Random.id();
    Meteor.call('message.create.groupChat', gcode, Meteor.userId(), function(err, res) {
      if (err) {
        console.log('error');
      } else {
        FlowRouter.go('/messages/g/'+gcode);
      }
    });
  },
  'click .join'() {
    let gcode = document.querySelector('#gcode').value;
    Meteor.call('message.add.groupChat', gcode, Meteor.userId(), function(err, res) {
      if (err) {
        console.log('error');
      } else {
        FlowRouter.go('/messages/g/'+gcode);
      }
    });
  },
  'click .go'() {
    FlowRouter.go('/messages/g/'+this.chatId)
  }
});