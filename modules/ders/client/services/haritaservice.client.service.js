(function () {
  'use strict';

  angular
    .module('ders')
    .factory('mapService', mapService);

  mapService.$inject = ['$resource'];
  function mapService($resource) {
    return $resource('/api/ders/:lat/:lng/:rad', {
      lat: '',
      lng: '',
      rad: ''
    });
  }
})();
