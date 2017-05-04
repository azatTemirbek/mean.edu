(function () {
  'use strict';

  // Ders controller
  angular
    .module('ders')
    .controller('DersController', DersController);

  DersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'derResolve', 'KategorisService', 'RepliesService', 'repliesService2'];

  function DersController ($scope, $state, $window, Authentication, der, KategorisService, RepliesService, repliesService2) {
    var vm = this;

    vm.authentication = Authentication;
    vm.kategoris = KategorisService.query();
    vm.der = der;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.tinymceOptions = {
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };
    // getting all post
    vm.replys = repliesService2.query({ replyDerId: vm.der._id });
    vm.replyR={};
    vm.replyR.dersId = vm.der._id;
    vm.safe = safe;
    function safe(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.replyForm');
        return false;
      }
      RepliesService.save(vm.replyR);
      vm.replyR={};
      vm.replys = repliesService2.query({ replyDerId: vm.der._id });
    }









    // Remove existing Der
    function remove() {
      if ($window.confirm('Silmek istediğine emin misin?')) {
        vm.der.$remove($state.go('ders.list'));
      }
    }


    // Save Der
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.derForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.der._id) {
        vm.der.$update(successCallback, errorCallback);
      } else {
        vm.der.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ders.view', {
          derId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
