import { Meteor } from 'meteor/meteor';
import { Students } from '../imports/api/students';

Meteor.startup(() => {
  if(Students.find().count() <= 0) {
    console.log('No Students Found, Load CSV');
    Assets.getText('students.csv', function(err, res) {
      console.log('CSV Loaded, Parse Data');
      let results = Papa.parse(res, {
        header: true
      });

      console.log('Data Parsed, Load into DB');
      results.data.forEach(function(each){
        if ( each.school ) {
          Students.insert(each);
        }
      })
    });
  }
});
