import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Comments = new Mongo.Collection('comments');


Comments.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  body: {
    type: String,
    label: "Comment",
    max: 1000
  },
  docid: {
    type: String,
  },
  owner: {
    type: String,
  },
}));

export default Comments;
