(function () {
  'use strict';

  angular
    .module('sayfalars')
    .controller('SayfalarsListController', SayfalarsListController);

  SayfalarsListController.$inject = ['SayfalarsService'];

  function SayfalarsListController(SayfalarsService) {
    var vm = this;

    vm.sayfalars = SayfalarsService.query();
  }
}());
