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

    this.subscribe('barChart', () => [{
      type: this.getReactively('type')
    }])

    this.type = '';
    this.labels = [];
    this.data = [];
    this.datasetOverride = [
    ]
    this.options = {
      showLines: false,
      scales: {
        xAxes: [
          {
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
              display: true,
              fontSize: 16
            },
            ticks: {
              min: 0,
              max: 5,
              stepSize: 1
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              suggestedMin: 8
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
      types() {
        return [
          {val: 'traveltime', name: 'Travel Time'},
        ]
      },

      students() {
        this.data = [];
        this.labels = [];
        this.options.scales.xAxes[0].scaleLabel.labelString = this.type.name;

        this.groupedStudents = _.groupBy(Students.find().fetch(), this.type.val);
        let result = {};

        for (let key in this.groupedStudents) {
          if (key == 'undefined') return;
          let count = this.groupedStudents[key].length;
          let total = 0;

          this.groupedStudents[key].forEach( (student) => {
            if(student.G3 < 2) console.log(student);
            let finalGrade = parseInt(student.G3);
            total += finalGrade;
            this.data.push({x: key, y: finalGrade})
          })

          // this.labels.push(key);
          // this.data[0].push( {x: key, y: (total / count).toFixed(2) } );
        }

        console.log(this.data);
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