(function () {
  'use strict';

  angular
    .module('kategoris')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Kategoris',
      state: 'kategoris',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'kategoris', {
      title: 'List Kategoris',
      state: 'kategoris.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'kategoris', {
      title: 'Create Kategori',
      state: 'kategoris.create',
      roles: ['user']
    });
  }
}());
