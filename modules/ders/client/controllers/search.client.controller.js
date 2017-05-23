(function() {
  'use strict';

  angular
    .module('ders')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['KategorisService','dersSearchService'];

  function SearchController(KategorisService, dersSearchService) {
    var vm = this;
    vm.kategoris = KategorisService.query();

    vm.lessons={};

    vm.searchvalue = searchvalueF;
    function searchvalueF(srec) {
      vm.lessons = dersSearchService.query({
        srch: srec
      });
    }
    init();

    function init() {
    }
  }
})();
