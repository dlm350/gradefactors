import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './titlebar.jade';

class Titlebar {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
    })
  }
}

const name = 'titlebar';

export default angular.module(name, [
  angularMeteor,
])
.component(name, {
  template,
  controllerAs: name,
  controller: Titlebar
});