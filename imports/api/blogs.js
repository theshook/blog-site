import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random'

export const Blogs = new Mongo.Collection('blogs');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('blogs', function blogsPublication() {
    return Blogs.find();
  });

  Meteor.publish('aBlogs', function aBlogsPublication() {
    ReactiveAggregate(this, Blogs, [{
      $group : {
        _id : '$owner',
        count: { $sum: 1 }
      }
    }, 
    {$sort : {count: -1}},
    {$limit: 3},
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'auser',
      }
    }
    ]);
  });
}

Meteor.methods({
  'blogs.insert' (id, title, blog, media) {
    Blogs.insert({
      title,
      blog,
      media,
      createdAt: new Date(),
      owner: id
    });
  },
  'blogs.delete.post'(id){
    Blogs.remove({_id: id});
  },
  'blogs.comment' (postId, userId, name, comment) {
    Blogs.update(
      {_id: postId},
      {
      $addToSet: {
        comments: {
          'commentId': Random.id(),
          userId,
          name,
          comment,
          createdAt: new Date()
        }
      }
    });
  },
  'blogs.post.update'(postId, title, blog) {
    Blogs.update(
      {_id: postId},
      {
        $set: {
          title,
          blog
        }
      }
    );
  },
  'blogs.comment.update'(postId, name, createdaAt, commentt) {
    Blogs.update(
      { _id: postId,
        comments: { $elemMatch: { 'name': name, 'createdAt': createdaAt }}},
      { $set: { 'comments.$.comment': commentt}}
    );
  },
  'blogs.comment.delete'(postId, name, createdaAt, commentt, useriId, cid) {
    Blogs.update({_id: postId},
    { $pull: {'comments': {'commentId': cid}}}
    );
  }
});
