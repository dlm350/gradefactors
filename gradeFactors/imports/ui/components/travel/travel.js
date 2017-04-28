// Dependencies
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';

// Template
import template from './travel.jade';

// API Modules
import { Students } from '/imports/api/students';

// Travel Module
class Travel {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    // Subscription
    this.subReady = false;
    this.subscribe('travel', () => [], () => {
      this.subReady = true;
    })

    // Chart Colors
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

    // Bubble Chart
    this.chart = {
      labels: ['<15min', '15min-30min', '30min-1hr', '>1hr'],
      series: ['<15min', '15min-30min', '30min-1hr', '>1hr'],
      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'right',
          fullWidth: true,
          labels: {
            fontSize: 16
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                fontSize: 24,
                labelString: "Travel Time"
              },
              ticks: {
                display: false,
                min: 0,
                max: 5,
                stepSize: 1,
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Final Grade',
                fontSize: 24
              },
              ticks: {
                stepSize: 1,
                fontSize: 16
              }
            }
          ]
        }
      },
      datasetOverride: [],
    }

    this.helpers({
      // Data for Bubble Chart
      data() {
        let graphData = [ [/*<15min*/], [/*15-30min*/], [/*30min-1hr*/], [/*>1hr*/] ];

        // Group Students by Travel Time Values
        let groupedStudents = _.groupBy(Students.find().fetch(), 'traveltime');

        // Counter to Iterate Chart Data Array Position
        let n = 0;

        // Iterate Travel-Grouped Object
        for (let key in groupedStudents) {
          // Return if Grouping is not Finished
          if (key == 'undefined') return;

          // Group Students by G3 Values
          let groupedByGrade = _.groupBy(groupedStudents[key], "G3")

          // Iterate Grade-Grouped Students tp Determine Values for Chart Data Points
          for (let key2 in groupedByGrade) {
            // Normalize Length (# of Students) Value for Data Point Radius Visibility
            let normalizedLength = (20-4) / (34-0) * (groupedByGrade[key2].length-34) + 20;

            // Push Data Point Values to Chart Data Array
            // { X: Travel Time, Y: Grade Average, R: # of Students }
            graphData[n].push( { x: key, y: key2, r: Math.floor(normalizedLength) })
          }

          // Increment Chart Data Array Position
          n++;
        }

        return graphData;
      }
    });
  }
}

const name = 'travel';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: Travel
})
.config(config)

// Route/State Setup
function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('travel', {
      url: '/travel',
      template: '<travel></travel>'
    })
}