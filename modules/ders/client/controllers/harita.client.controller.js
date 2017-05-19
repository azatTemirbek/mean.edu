(function() {
  'use strict';

  angular
    .module('ders')
    .controller('HaritaController', HaritaController);

  HaritaController.$inject = ['$scope', 'mapService', 'geolocation'];


  function HaritaController($scope, mapService, geolocation) {

    var vm = this;
    vm.currentPositionB={};
    vm.fetch = fetcher;
    fetcher();
    function fetcher(rad) {
      geolocation.getLocation().then(function(data){
        vm.currentPositionB = { lat:data.coords.latitude, lng:data.coords.longitude, zoom: 13 };
        return data;
      }).then(function (data) {
        vm.nearMap = mapService.query({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          rad: (rad || 0.9)
          // by dfault it gets 100 km
        });
      });
    }

  }
})();
