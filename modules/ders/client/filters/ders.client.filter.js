(function () {
  'use strict';

  angular
    .module('ders')
    .filter('pagination', ders);

  ders.$inject = [/*Example: '$state', '$window' */];

  function ders(/*Example: $state, $window */) {
    return function (data, start) {
      // Ders directive logic
      return data.slice(start);
    };
  }
})();
