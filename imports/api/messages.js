import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('messages', function messagesPublication() {
    return Messages.find({});
  });
}

Meteor.methods({
  'messages.insert' (toId, fromId, message) {
    Messages.insert({
      users: [toId, fromId],
      messages: [{
        messageId: Random.id(),
        fromId,
        message,
        mDate: new Date()
      }],
      createdAt: new Date()
    });
  },
  'message.reInsert' (chatId, toId, fromId, message) {
    Messages.update(
      {_id: chatId},
      {
        $addToSet: {
          messages: {
          messageId: Random.id(),
          fromId,
          message,
          mDate: new Date()
          }
        }
      }
    );
  },
  'message.create.groupChat'(chatId, userId) {
    Messages.insert({
      chatId,
      users: [{userId}],
      createdAt: new Date()
    })
  },
  'message.add.groupChat'(chatId, userId) {
    Messages.update({'chatId':chatId},{
      $addToSet: {
        users: {userId}
      }
    })
  },
  'message.add.message'(chatId, userId, message) {
    Messages.update({'chatId': chatId}, {
      $addToSet: {
        messages: {
          messageId: Random.id(),
          userId,
          message,
          mDate: new Date()
        }
      }
    })
  }
});
