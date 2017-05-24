(function() {
  'use strict';

  angular
    .module('sayfalars')
    .controller('SayfalarFrontController', SayfalarFrontController);

  SayfalarFrontController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sayfalarResolve'];

  function SayfalarFrontController($scope, $state, $window, Authentication, sayfalar) {
    var vm = this;


    vm.authentication = Authentication;
    vm.sayfalar = sayfalar;
    vm.error = null;
  }
})();
