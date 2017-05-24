'use strict';

describe('Sayfalars E2E Tests:', function () {
  describe('Test Sayfalars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sayfalars');
      expect(element.all(by.repeater('sayfalar in sayfalars')).count()).toEqual(0);
    });
  });
});
