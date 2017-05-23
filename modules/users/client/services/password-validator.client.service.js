'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Lütfen 10\'dan fazla karakter, sayı, küçük harf, büyük harf ve özel karakter içeren bir parola girin.';
        return popoverMsg;
      }
    };
  }
]);
