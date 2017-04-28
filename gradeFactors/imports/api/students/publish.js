import { Meteor } from 'meteor/meteor';
import { Students } from './collection';

if ( Meteor.isServer ) {
  // Base Publication for Students
  Meteor.publish('students', function() {

    // Returns all Students
    return Students.find();
  });

  // Publication for Average Module
  Meteor.publish('average', function(options) {
    if (!options.type) return;
    let queryOptions = {
      fields: {
        G3: 1
      }
    }

    if ( options.type ) queryOptions.fields[options.type.val] = 1;

    // Returns all Students with _id, G3, and (Type) fields.
    return Students.find({}, queryOptions);
  });

  // Publication for Travel Module
  Meteor.publish('travel', function() {
    // Returns all Students with _id, G3, and traveltime fields.
    return Students.find({}, {fields: {G3: 1, traveltime: 1}})
  });

  // Publication for Health Module
  Meteor.publish('health', function() {
    // Returns all Students with _id, G1, G2, G3, and health fields.
    return Students.find({}, {fields: {G1: 1, G2: 1, G3: 1, health: 1}})
  });
}