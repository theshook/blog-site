import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import '../../../api/blogs.js';
import Images  from '../../../api/media.js';

import './index.html';

Template.blogNew.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.blogNew.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.blogNew.events({
  'submit .newBlog' (e, template) {
    e.preventDefault();

    const target = e.target;
    const title = target.title.value;
    const desc = target.desc.value;
    const file = target.picture.files[0];
    
    if (file) {
      var uploadInstance = Images.insert({
        file: file,
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      uploadInstance.on('start', function() {
        template.currentUpload.set(this);
      });

      uploadInstance.on('end', function(error, fileObj) {
        if (error) {
          window.alert('Error during upload: ' + error.reason);
        } else {
          window.alert('File successfully uploaded');

          Meteor.call('blogs.insert', Meteor.userId(), title, desc, fileObj._id, function(err) {
            if (err) {
              return console.log(err);
            } else {
              FlowRouter.go('/blogs');
            }
          });

        }
        template.currentUpload.set(false);
      });

      uploadInstance.start();
    } else {
      Meteor.call('blogs.insert', Meteor.userId(), title, desc, null, function(err) {
        if (err) {
          return console.log(err);
        } else {
          FlowRouter.go('/blogs');
        }
      });
    }
  }
});