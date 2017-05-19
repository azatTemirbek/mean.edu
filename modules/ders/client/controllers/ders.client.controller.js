(function () {
  'use strict';

  // Ders controller
  angular
    .module('ders')
    .controller('DersController', DersController);

  DersController.$inject = [
    '$scope',
    '$state',
    '$window',
    'Authentication',
    'derResolve',
    'KategorisService',
    'RepliesService',
    'repliesService2',
    'geolocation'
  ];

  function DersController (
    $scope,
    $state,
    $window,
    Authentication,
    der,
    KategorisService,
    RepliesService,
    repliesService2,
    geolocation
  ) {
    var vm = this;

    vm.authentication = Authentication;
    vm.kategoris = KategorisService.query();
    vm.der = der;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.safe = safe;
    vm.tinymceOptions = {
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };
    // getting all post
    function safe(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.replyForm');
        return false;
      }
      RepliesService.save(vm.replyR);
      fillComments();
    }

    if (vm.der._id) {
      // edit yaparken
      fillComments();
      vm.coords=vm.der.coords;
    }else {
      // new yaparken
      vm.coords={ lat:39, lng:32, zoom: 5 };
    }
    function fillComments() {
      vm.replys = repliesService2.query({ replyDerId: vm.der._id });
      vm.replyR = {};
      vm.replyR.dersId = vm.der._id;
      vm.safe = safe;
      vm.sum=0;
      vm.replys.$promise.then(function (data) {
        for (var i=0; i<data.length; i++){
          vm.sum= +vm.sum + data[i].rating;
        }
        vm.avar=vm.sum/data.length;
      });
    }


    geolocation.getLocation().then(function(data){
      vm.coordsR = { lat:data.coords.latitude, lng:data.coords.longitude, zoom:16 };
    });

    vm.findMe = function () {
      geolocation.getLocation().then(function(data){
        vm.coords = { lat:data.coords.latitude, lng:data.coords.longitude, zoom:16 };
      });
    };


    // Remove existing Der
    function remove() {
      if ($window.confirm('Silmek istediğine emin misin?')) {
        vm.der.$remove($state.go('ders.list'));
      }
    }


    vm.hoveringOver = function(value) {
      vm.overStar = value;
      vm.percent = 100 * (value / 10);
    };

    vm.date=new Date();


    // Save Der
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.derForm');
        return false;
      }
      vm.der.coords=vm.coords;
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
