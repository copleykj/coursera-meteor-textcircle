import { Template } from 'meteor/templating';
import Documents from '../common/api/documents';
import { jQuery } from 'meteor/jquery';
import './main.html';

window.jQuery = jQuery;

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
