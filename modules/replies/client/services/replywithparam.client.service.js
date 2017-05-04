(function () {
  'use strict';

  angular
    .module('replies')
    .factory('repliesService2', repliesService2);

  repliesService2.$inject = ['$resource'];

  function repliesService2($resource) {
    return $resource('api/replies/a/:replyDerId', {
      replyDerId: ''
    });
  }
})();
