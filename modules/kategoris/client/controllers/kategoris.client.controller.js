(function () {
  'use strict';

  // Kategoris controller
  angular
    .module('kategoris')
    .controller('KategorisController', KategorisController);

  KategorisController.$inject = ['$scope', '$state', '$window', 'Authentication', 'kategoriResolve'];

  function KategorisController ($scope, $state, $window, Authentication, kategori) {
    var vm = this;

    vm.authentication = Authentication;
    vm.kategori = kategori;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Kategori
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.kategori.$remove($state.go('kategoris.list'));
      }
    }

    // Save Kategori
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.kategoriForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.kategori._id) {
        vm.kategori.$update(successCallback, errorCallback);
      } else {
        vm.kategori.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('kategoris.view', {
          kategoriId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
