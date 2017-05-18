(function () {
  'use strict';

  angular
    .module('ders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('harita', {
        url: '/harita',
        templateUrl: 'modules/ders/client/views/harita.client.view.html',
        controller: 'HaritaController',
        controllerAs: 'vm'
      })
      .state('goruntulu', {
        url: '/goruntulu',
        templateUrl: 'modules/ders/client/views/goruntulu.client.view.html',
        controller: 'GoruntuluController',
        controllerAs: 'vm'
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
          pageTitle: 'Ders List'
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
          roles: ['user', 'admin'],
          pageTitle: 'Ders Create'
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
          roles: ['user', 'admin'],
          pageTitle: 'Edit Der {{ derResolve.name }}'
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
          pageTitle: 'Der {{ derResolve.name }}'
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
