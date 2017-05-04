// Kategoris service used to communicate Kategoris REST endpoints
(function () {
  'use strict';

  angular
    .module('kategoris')
    .factory('KategorisService', KategorisService);

  KategorisService.$inject = ['$resource'];

  function KategorisService($resource) {
    return $resource('api/kategoris/:kategoriId', {
      kategoriId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
