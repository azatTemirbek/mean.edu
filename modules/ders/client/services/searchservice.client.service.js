(function () {
  'use strict';

  angular
    .module('ders')
    .factory('dersSearchService', dersService);

  dersService.$inject = ['$resource'];

  function dersService($resource) {
    return $resource('/api/dersAra/:srch', {
      srch: ''
    });
  }
})();
