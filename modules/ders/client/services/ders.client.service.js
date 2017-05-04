// Ders service used to communicate Ders REST endpoints
(function () {
  'use strict';

  angular
    .module('ders')
    .factory('DersService', DersService);

  DersService.$inject = ['$resource'];

  function DersService($resource) {
    return $resource('api/ders/:derId', {
      derId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
