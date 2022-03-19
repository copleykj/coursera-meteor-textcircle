import { Meteor } from 'meteor/meteor';
import Documents from '../common/api/documents';

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
