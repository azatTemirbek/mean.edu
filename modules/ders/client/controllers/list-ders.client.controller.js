(function () {
  'use strict';

  angular
    .module('ders')
    .controller('DersListController', DersListController);

  DersListController.$inject = ['DersService', 'KategorisService'];

  function DersListController(DersService, KategorisService){
    var vm = this;
    vm.ders = DersService.query();
    vm.kategoris = KategorisService.query();
    vm.currentPage = 1 ;
    vm.pageSize = 20;
  }
}());
