import { Meteor } from 'meteor/meteor';
import { Students } from './collection';

if ( Meteor.isServer ) {
  Meteor.publish('students', function() {
    return Students.find();
  })
}