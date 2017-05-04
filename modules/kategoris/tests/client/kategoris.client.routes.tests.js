(function () {
  'use strict';

  describe('Kategoris Route Tests', function () {
    // Initialize global variables
    var $scope,
      KategorisService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KategorisService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KategorisService = _KategorisService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('kategoris');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/kategoris');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          KategorisController,
          mockKategori;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('kategoris.view');
          $templateCache.put('modules/kategoris/client/views/view-kategori.client.view.html', '');

          // create mock Kategori
          mockKategori = new KategorisService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Kategori Name'
          });

          // Initialize Controller
          KategorisController = $controller('KategorisController as vm', {
            $scope: $scope,
            kategoriResolve: mockKategori
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:kategoriId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.kategoriResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            kategoriId: 1
          })).toEqual('/kategoris/1');
        }));

        it('should attach an Kategori to the controller scope', function () {
          expect($scope.vm.kategori._id).toBe(mockKategori._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/kategoris/client/views/view-kategori.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KategorisController,
          mockKategori;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('kategoris.create');
          $templateCache.put('modules/kategoris/client/views/form-kategori.client.view.html', '');

          // create mock Kategori
          mockKategori = new KategorisService();

          // Initialize Controller
          KategorisController = $controller('KategorisController as vm', {
            $scope: $scope,
            kategoriResolve: mockKategori
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.kategoriResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/kategoris/create');
        }));

        it('should attach an Kategori to the controller scope', function () {
          expect($scope.vm.kategori._id).toBe(mockKategori._id);
          expect($scope.vm.kategori._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/kategoris/client/views/form-kategori.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KategorisController,
          mockKategori;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('kategoris.edit');
          $templateCache.put('modules/kategoris/client/views/form-kategori.client.view.html', '');

          // create mock Kategori
          mockKategori = new KategorisService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Kategori Name'
          });

          // Initialize Controller
          KategorisController = $controller('KategorisController as vm', {
            $scope: $scope,
            kategoriResolve: mockKategori
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:kategoriId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.kategoriResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            kategoriId: 1
          })).toEqual('/kategoris/1/edit');
        }));

        it('should attach an Kategori to the controller scope', function () {
          expect($scope.vm.kategori._id).toBe(mockKategori._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/kategoris/client/views/form-kategori.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
