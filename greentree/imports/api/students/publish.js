import { Meteor } from 'meteor/meteor';
import { Students } from './collection';

if ( Meteor.isServer ) {
  Meteor.publish('students', function() {
    return Students.find();
  });

  Meteor.publish('average', function(options) {
    if (!options.type) return;
    let queryOptions = {
      fields: {
        G3: 1
      }
    }

    if ( options.type ) queryOptions.fields[options.type.val] = 1;

    return Students.find({}, queryOptions);
  });

  Meteor.publish('travel', function() {
    return Students.find({}, {fields: {G3: 1, traveltime: 1}})
  });

  Meteor.publish('health', function() {
    return Students.find({}, {fields: {G1: 1, G2: 1, G3: 1, health: 1}})
  });
}