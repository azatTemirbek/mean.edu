(function () {
  'use strict';

  angular
    .module('sayfalars')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sayfalars',
      state: 'sayfalars',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sayfalars', {
      title: 'List Sayfalars',
      state: 'sayfalars.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sayfalars', {
      title: 'Create Sayfalar',
      state: 'sayfalars.create',
      roles: ['teacher']
    });
  }
}());
