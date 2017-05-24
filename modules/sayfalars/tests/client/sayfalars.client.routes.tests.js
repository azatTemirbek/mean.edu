(function () {
  'use strict';

  describe('Sayfalars Route Tests', function () {
    // Initialize global variables
    var $scope,
      SayfalarsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SayfalarsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SayfalarsService = _SayfalarsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sayfalars');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sayfalars');
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
          SayfalarsController,
          mockSayfalar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sayfalars.view');
          $templateCache.put('modules/sayfalars/client/views/view-sayfalar.client.view.html', '');

          // create mock Sayfalar
          mockSayfalar = new SayfalarsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sayfalar Name'
          });

          // Initialize Controller
          SayfalarsController = $controller('SayfalarsController as vm', {
            $scope: $scope,
            sayfalarResolve: mockSayfalar
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sayfalarId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sayfalarResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sayfalarId: 1
          })).toEqual('/sayfalars/1');
        }));

        it('should attach an Sayfalar to the controller scope', function () {
          expect($scope.vm.sayfalar._id).toBe(mockSayfalar._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sayfalars/client/views/view-sayfalar.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SayfalarsController,
          mockSayfalar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sayfalars.create');
          $templateCache.put('modules/sayfalars/client/views/form-sayfalar.client.view.html', '');

          // create mock Sayfalar
          mockSayfalar = new SayfalarsService();

          // Initialize Controller
          SayfalarsController = $controller('SayfalarsController as vm', {
            $scope: $scope,
            sayfalarResolve: mockSayfalar
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sayfalarResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sayfalars/create');
        }));

        it('should attach an Sayfalar to the controller scope', function () {
          expect($scope.vm.sayfalar._id).toBe(mockSayfalar._id);
          expect($scope.vm.sayfalar._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sayfalars/client/views/form-sayfalar.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SayfalarsController,
          mockSayfalar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sayfalars.edit');
          $templateCache.put('modules/sayfalars/client/views/form-sayfalar.client.view.html', '');

          // create mock Sayfalar
          mockSayfalar = new SayfalarsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sayfalar Name'
          });

          // Initialize Controller
          SayfalarsController = $controller('SayfalarsController as vm', {
            $scope: $scope,
            sayfalarResolve: mockSayfalar
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sayfalarId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sayfalarResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sayfalarId: 1
          })).toEqual('/sayfalars/1/edit');
        }));

        it('should attach an Sayfalar to the controller scope', function () {
          expect($scope.vm.sayfalar._id).toBe(mockSayfalar._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sayfalars/client/views/form-sayfalar.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
