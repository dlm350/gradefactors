// Dependencies
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';

// Template
import template from './average.jade';

// API Modules
import { Students } from '/imports/api/students';

// Average Module
class Average {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    // Subscription
    this.subReady = false;
    this.subscribe('average', () => [{
      // Reactively get Type Value to Renew Subscription
      type: this.getReactively('type')
    }], () => {
      this.subReady = true;
    })

    // Variables
    this.colors = [
      '#D46A6A',
      '#407F7F',
      '#D49A6A',
      '#55AA55',

      '#AA3939',
      '#226666',
      '#AA6C39',
      '#2D882D',

      '#801515',
      '#0D4D4D',
      '#804515',
      '#116611'
    ];
    this.type = '';
    this.labels = [];

    // Pie Chart
    this.pie = {
      type: 'pie',
      data: [],
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'top',
          fontSize: 20,
          text: '% of Total'
        },
        legend: {
          display: true,
          position: 'bottom',
          fullWidth: true,
          labels: {
            fontSize: 14
          }
        }
      },
      datasetOverride: []
    }
    // Bar Chart
    this.bar = {
      data: [ [], [] ],
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontSize: 24
              },
              ticks: {
                fontSize: 16
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Final Grade Average',
                fontSize: 24
              },
              ticks: {
                suggestedMin: 8,
                suggestedMax: 13,
                stepSize: 1,
                fontSize: 16
              }
            }
          ]
        }
      },
      datasetOverride: [
        {
          label: 'Min',
          type: 'line',
          showLine: false,
          pointRadius: 5,
          pointBackgroundColor: "rgb(255,64,129)",
          pointHoverBackgroundColor: "rgb(255,64,129)"
        },
        {
          label: 'Max',
          type: 'line',
          showLine: false,
          pointRadius: 5,
          pointBackgroundColor: "rgb(63,81,181)",
          pointHoverBackgroundColor: "rgb(63,81,181)"
        },
        {
          label: 'Average',
          type: 'bar',
          borderWidth: 0,
          backgroundColor: this.colors,
        }
      ]
    }

    this.helpers({
      // Types for Select Dropdown
      types() {
        return [
          {val: 'school', name: 'School'},
          {val: 'sex', name: 'Sex'},
          {val: 'age', name: 'Age'},
          {val: 'address', name: 'Address'},
          {val: 'famsize', name: 'Family Size'},
          {val: 'Pstatus', name: 'Parent Status'},
          {val: 'Medu', name: "Mother's Education"},
          {val: 'Fedu', name: "Father's Education"},
          {val: 'Mjob', name: "Mother's Job"},
          {val: 'Fjob', name: "Father's Job"},
          {val: 'reason', name: 'Reason for School'},
          {val: 'guardian', name: 'Guardian'},
          {val: 'traveltime', name: 'Travel Time'},
          {val: 'studytime', name: 'Study Time'},
          {val: 'failures', name: 'Past Failures'},
          {val: 'schoolsup', name: 'Extra Educational Support'},
          {val: 'famsup', name: 'Family Educational Support'},
          {val: 'paid', name: 'Extra Paid Classes'},
          {val: 'activities', name: 'Extra-Curricular Activities'},
          {val: 'nursery', name: 'Attended Nursery School'},
          {val: 'higher', name: 'Desire for Higher Education'},
          {val: 'internet', name: 'Internet Access'},
          {val: 'romantic', name: 'In Romantic Relationship'},
          {val: 'famrel', name: 'Family Quality'},
          {val: 'freetime', name: 'Frequency of Free Time'},
          {val: 'goout', name: 'Frequency of Going Out w/Friends'},
          {val: 'Dalc', name: 'Workday Alcohol Consumption'},
          {val: 'Walc', name: 'Weekend Alcohol Consumption'},
          {val: 'health', name: 'Health Status'},
          {val: 'absences', name: 'Absences'},
        ]
      },

      // Data for Charts
      students() {
        this.labels = [];
        this.bar.data = [ [/*Min*/], [/*Max*/], [/*Avg*/] ];
        this.pie.data = [ /*Total*/ ];

        // Set X-Axis Label
        this.bar.options.scales.xAxes[0].scaleLabel.labelString = this.type.name;

        // Sort Students by Value
        let sortedStudents = _.sortBy(Students.find().fetch(), this.type.val);

        let groupedStudents;
        // If Type is Absences, Requires Further Grouping
        if ( this.type.val == 'absences' ) {

          // Group Students by Custom Range
          // [ 0, 1-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61-70, 71-80, 81-90, 91-100 ]
          groupedStudents = _.groupBy(sortedStudents, function(student) {
            let absences = parseInt(student.absences);
            if( absences == 0 ) return '0';

            let n = 1;
            while ( n < 100 ) {
              // Return Value Range for Grouping
              if ( absences < n+10 ) return ( n.toString() + '-' + (n+9).toString() );
              n += 10;
            }
          });
        } else {
          // Group Students by Type Value
          groupedStudents = _.groupBy(sortedStudents, this.type.val);
        }

        // Iterate Grouped Object to Determine Values for Chart Data
        for (let key in groupedStudents) {
          // Return if Grouping is not Finished
          if (key == 'undefined') return;

          // Set Count for Average Calculation
          let count = groupedStudents[key].length;
          let total = 0;
          let min = 20;
          let max = 0;

          // Iterate Students to Calculate Minimum, Maximum, and Total Values
          groupedStudents[key].forEach( (student) => {
            let grade = parseInt(student.G3);
            total += grade;
            min = (grade < min) ? grade : min;
            max = (grade > max) ? grade : max;
          })

          // Push Key String Value as Label
          this.labels.push(key);

          // Push Minimum, Maximum, and Average Values to Bar Chart Data Array
          this.bar.data[0].push( min );
          this.bar.data[1].push( max );
          this.bar.data[2].push( (total / count).toFixed(2) );

          // Push Count Value to Pie Chart Data Array
          this.pie.data.push( count );
        }
      }
    });
  }

  // Toggles between Pie and Polar Chart Type
  toggleChart() {
    this.pie.type = (this.pie.type == 'pie') ? 'polarArea' : 'pie';
  }
}

const name = 'average';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: Average
})
.config(config)

// Route/State Setup
function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('average', {
      url: '/average',
      template: '<average></average>'
    })
}