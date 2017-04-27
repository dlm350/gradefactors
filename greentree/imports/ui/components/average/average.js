import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import _ from 'underscore';

import template from './average.jade';

import { Students } from '/imports/api/students';

class Average {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subReady = false;
    this.subscribe('average', () => [{
      type: this.getReactively('type')
    }], () => {
      this.subReady = true;
    })

    this.colors = [
      '#D46A6A',
      '#D49A6A',
      '#55AA55',
      '#407F7F',
      '#AA3939',
      '#AA6C39',
      '#2D882D',
      '#226666',
      '#801515',
      '#804515',
      '#116611',
      '#0D4D4D'
    ];
    this.type = '';
    this.labels = [];
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
        this.bar.data = [ [/*Min*/], [/*Max*/], [/*Avg*/] ];
        this.pie.data = [];
        this.labels = [];
        this.bar.options.scales.xAxes[0].scaleLabel.labelString = this.type.name;

        let sortedStudents = _.sortBy(Students.find().fetch(), this.type.val);
        let groupedStudents;

        if ( this.type.val == 'absences' ) {
          groupedStudents = _.groupBy(sortedStudents, function(student) {
            let absences = parseInt(student.absences);
            if( absences == 0 ) return '0';

            let n = 1;
            while ( n < 100 ) {
              if ( absences < n+10 ) {
                return ( n.toString() + '-' + (n+9).toString() );
              }
              n += 10;
            }
          });
        } else {
          groupedStudents = _.groupBy(sortedStudents, this.type.val);
        }

        for (let key in groupedStudents) {
          if (key == 'undefined') return;
          let count = groupedStudents[key].length;
          let total = 0;

          let min = 20;
          let max = 0;
          groupedStudents[key].forEach( (student) => {
            let grade = parseInt(student.G3);
            total += grade;
            min = (grade < min) ? grade : min;
            max = (grade > max) ? grade : max;
          })

          this.labels.push(key);
          this.bar.data[2].push( (total / count).toFixed(2) );
          this.bar.data[0].push( min );
          this.bar.data[1].push( max );
          this.pie.data.push( count );
        }
      }
    });
  }

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

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('average', {
      url: '/average',
      template: '<average></average>'
    })
}