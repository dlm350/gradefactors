import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';

import template from './health.jade';

import { Students } from '/imports/api/students';

class Health {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subReady = false;
    this.subscribe('health', () => [], () => {
      this.subReady = true;
    })

    this.bar = {
      series: ['G1', 'G2', 'G3'],
      labels: ['Health 1', 'Health 2', 'Health 3', 'Heath 4', 'Health 5'],
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
                fontSize: 24
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

    this.line = {
      series: this.bar.labels,
      labels: this.bar.series,
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'top',
          fontSize: 24,
          text: 'Average Grades by Period'
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
                fontSize: 24
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
      barData() {
        let graphData = [ [/*G1*/], [/*G2*/], [/*G2*/] ];
        let groupedStudents = _.groupBy(Students.find().fetch(), 'health');

        for (let key in groupedStudents) {
          if (key == 'undefined') return;
          let count = groupedStudents[key].length;
          let total = {
            g1: 0,
            g2: 0,
            g3: 0
          };

          groupedStudents[key].forEach( (student) => {
            total.g1 += parseInt(student.G1);
            total.g2 += parseInt(student.G2);
            total.g3 += parseInt(student.G3);
          })

          graphData[0].push( (total.g1 / count).toFixed(2) );
          graphData[1].push( (total.g2 / count).toFixed(2) );
          graphData[2].push( (total.g3 / count).toFixed(2) );
        }

        return graphData;
      },
      lineData() {
        let graphData = [ [/*Health 1*/], [/*Health 2*/], [/*Health 3*/], [/*Health 4*/], [/*Health 5*/] ];
        let groupedStudents = _.groupBy(Students.find().fetch(), 'health');

        let n = 0;
        for (let key in groupedStudents) {
          if (key == 'undefined') return;
          let count = groupedStudents[key].length;
          let total = {
            g1: 0,
            g2: 0,
            g3: 0
          };

          groupedStudents[key].forEach( (student) => {
            total.g1 += parseInt(student.G1);
            total.g2 += parseInt(student.G2);
            total.g3 += parseInt(student.G3);
          })

          graphData[n].push( (total.g1 / count).toFixed(2) );
          graphData[n].push( (total.g2 / count).toFixed(2) );
          graphData[n].push( (total.g3 / count).toFixed(2) );
          n++;
        }

        return graphData;
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

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('health', {
      url: '/health',
      template: '<health></health>'
    })
}