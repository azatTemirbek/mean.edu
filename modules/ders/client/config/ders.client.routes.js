(function () {
  'use strict';

  angular
    .module('ders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        templateUrl: 'modules/ders/client/views/search.client.view.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      })
      .state('harita', {
        url: '/harita',
        templateUrl: 'modules/ders/client/views/harita.client.view.html',
        controller: 'HaritaController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dersleri Haritaya Göre Görüntüle'
        }
      })
      .state('ders', {
        abstract: true,
        url: '/ders',
        template: '<ui-view/>'
      })
      .state('ders.list', {
        url: '',
        templateUrl: 'modules/ders/client/views/list-ders.client.view.html',
        controller: 'DersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ders Listesi'
        }
      })
      .state('ders.create', {
        url: '/create',
        templateUrl: 'modules/ders/client/views/form-der.client.view.html',
        controller: 'DersController',
        controllerAs: 'vm',
        resolve: {
          derResolve: newDer
        },
        data: {
          roles: ['teacher', 'admin'],
          pageTitle: 'Yeni Ders Ekle'
        }
      })
      .state('ders.edit', {
        url: '/:derId/edit',
        templateUrl: 'modules/ders/client/views/form-der.client.view.html',
        controller: 'DersController',
        controllerAs: 'vm',
        resolve: {
          derResolve: getDer
        },
        data: {
          roles: ['teacher', 'admin'],
          pageTitle: '{{ derResolve.name }} Dersi Düzenle'
        }
      })
      .state('ders.view', {
        url: '/:derId',
        templateUrl: 'modules/ders/client/views/view-der.client.view.html',
        controller: 'DersController',
        controllerAs: 'vm',
        resolve: {
          derResolve: getDer
        },
        data: {
          pageTitle: '{{ derResolve.name }} Dersi Görüntüle'
        }
      });
  }

  getDer.$inject = ['$stateParams', 'DersService'];

  function getDer($stateParams, DersService) {
    return DersService.get({
      derId: $stateParams.derId
    }).$promise;
  }

  newDer.$inject = ['DersService'];

  function newDer(DersService) {
    return new DersService();
  }
}());
