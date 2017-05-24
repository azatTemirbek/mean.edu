(function () {
  'use strict';

  // Sayfalars controller
  angular
    .module('sayfalars')
    .controller('SayfalarsController', SayfalarsController);

  SayfalarsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sayfalarResolve'];

  function SayfalarsController ($scope, $state, $window, Authentication, sayfalar) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sayfalar = sayfalar;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.tinymceOptions = {
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };

    // Remove existing Sayfalar
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sayfalar.$remove($state.go('sayfalars.list'));
      }
    }

    // Save Sayfalar
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sayfalarForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sayfalar._id) {
        vm.sayfalar.$update(successCallback, errorCallback);
      } else {
        vm.sayfalar.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sayfalars.view', {
          sayfalarId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
