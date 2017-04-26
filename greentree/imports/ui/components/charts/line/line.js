import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';
import { Meteor } from 'meteor/meteor';

import template from './line.jade';

import { Students } from '/imports/api/students';

class LineChart {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('bubbleChart')

    // this.data = [];
    this.labels = [];
    this.datasetOverride = [];
    this.options = {
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
        fullWidth: true
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              fontSize: 16,
              labelString: "Travel Time"
            },
            ticks: {
              min: 0,
              max: 4,
              stepSize: 1
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              stepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: 'Final Grade Average',
              fontSize: 16
            }
          }
        ]
      }
    }

    this.helpers({
      data() {
        let graphData = [];
        let groupedStudents = _.groupBy(Students.find().fetch(), 'traveltime');

        for (let key in groupedStudents) {
          if (key == 'undefined') return;
          let groupedByGrade = _.groupBy(groupedStudents[key], "G3")

          for (let key2 in groupedByGrade) {
            let normalizedValue = (20-4) / (34-0) * (groupedByGrade[key2].length-34) + 20;
            graphData.push( { x: key, y: key2, r: Math.floor(normalizedValue) })
          }
        }
        console.log(graphData)
        return graphData;
      }
    });
  }
}

const name = 'lineChart';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: LineChart
})
.config(config)

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('line_chart', {
      url: '/line-chart',
      template: '<line-chart></line-chart>'
    })
}