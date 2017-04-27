import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';

import template from './travel.jade';

import { Students } from '/imports/api/students';

class Travel {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subReady = false;
    this.subscribe('travel', () => [], () => {
      this.subReady = true;
    })

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
                max: 4,
                stepSize: 1,
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
      data() {
        let graphData = [[], [], [], []];
        let groupedStudents = _.groupBy(Students.find().fetch(), 'traveltime');

        let n = 0;
        for (let key in groupedStudents) {
          if (key == 'undefined') return;
          let groupedByGrade = _.groupBy(groupedStudents[key], "G3")

          for (let key2 in groupedByGrade) {
            let normalizedValue = (20-4) / (34-0) * (groupedByGrade[key2].length-34) + 20;
            graphData[n].push( { x: key, y: key2, r: Math.floor(normalizedValue) })
          }
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

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('travel', {
      url: '/travel',
      template: '<travel></travel>'
    })
}