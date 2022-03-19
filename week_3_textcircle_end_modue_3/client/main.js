import { Template } from 'meteor/templating';
import Documents from '../common/api/documents';
import EditingUsers from '../common/api/editingUsers';
import { jQuery } from 'meteor/jquery';
import { Session } from 'meteor/session';
import './accounts-config';
import '../common/methods'
import './main.html';

// code in this file that runs on the client.
// instead of using Meteor.isServer or Meteor.isClient,
// we can use main.js files located in client and server folders
Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");

Template.editor.helpers({
  // return the id of the currently loaded doc
  docid: function () {
    setupCurrentDocument();
    return Session.get("docid");
  },
  // configure the CodeMirror editor
  config: function () {
    return function (editor) {
      editor.setOption("lineNumbers", true);
      editor.setOption("theme", "cobalt");
      // respond to edits in the code editor window
      editor.on("change", function (cm_editor, info) {
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
        Meteor.call("addEditingUser");
      });
    }
  },
});

Template.editingUsers.helpers({
  // return users editing current document
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

Template.navbar.helpers({
  // return a list of all visible documents
  documents: function () {
    return Documents.find();
  }
});

Template.docMeta.helpers({
  // return current document
  document: function () {
    return Documents.findOne({ _id: Session.get("docid") });
  },
  // return true if I am allowed to edit the current doc, false otherwise
  canEdit: function () {
    var doc;
    doc = Documents.findOne({ _id: Session.get("docid") });
    if (doc) {
      if (doc.owner == Meteor.userId()) {
        return true;
      }
    }
    return false;
  }
});

Template.editableText.helpers({
  // return true if I am allowed to edit the current doc, false otherwise
  userCanEdit: function (doc, Collection) {
    // can edit if the current doc is owned by me.
    doc = Documents.findOne({ _id: Session.get("docid"), owner: Meteor.userId() });
    if (doc) {
      return true;
    }
    else {
      return false;
    }
  }
});

Template.navbar.events({
  // add a new document button
  "click .js-add-doc": function (event) {
    event.preventDefault();
    console.log("Add a new doc!");
    if (!Meteor.user()) {// user not available
      alert("You need to login first!");
    }
    else {
      // they are logged in... lets insert a doc
      var id = Meteor.call("addDoc", function (err, res) {
        if (!err) {// all good
          console.log("event callback received id: " + res);
          Session.set("docid", res);
        }
      });
    }
  },
  // load a document link
  "click .js-load-doc": function (event) {
    //console.log(this);
    Session.set("docid", this._id);
  }
});

Template.docMeta.events({
  // toggle the private checkbox
  "click .js-tog-private": function (event) {
    console.log(event.target.checked);
    var doc = { _id: Session.get("docid"), isPrivate: event.target.checked };
    Meteor.call("updateDocPrivacy", doc);

  }
});

function setupCurrentDocument () {
  var doc;
  if (!Session.get("docid")) {// no doc id set yet
    doc = Documents.findOne();
    if (doc) {
      Session.set("docid", doc._id);
    }
  }
}

function fixObjectKeys (obj) {
  var newObj = {};
  for (key in obj) {
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}
