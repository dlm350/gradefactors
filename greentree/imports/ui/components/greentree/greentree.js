import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import 'angular-chart.js';

import template from './greentree.jade';
import { name as Titlebar } from '../titlebar/titlebar';
import { name as Average } from '../average/average';
import { name as Health } from '../health/health';
import { name as Travel } from '../travel/travel';
import { name as Stuff } from '../stuff/stuff';

class Greentree {}

const name = 'greentree';

export default angular.module(name, [
  angularMeteor,
  ngMaterial,
  uiRouter,
  Titlebar,
  Average,
  Health,
  Travel,
  Stuff,
  'chart.js'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Greentree
})
.config(config)

function config($locationProvider, $urlRouterProvider, $qProvider, $mdThemingProvider, $mdIconProvider){
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue-grey');

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