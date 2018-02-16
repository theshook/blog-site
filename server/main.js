import { Meteor } from 'meteor/meteor';

import '../imports/api/blogs.js';
import '../imports/api/users.js';
import '../imports/api/media.js';
import '../imports/api/messages.js';

import './facebook.js';

import '../imports/startup/routes.js';

Meteor.startup(() => {
  // code to run on server at startup
});
