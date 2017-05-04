(function () {
  'use strict';

  describe('Kategoris List Controller Tests', function () {
    // Initialize global variables
    var KategorisListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      KategorisService,
      mockKategori;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _KategorisService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      KategorisService = _KategorisService_;

      // create mock article
      mockKategori = new KategorisService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Kategori Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Kategoris List controller.
      KategorisListController = $controller('KategorisListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockKategoriList;

      beforeEach(function () {
        mockKategoriList = [mockKategori, mockKategori];
      });

      it('should send a GET request and return all Kategoris', inject(function (KategorisService) {
        // Set POST response
        $httpBackend.expectGET('api/kategoris').respond(mockKategoriList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.kategoris.length).toEqual(2);
        expect($scope.vm.kategoris[0]).toEqual(mockKategori);
        expect($scope.vm.kategoris[1]).toEqual(mockKategori);

      }));
    });
  });
}());
