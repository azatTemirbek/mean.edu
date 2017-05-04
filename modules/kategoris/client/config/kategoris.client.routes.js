(function () {
  'use strict';

  angular
    .module('kategoris')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('kategoris', {
        abstract: true,
        url: '/kategoris',
        template: '<ui-view/>'
      })
      .state('kategoris.list', {
        url: '',
        templateUrl: 'modules/kategoris/client/views/list-kategoris.client.view.html',
        controller: 'KategorisListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Kategoris List'
        }
      })
      .state('kategoris.create', {
        url: '/create',
        templateUrl: 'modules/kategoris/client/views/form-kategori.client.view.html',
        controller: 'KategorisController',
        controllerAs: 'vm',
        resolve: {
          kategoriResolve: newKategori
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Kategoris Create'
        }
      })
      .state('kategoris.edit', {
        url: '/:kategoriId/edit',
        templateUrl: 'modules/kategoris/client/views/form-kategori.client.view.html',
        controller: 'KategorisController',
        controllerAs: 'vm',
        resolve: {
          kategoriResolve: getKategori
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Kategori {{ kategoriResolve.name }}'
        }
      })
      .state('kategoris.view', {
        url: '/:kategoriId',
        templateUrl: 'modules/kategoris/client/views/view-kategori.client.view.html',
        controller: 'KategorisController',
        controllerAs: 'vm',
        resolve: {
          kategoriResolve: getKategori
        },
        data: {
          pageTitle: 'Kategori {{ kategoriResolve.name }}'
        }
      });
  }

  getKategori.$inject = ['$stateParams', 'KategorisService'];

  function getKategori($stateParams, KategorisService) {
    return KategorisService.get({
      kategoriId: $stateParams.kategoriId
    }).$promise;
  }

  newKategori.$inject = ['KategorisService'];

  function newKategori(KategorisService) {
    return new KategorisService();
  }
}());
