(function () {
  'use strict';

  angular
    .module('ders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Ders',
      state: 'ders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'ders', {
      title: 'List Ders',
      state: 'ders.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'ders', {
      title: 'Create Der',
      state: 'ders.create',
      roles: ['user']
    });
  }
}());
