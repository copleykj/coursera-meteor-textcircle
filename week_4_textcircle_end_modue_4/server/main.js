import { Meteor } from 'meteor/meteor';
import Documents from '../common/api/documents';
import EditingUsers from '../common/api/editingUsers';
import Comments from '../common/api/comments';
import '../common/methods.js'


// Code in this file that runs on the server.
// instead of using Meteor.isServer or Meteor.isClient,
// we can use main.js files located in client and server folders

// Run code only after meteor has fully started
Meteor.startup(() => {
  // startup code that creates a document in case there isn't one yet.
  if (!Documents.findOne()) {// no documents yet!
    Documents.insert({ title: "my new document" });
  }
});

// publish a list of documents the user can se
Meteor.publish("documents", function () {
  return Documents.find({
    $or: [
      { isPrivate: false },
      { owner: this.userId }
    ]
  });
});

// public sets of editing users
Meteor.publish("editingUsers", function () {
  return EditingUsers.find();
});

// publish coments on docs
Meteor.publish("comments", function () {
  return Comments.find();
})
