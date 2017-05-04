'use strict';

describe('Ders E2E Tests:', function () {
  describe('Test Ders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ders');
      expect(element.all(by.repeater('der in ders')).count()).toEqual(0);
    });
  });
});
