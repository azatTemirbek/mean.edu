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
      title: 'Ders Listesi',
      state: 'ders.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'ders', {
      title: 'Yeni Ders',
      state: 'ders.create',
      roles: ['user']
    });
  }
}());
