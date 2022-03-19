import Documents from '../common/api/documents'
import EditingUsers from '../common/api/editingUsers'

// methods that provide write access to the data
Meteor.methods({
  // allows changes to the editing users collection
  addEditingUser: function () {
    var doc, user, eusers;
    doc = Documents.findOne();
    if (!doc) { return; }// no doc give up
    if (!this.userId) { return; }// no logged in user give up
    // now I have a doc and possibly a user
    user = Meteor.user().profile;
    eusers = EditingUsers.findOne({ docid: doc._id });
    if (!eusers) {// no editing users have been stored yet
      eusers = {
        docid: doc._id,
        users: {},
      };
    }
    user.lastEdit = new Date();
    eusers.users[this.userId] = user;
    // upsert- insert or update if filter matches
    EditingUsers.upsert({ _id: eusers._id }, eusers);
  }
})
