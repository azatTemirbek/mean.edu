(function () {
  'use strict';

  angular
    .module('sayfalars')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sayfalar', {
        abstract: true,
        url: '/sayfalar',
        template: '<ui-view/>'
      })
      .state('sayfalar.view', {
        url: '/:uzanti',
        templateUrl: 'modules/sayfalars/client/views/sayfalar-front.client.view.html',
        controller: 'SayfalarFrontController',
        controllerAs: 'vm',
        resolve: {
          sayfalarResolve: getSayfalarr
        },
        data: {
          roles: ['teacher','student','admin'],
          pageTitle: 'Sayfalar {{ sayfalarResolve.baslik }}'
        }
      })
      .state('sayfalars', {
        abstract: true,
        url: '/sayfalars',
        template: '<ui-view/>'
      })
      .state('sayfalars.list', {
        url: '',
        templateUrl: 'modules/sayfalars/client/views/list-sayfalars.client.view.html',
        controller: 'SayfalarsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sayfalar listesi admin panel'
        }
      })
      .state('sayfalars.create', {
        url: '/create',
        templateUrl: 'modules/sayfalars/client/views/form-sayfalar.client.view.html',
        controller: 'SayfalarsController',
        controllerAs: 'vm',
        resolve: {
          sayfalarResolve: newSayfalar
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Sayfalar yonetim'
        }
      })
      .state('sayfalars.edit', {
        url: '/:sayfalarId/edit',
        templateUrl: 'modules/sayfalars/client/views/form-sayfalar.client.view.html',
        controller: 'SayfalarsController',
        controllerAs: 'vm',
        resolve: {
          sayfalarResolve: getSayfalar
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Sayfa düzenle {{ sayfalarResolve.name }}'
        }
      })
      .state('sayfalars.view', {
        url: '/:sayfalarId',
        templateUrl: 'modules/sayfalars/client/views/view-sayfalar.client.view.html',
        controller: 'SayfalarsController',
        controllerAs: 'vm',
        resolve: {
          sayfalarResolve: getSayfalar
        },
        data: {
          pageTitle: 'Sayfalar {{ sayfalarResolve.name }}'
        }
      });
  }

  getSayfalar.$inject = ['$stateParams', 'SayfalarsService'];

  function getSayfalar($stateParams, SayfalarsService) {
    return SayfalarsService.get({
      sayfalarId: $stateParams.sayfalarId
    }).$promise;
  }
  getSayfalarr.$inject = ['$stateParams', 'sayfalarFrontsService'];

  function getSayfalarr($stateParams, sayfalarFrontsService) {
    return sayfalarFrontsService.get({
      uzanti: $stateParams.uzanti
    }).$promise;
  }

  newSayfalar.$inject = ['SayfalarsService'];

  function newSayfalar(SayfalarsService) {
    return new SayfalarsService();
  }
}());
