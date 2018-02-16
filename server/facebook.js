if (Meteor.isServer) {
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '960422254123217',
    secret: '0e3d29d579020f23803b5b7e3e24e754'
  });
}