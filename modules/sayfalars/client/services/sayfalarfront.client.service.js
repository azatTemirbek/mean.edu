(function () {
  'use strict';

  angular
    .module('sayfalars')
    .factory('sayfalarFrontsService', sayfalarsService);

  sayfalarsService.$inject = ['$resource'];

  function sayfalarsService($resource) {
    return $resource('api/sayfalarsF/:uzanti', {
      uzanti: '@uzanti'
    });
  }
})();
