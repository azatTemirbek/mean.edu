// Sayfalars service used to communicate Sayfalars REST endpoints
(function () {
  'use strict';

  angular
    .module('sayfalars')
    .factory('SayfalarsService', SayfalarsService);

  SayfalarsService.$inject = ['$resource'];

  function SayfalarsService($resource) {
    return $resource('api/sayfalars/:sayfalarId', {
      sayfalarId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
