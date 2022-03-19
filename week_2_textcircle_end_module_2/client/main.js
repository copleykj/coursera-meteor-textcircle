import { Template } from 'meteor/templating';
import Documents from '../common/api/documents';
import EditingUsers from '../common/api/editingUsers';
import { jQuery } from 'meteor/jquery';
import './accounts-config';
import '../common/methods'
import './main.html';

// code in this file that runs on the client.
// instead of using Meteor.isServer or Meteor.isClient,
// we can use main.js files located in client and server folders

// find the first document in the Documents colleciton and send back its id
Template.editor.helpers({
  docid: function () {
    var doc = Documents.findOne();
    if (doc) {
      return doc._id;
    }
    else {
      return undefined;
    }
  },
  // template helper that configures the CodeMirror editor
  // you might also want to experiment with the ACE editor
  config: function () {
    return function (editor) {
      editor.setOption("mode", "html");
      editor.on("change", function (cm_editor, info) {
        //console.log(cm_editor.getValue());
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
      });
    }
  },
});

Template.editingUsers.helpers({
  // retrieve a set of users that are editing this document
  users: function () {
    var doc, eusers, users;
    doc = Documents.findOne();
    if (!doc) { return; }// give up
    eusers = EditingUsers.findOne({ docid: doc._id });
    if (!eusers) { return; }// give up
    users = new Array();
    var i = 0;
    for (var user_id in eusers.users) {
      users[i] = fixObjectKeys(eusers.users[user_id]);
      i++;
    }
    return users;
  }
});


function fixObjectKeys (obj) {
  var newObj = {};
  for (key in obj) {
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}
