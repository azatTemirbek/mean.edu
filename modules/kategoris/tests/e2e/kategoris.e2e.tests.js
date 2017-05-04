'use strict';

describe('Kategoris E2E Tests:', function () {
  describe('Test Kategoris page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/kategoris');
      expect(element.all(by.repeater('kategori in kategoris')).count()).toEqual(0);
    });
  });
});
