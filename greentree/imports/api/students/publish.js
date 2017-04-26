import { Meteor } from 'meteor/meteor';
import { Students } from './collection';

if ( Meteor.isServer ) {
  Meteor.publish('students', function() {
    return Students.find();
  });

  Meteor.publish('barChart', function(options) {
    if (!options.type) return;
    let queryOptions = {
      fields: {
        G3: 1
      }
    }

    if ( options.type ) queryOptions.fields[options.type.val] = 1;

    return Students.find({}, queryOptions);
  });

  Meteor.publish('bubbleChart', function() {
    return Students.find({}, {fields: {G3: 1, traveltime: 1}})
  })
}