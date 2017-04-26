import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import 'angular-chart.js';

import template from './greentree.jade';
import { name as Titlebar } from '../titlebar/titlebar';
import { name as BarChart } from '../charts/bar/bar';
import { name as LineChart } from '../charts/line/line';

class Greentree {}

const name = 'greentree';

export default angular.module(name, [
  angularMeteor,
  ngMaterial,
  uiRouter,
  Titlebar,
  BarChart,
  LineChart,
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
    .iconSet('editor',
      iconPath + 'svg-sprite-editor.svg')
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