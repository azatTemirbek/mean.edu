(function () {
  'use strict';

  describe('Ders Route Tests', function () {
    // Initialize global variables
    var $scope,
      DersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DersService = _DersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ders');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ders');
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
          DersController,
          mockDer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ders.view');
          $templateCache.put('modules/ders/client/views/view-der.client.view.html', '');

          // create mock Der
          mockDer = new DersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Der Name'
          });

          // Initialize Controller
          DersController = $controller('DersController as vm', {
            $scope: $scope,
            derResolve: mockDer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:derId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.derResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            derId: 1
          })).toEqual('/ders/1');
        }));

        it('should attach an Der to the controller scope', function () {
          expect($scope.vm.der._id).toBe(mockDer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ders/client/views/view-der.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DersController,
          mockDer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ders.create');
          $templateCache.put('modules/ders/client/views/form-der.client.view.html', '');

          // create mock Der
          mockDer = new DersService();

          // Initialize Controller
          DersController = $controller('DersController as vm', {
            $scope: $scope,
            derResolve: mockDer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.derResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ders/create');
        }));

        it('should attach an Der to the controller scope', function () {
          expect($scope.vm.der._id).toBe(mockDer._id);
          expect($scope.vm.der._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ders/client/views/form-der.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DersController,
          mockDer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ders.edit');
          $templateCache.put('modules/ders/client/views/form-der.client.view.html', '');

          // create mock Der
          mockDer = new DersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Der Name'
          });

          // Initialize Controller
          DersController = $controller('DersController as vm', {
            $scope: $scope,
            derResolve: mockDer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:derId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.derResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            derId: 1
          })).toEqual('/ders/1/edit');
        }));

        it('should attach an Der to the controller scope', function () {
          expect($scope.vm.der._id).toBe(mockDer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ders/client/views/form-der.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
