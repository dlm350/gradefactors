import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import 'angular-chart.js';

import template from './greentree.jade';

import { Students } from '/imports/api/students';

class Greentree {
  constructor ($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('students');

    this.helpers({
      students() {
        return Students.find().fetch();
      },

      labels() {
        return ['G1', 'G2', 'G3']
      },

      data() {
        let students = Students.find({}).fetch();
        let g1 = 0;
        let g2 = 0;
        let g3 = 0;

        students.forEach(function(student){
          g1 = g1 + parseInt(student.G1);
          g2 = g2 + parseInt(student.G2);
          g3 = g3 + parseInt(student.G3);
        })

        return [g1, g2, g3];
      }
    })
  }
}

const name = 'greentree';

export default angular.module(name, [
  angularMeteor,
  ngMaterial,
  uiRouter,
  'chart.js'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Greentree
})
.config(config)
// .run(run);

function config($locationProvider, $urlRouterProvider, $qProvider, $mdIconProvider){
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  // $qProvider.errorOnUnhandledRejections(false);

  // $mdThemingProvider.theme('default')
  //   .primaryPalette('teal')
  //   .accentPalette('orange');

  const iconPath = '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';
  $mdIconProvider
    .iconSet('action',
      iconPath + 'svg-sprite-action.svg')
    .iconSet('av',
      iconPath + 'svg-sprite-av.svg')
    .iconSet('communication',
      iconPath + 'svg-sprite-communication.svg')
    .iconSet('content',
      iconPath + 'svg-sprite-content.svg')
    .iconSet('file',
      iconPath + 'svg-sprite-file.svg')
    .iconSet('image',
      iconPath + 'svg-sprite-image.svg')
    .iconSet('navigation',
      iconPath + 'svg-sprite-navigation.svg')
    .iconSet('notification',
      iconPath + 'svg-sprite-notification.svg')
    .iconSet('social',
      iconPath + 'svg-sprite-social.svg')
    .iconSet('toggle',
      iconPath + 'svg-sprite-toggle.svg')
}

// function run($rootScope, $state, $transitions){
//   'ngInject';

//   routerConfig($rootScope, $state, $transitions);

//   return;
// }