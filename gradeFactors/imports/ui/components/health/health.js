// Dependencies
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';

// Template
import template from './health.jade';

// API Modules
import { Students } from '/imports/api/students';

// Health Module
class Health {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    // Subscription
    this.subReady = false;
    this.subscribe('health', () => [], () => {
      this.subReady = true;
    })

    // Health Colors
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

    // Bar Chart Object
    this.bar = {
      series: ['1st Period', '2nd Period', 'Final Grade'],
      labels: ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'],
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'top',
          fontSize: 24,
          text: 'Average Grades by Health Quality'
        },
        legend: {
          display: true,
          position: 'top',
          fullWidth: true,
          labels: {
            fontSize: 16
          }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontSize: 24,
                labelString: 'Health Quality'
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
                fontSize: 24.,
                labelString: 'Average Grade'
              },
              ticks: {
                stepSize: 0.5,
                fontSize: 16
              }
            }
          ]
        }
      },
      datasetOverride: []
    }

    // Line Chart Object
    this.line = {
      series: this.bar.labels,
      labels: this.bar.series,
      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          fullWidth: true,
          labels: {
            fontSize: 16
          }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontSize: 24,
                labelString: 'Grade Category'
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
                fontSize: 24,
                labelString: 'Grade Average'
              },
              ticks: {
                fontSize: 16
              }
            }
          ]
        }

      },
      datasetOverride: []
    }

    this.helpers({
      // Data for Bar Chart
      barData() {
        let chartData = [ [/*G1*/], [/*G2*/], [/*G2*/] ];

        // Group Students by Health Quality Values
        let groupedStudents = _.groupBy(Students.find().fetch(), 'health');

        // Iterate Grouped Object to Determine Values for Bar Chart Data
        for (let key in groupedStudents) {
          // Return if Grouping is not Finished
          if (key == 'undefined') return;

          // Set Count for Average Calculation
          let count = groupedStudents[key].length;
          let total = {
            g1: 0,
            g2: 0,
            g3: 0
          };

          // Iterate Students to Calculate Averages
          groupedStudents[key].forEach( (student) => {
            total.g1 += parseInt(student.G1);
            total.g2 += parseInt(student.G2);
            total.g3 += parseInt(student.G3);
          })

          // Push Average Values to Bar Chart Data Array
          chartData[0].push( (total.g1 / count).toFixed(2) );
          chartData[1].push( (total.g2 / count).toFixed(2) );
          chartData[2].push( (total.g3 / count).toFixed(2) );
        }

        return chartData;
      },

      // Data for Line Chart
      lineData() {
        let chartData = [ [/*Health 1*/], [/*Health 2*/], [/*Health 3*/], [/*Health 4*/], [/*Health 5*/] ];

        // Group Students by Health Quality Values
        let groupedStudents = _.groupBy(Students.find().fetch(), 'health');

        // Counter to Iterate Chart Data Array Position
        let n = 0;

        // Iterate Grouped Object to Determine Values for Line Chart Data
        for (let key in groupedStudents) {
          // Return if Grouping is not Finished
          if (key == 'undefined') return;

          // Set Count for Average Calculation
          let count = groupedStudents[key].length;
          let total = {
            g1: 0,
            g2: 0,
            g3: 0
          };

          // Iterate Students to Calculate Averages
          groupedStudents[key].forEach( (student) => {
            total.g1 += parseInt(student.G1);
            total.g2 += parseInt(student.G2);
            total.g3 += parseInt(student.G3);
          })

          // Push Average Values to Line Chart Data Array
          chartData[n].push( (total.g1 / count).toFixed(2) );
          chartData[n].push( (total.g2 / count).toFixed(2) );
          chartData[n].push( (total.g3 / count).toFixed(2) );

          // Increment Chart Data Array Position
          n++;
        }

        return chartData;
      }
    });
  }
}

const name = 'health';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: Health
})
.config(config)

// Route/State Setup
function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('health', {
      url: '/health',
      template: '<health></health>'
    })
}