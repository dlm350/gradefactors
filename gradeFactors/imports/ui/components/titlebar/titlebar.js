// Dependencies
import angular from 'angular';
import angularMeteor from 'angular-meteor';

// Template
import template from './titlebar.jade';

// TitleBar Module
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