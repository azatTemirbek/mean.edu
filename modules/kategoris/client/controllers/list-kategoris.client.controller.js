(function () {
  'use strict';

  angular
    .module('kategoris')
    .controller('KategorisListController', KategorisListController);

  KategorisListController.$inject = ['KategorisService'];

  function KategorisListController(KategorisService) {
    var vm = this;

    vm.kategoris = KategorisService.query();
  }
}());
