import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    return Meteor.users.find({});
  });
}

Meteor.methods({
  'update.userRoles' (id) {
    try {
      Roles.addUsersToRoles(id, 'Contributor' );
    } catch(e) {
      return e;
    }
  },
  'register' (user) {
    try {
      
      var id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
          fname: user.fname,
          lname: user.lname,
        },
        roles: 'Contributor',
      });

      console.log(id, 'id moto');
      
    } catch(e) {
      return console.log(e);
    }
    }
});