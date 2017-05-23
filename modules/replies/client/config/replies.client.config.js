(function () {
  'use strict';

  angular
    .module('replies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Replies',
      state: 'replies',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'replies', {
      title: 'List Replies',
      state: 'replies.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'replies', {
      title: 'Create Reply',
      state: 'replies.create',
      roles: ['admin']
    });
  }
}());
