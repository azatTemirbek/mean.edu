(function() {
  'use strict';

  angular
    .module('videocall')
    .controller('VideocallController', VideocallController);

  VideocallController.$inject = ['$scope'];

  function VideocallController($scope) {
    var vm = this;
  }
})();
