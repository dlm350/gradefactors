import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

import template from './bar.jade';

import { Students } from '/imports/api/students';

class BarChart {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('barChart', () => [{
      type: this.getReactively('type')
    }])

    this.type = '';
    this.labels = [];
    this.data = [];
    this.options = {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16
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
            total += parseInt(student.G3);
          })

          this.labels.push(key);
          this.data.push( (total / count).toFixed(2) );
        }
      }
    });
  }
}

const name = 'barChart';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: BarChart
})
.config(config)

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('bar_chart', {
      url: '/bar-chart',
      template: '<bar-chart></bar-chart>'
    })
}